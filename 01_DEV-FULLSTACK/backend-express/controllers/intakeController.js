const supabase = require('../config/supabase');

// Fungsi ini menghitung ulang total kalori dan air hari ini, lalu menyimpannya ke daily_summaries
// --- HELPER: Pengganti DailySummaryService (Versi Lengkap dengan Makro Nutrisi) ---
const updateDailySummary = async (userId) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const startOfToday = `${today}T00:00:00.000Z`;
        const endOfToday = `${today}T23:59:59.999Z`;

        // 1. Hitung Kalori Masuk & Makro Nutrisi (Join dengan tabel foods)
        const { data: foods } = await supabase
            .from('user_food_intakes')
            .select('total_calories, qty_grams, food:foods(protein, carbs, fat)')
            .eq('user_id', userId)
            .gte('consumed_at', startOfToday)
            .lte('consumed_at', endOfToday);
        
        let caloriesIn = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
        
        (foods || []).forEach(item => {
            caloriesIn += (item.total_calories || 0);
            if (item.food) {
                // Rumus: (nutrisi * gram / 100) -> Dibulatkan
                totalProtein += (item.food.protein * item.qty_grams / 100);
                totalCarbs += (item.food.carbs * item.qty_grams / 100);
                totalFat += (item.food.fat * item.qty_grams / 100);
            }
        });

        // 2. Hitung total Air Minum
        const { data: waters } = await supabase
            .from('user_water_intakes')
            .select('water')
            .eq('user_id', userId)
            .gte('consumed_at', startOfToday)
            .lte('consumed_at', endOfToday);
        
        const totalWater = (waters || []).reduce((sum, item) => sum + (item.water || 0), 0);

        // 3. Hitung total Kalori Keluar (Olahraga)
        const { data: activities } = await supabase
            .from('user_activity_burns')
            .select('calories_burned')
            .eq('user_id', userId)
            .gte('created_at', startOfToday)
            .lte('created_at', endOfToday);
        
        const caloriesOut = (activities || []).reduce((sum, item) => sum + (item.calories_burned || 0), 0);

        // 4. Upsert ke daily_summaries
        const summaryData = {
            calories_in: Math.round(caloriesIn),
            calories_out: Math.round(caloriesOut),
            water: Math.round(totalWater),
            protein: Math.round(totalProtein),
            carbs: Math.round(totalCarbs),
            fat: Math.round(totalFat)
        };

        const { data: existingSummary } = await supabase
            .from('daily_summaries')
            .select('id')
            .eq('user_id', userId)
            .eq('date', today)
            .single();

        if (existingSummary) {
            await supabase.from('daily_summaries').update(summaryData).eq('id', existingSummary.id);
        } else {
            await supabase.from('daily_summaries').insert([{ user_id: userId, date: today, ...summaryData }]);
        }
    } catch (err) {
        console.error('Gagal update daily summary:', err);
    }
};

// --- ENDPOINT MAKANAN ---
exports.storeFood = async (req, res) => {
    try {
        const { food_id, qty_grams, total_calories, consumed_at } = req.body;
        const user = req.user;

        if (!food_id || !qty_grams || total_calories === undefined) {
            return res.status(400).json({ message: 'food_id, qty_grams, dan total_calories wajib diisi.' });
        }

        const { data: intake, error } = await supabase
            .from('user_food_intakes')
            .insert([{
                user_id: user.id,
                food_id: food_id,
                qty_grams: qty_grams,
                total_calories: total_calories,
                consumed_at: consumed_at || new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        // Panggil helper di background (tanpa 'await')
        updateDailySummary(user.id);

        return res.status(201).json({ status: 'success', data: intake });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// --- ENDPOINT AIR MINUM ---
exports.storeWater = async (req, res) => {
    try {
        const { water } = req.body;
        const user = req.user;

        if (!water || water < 1) {
            return res.status(400).json({ message: 'Jumlah air wajib diisi (minimal 1 ml/gelas).' });
        }

        const { data: waterIntake, error } = await supabase
            .from('user_water_intakes')
            .insert([{
                user_id: user.id,
                water: water,
                consumed_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        // Panggil helper di background (tanpa 'await')
        updateDailySummary(user.id);

        return res.status(201).json({
            status: 'success',
            message: 'Air minum tercatat!',
            data: waterIntake
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};