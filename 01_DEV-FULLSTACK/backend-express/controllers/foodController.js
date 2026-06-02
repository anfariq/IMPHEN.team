const supabase = require('../config/supabase');

exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        const { data: foods, error, count } = await supabase
            .from('foods')
            .select('*', { count: 'exact' })
            .range(start, end);

        if (error) throw error;

        return res.status(200).json({
            current_page: page,
            data: foods,
            total: count,
            per_page: limit
        });
    } catch (error) {
        return res.status(500).json({ message: 'Gagal mengambil data makanan', error: error.message });
    }
};

exports.search = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(200).json([]); 
        }

        const { data: foods, error } = await supabase
            .from('foods')
            .select('*')
            .ilike('name', `%${query}%`)
            .limit(15);

        if (error) throw error;

        return res.status(200).json(foods);
    } catch (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan saat mencari makanan' });
    }
};

exports.show = async (req, res) => {
    try {
        const foodId = req.params.id;

        const { data: food, error } = await supabase
            .from('foods')
            .select('*')
            .eq('id', foodId)
            .single();

        if (error || !food) {
            return res.status(404).json({ message: 'Makanan tidak ditemukan' });
        }

        const nutrisi = {
            protein: food.protein,
            lemak: food.fat,
            karbohidrat: food.carbs,
            total_nutrisi: food.protein + food.fat + food.carbs,
            gram: 100
        };

        let aiPrediction = null;
        let aiStatus = 'failed';

        try {
            const mlUrl = process.env.FASTAPI_ML_URL || process.env.ML_SERVICE_URL;
            
            const response = await fetch(`${mlUrl}/predict-calories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nutrisi)
            });

            if (response.ok) {
                const aiResult = await response.json();
                aiPrediction = aiResult.data || null;
                aiStatus = aiResult.status || 'success';
            }
        } catch (mlError) {
            console.error('Gagal menghubungi service ML:', mlError);
            aiStatus = 'ml_service_offline'; 
        }

        return res.status(200).json({
            food_info: food,
            ai_prediction: aiPrediction,
            status: aiStatus
        });

    } catch (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan sistem', error: error.message });
    }
};

exports.store = async (req, res) => {
    try {
        const { food_id, qty_grams, total_calories } = req.body;
        const user = req.user; 

        if (!food_id || !qty_grams || !total_calories) {
            return res.status(400).json({ message: 'Semua field (food_id, qty_grams, total_calories) wajib diisi' });
        }

        const { data: intake, error } = await supabase
            .from('user_food_intakes')
            .insert([{
                user_id: user.id,
                food_id: food_id,
                qty_grams: qty_grams,
                total_calories: total_calories,
                consumed_at: new Date().toISOString() 
            }])
            .select()
            .single();

        if (error) throw error;

        return res.status(201).json({
            status: 'success',
            message: 'Data makan berhasil disimpan!',
            data: intake
        });

    } catch (error) {
        return res.status(500).json({ message: 'Gagal menyimpan catatan makanan', error: error.message });
    }
};