const supabase = require('../config/supabase');

exports.getDashboardData = async (req, res) => {
    try {
        const user = req.user;
        const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
        
        const startOfToday = `${todayDate}T00:00:00.000+07:00`;

        const { data: todaySummary } = await supabase
            .from('daily_summaries')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', todayDate)
            .single();

        const { data: recentMeals } = await supabase
            .from('user_food_intakes')
            .select('*, food:foods(name)')
            .eq('user_id', user.id)
            .gte('consumed_at', startOfToday)
            .order('consumed_at', { ascending: false })
            .limit(5);

        const formattedMeals = (recentMeals || []).map(intake => {
            const dateObj = new Date(intake.consumed_at);
            const time = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
            return {
                name: intake.food?.name || 'Unknown Food',
                time: time,
                calories: intake.total_calories
            };
        });

        const { data: recentActivities } = await supabase
            .from('user_activity_burns')
            .select('*, activity:activities(name)')
            .eq('user_id', user.id)
            .gte('created_at', startOfToday)
            .order('created_at', { ascending: false })
            .limit(5);

        return res.status(200).json({
            target_calories: user.profiles?.[0]?.target_calories || 2000,
            today: {
                calories_in: todaySummary?.calories_in || 0,
                calories_out: todaySummary?.calories_out || 0,
                protein: todaySummary?.protein || 0,
                carbs: todaySummary?.carbs || 0,
                fat: todaySummary?.fat || 0,
                water: todaySummary?.water || 0,
                meals: formattedMeals,
                activities: recentActivities || [],
            }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Gagal memuat dashboard.', error: error.message });
    }
};


exports.getDsInsights = async (req, res) => {
    try {
        const { data: foods, error } = await supabase.from('foods').select('*');
        if (error) throw error;

        if (!foods || foods.length === 0) {
            return res.status(200).json({ message: 'Data makanan masih kosong.' });
        }

        let processedFoods = foods.map(f => {
            const total_nutrisi = (f.protein || 0) + (f.fat || 0) + (f.carbs || 0);
            const protein_efficiency = f.calories > 0 ? (f.protein / f.calories) : 0;
            
            let kategori_kalori = 'Tinggi';
            if (f.calories < 200) kategori_kalori = 'Rendah';
            else if (f.calories <= 400) kategori_kalori = 'Sedang';

            return { ...f, total_nutrisi, protein_efficiency, kategori_kalori };
        });

        const distribution = {
            'Rendah': { count: 0, protein: 0, fat: 0, carbs: 0 },
            'Sedang': { count: 0, protein: 0, fat: 0, carbs: 0 },
            'Tinggi': { count: 0, protein: 0, fat: 0, carbs: 0 },
        };

        processedFoods.forEach(f => {
            const cat = f.kategori_kalori;
            distribution[cat].count += 1;
            distribution[cat].protein += f.protein;
            distribution[cat].fat += f.fat;
            distribution[cat].carbs += f.carbs;
        });

        Object.keys(distribution).forEach(cat => {
            const count = distribution[cat].count || 1;
            distribution[cat].avg_protein = Number((distribution[cat].protein / count).toFixed(1));
            distribution[cat].avg_fat = Number((distribution[cat].fat / count).toFixed(1));
            distribution[cat].avg_carbs = Number((distribution[cat].carbs / count).toFixed(1));
        });

        const validEfficiency = processedFoods.filter(f => f.protein_efficiency > 0);
        const sortedByEfficiency = [...validEfficiency].sort((a, b) => b.protein_efficiency - a.protein_efficiency);
        const top10Efficiency = sortedByEfficiency.slice(0, 10);
        const bottom10Efficiency = sortedByEfficiency.slice(-10).reverse();

        const sortedByTotalNutrisi = [...processedFoods].sort((a, b) => a.total_nutrisi - b.total_nutrisi);
        const q1Index = Math.floor(sortedByTotalNutrisi.length * 0.25);
        const q3Index = Math.floor(sortedByTotalNutrisi.length * 0.75);
        const q1Value = sortedByTotalNutrisi[q1Index]?.total_nutrisi || 0;
        const q3Value = sortedByTotalNutrisi[q3Index]?.total_nutrisi || 0;

        const rendahNutrisi = processedFoods.filter(f => f.total_nutrisi <= q1Value);
        const tinggiNutrisi = processedFoods.filter(f => f.total_nutrisi >= q3Value);

        const terendahKalori = [...rendahNutrisi].sort((a, b) => a.calories - b.calories).slice(0, 5);
        const tertinggiKalori = [...tinggiNutrisi].sort((a, b) => b.calories - a.calories).slice(0, 5);

        return res.status(200).json({
            status: 'success',
            data: {
                kpi: {
                    total_data: processedFoods.length,
                    avg_calories: Number((processedFoods.reduce((a,b) => a + b.calories, 0) / processedFoods.length).toFixed(1)),
                    max_calories: Math.max(...processedFoods.map(f => f.calories)),
                    avg_protein: Number((processedFoods.reduce((a,b) => a + b.protein, 0) / processedFoods.length).toFixed(1))
                },
                distribution,
                protein_efficiency: {
                    top: top10Efficiency.map(f => ({ name: f.name, efficiency: Number(f.protein_efficiency.toFixed(3)) })),
                    bottom: bottom10Efficiency.map(f => ({ name: f.name, efficiency: Number(f.protein_efficiency.toFixed(3)) }))
                },
                extremes: {
                    highest_calories: tertinggiKalori.map(f => ({ name: f.name, calories: f.calories, carbs: f.carbs })),
                    lowest_calories: terendahKalori.map(f => ({ name: f.name, calories: f.calories, carbs: f.carbs }))
                }
            }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Gagal memuat insight DS', error: error.message });
    }
};