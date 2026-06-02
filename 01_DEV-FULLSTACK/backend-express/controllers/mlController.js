const supabase = require('../config/supabase');
const multer = require('multer');

const storage = multer.memoryStorage();
exports.uploadImageMiddleware = multer({ storage: storage }).single('image');

const logPrediction = async (userId, endpoint, requestPayload, responsePayload, status) => {
    try {
        await supabase.from('ml_prediction_logs').insert([{
            user_id: userId,
            endpoint: endpoint,
            request_payload: requestPayload,
            response_payload: responsePayload,
            status: status
        }]);
    } catch (err) {
        console.error('Gagal mencatat log ML:', err);
    }
};

exports.predictFood = async (req, res) => {
    try {
        const { protein, lemak, karbohidrat, total_nutrisi, gram } = req.body;

        if (protein === undefined || lemak === undefined || karbohidrat === undefined || total_nutrisi === undefined) {
            return res.status(400).json({ message: 'Data nutrisi tidak lengkap.' });
        }

        const inputData = {
            protein,
            lemak,
            karbohidrat,
            total_nutrisi,
            gram: gram || 100
        };

        const ML_SERVICE_URL = process.env.FASTAPI_ML_URL || process.env.ML_SERVICE_URL || 'http://localhost:8000';
        const fullUrl = `${ML_SERVICE_URL}/predict-calories`;

        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputData)
        });

        if (response.ok) {
            const responseData = await response.json();

            logPrediction(req.user.id, '/predict-calories', inputData, responseData, 'success');

            return res.status(200).json({
                status: 'success',
                data: responseData
            });
        } else {
            const errorText = await response.text();
            logPrediction(req.user.id, '/predict-calories', inputData, { error: errorText }, 'error');

            return res.status(response.status).json({
                status: 'error',
                message: `AI Service returned ${response.status}`
            });
        }

    } catch (error) {
        logPrediction(req.user?.id || null, '/predict-calories', req.body, { error: error.message }, 'offline');

        return res.status(500).json({
            status: 'offline',
            message: 'Koneksi ke Service ML gagal.',
            error: error.message
        });
    }
};

exports.predictFoodImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Gambar tidak ditemukan. Pastikan key form-data adalah "image".' });
        }

        const ML_SERVICE_URL = process.env.FASTAPI_ML_URL || process.env.ML_SERVICE_URL || 'http://localhost:8000';
        const fullUrl = `${ML_SERVICE_URL}/predict`;

        const formData = new FormData();
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
        formData.append('image', blob, req.file.originalname);

        const response = await fetch(fullUrl, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const aiResult = await response.json(); 

            logPrediction(req.user.id, '/predict', { file_name: req.file.originalname }, aiResult, 'success');

            return res.status(200).json({
                status: 'success',
                data: aiResult
            });
        } else {
            const errorText = await response.text();
            logPrediction(req.user.id, '/predict', { file_name: req.file.originalname }, { error: errorText }, 'error');

            return res.status(response.status).json({
                status: 'error',
                message: `AI Service returned ${response.status}`,
                detail: errorText
            });
        }

    } catch (error) {
        logPrediction(req.user?.id || null, '/predict', { file_name: req.file?.originalname }, { error: error.message }, 'offline');

        return res.status(500).json({
            status: 'offline',
            message: 'Koneksi ke Service AI (YOLOv8) gagal atau terputus.',
            error: error.message
        });
    }
};

const getWIBMidnightISO = (offsetDays = 0) => {
    const wibTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    wibTime.setDate(wibTime.getDate() + offsetDays);
    
    const y = wibTime.getFullYear();
    const m = String(wibTime.getMonth() + 1).padStart(2, '0');
    const d = String(wibTime.getDate()).padStart(2, '0');
    
    return new Date(`${y}-${m}-${d}T00:00:00+07:00`).toISOString();
};


const getRecommendationInternal = async (userId, isCronJob = false) => {
    try {
        const startOfYesterdayISO = getWIBMidnightISO(-1);
        const startOfTodayISO = getWIBMidnightISO(0);

        const { data: profile } = await supabase.from('profiles').select('target_calories').eq('user_id', userId).single();
        if (!profile) return null;

        let summaryQuery = supabase.from('daily_summaries').select('calories_in').eq('user_id', userId).order('created_at', { ascending: false }).limit(1);
        if (isCronJob) summaryQuery = summaryQuery.gte('created_at', startOfYesterdayISO).lt('created_at', startOfTodayISO);
        
        const { data: summary } = await summaryQuery.single();
        if (!summary) return null; 

        let burnQuery = supabase.from('user_activity_burns').select('calories_burned').eq('user_id', userId);
        if (isCronJob) burnQuery = burnQuery.gte('created_at', startOfYesterdayISO).lt('created_at', startOfTodayISO);
        else burnQuery = burnQuery.gte('created_at', startOfTodayISO); 

        const { data: burns } = await burnQuery;
        const totalBurned = burns ? burns.reduce((acc, curr) => acc + curr.calories_burned, 0) : 0;
        const netCalories = summary.calories_in - totalBurned;

        let intakeQuery = supabase.from('user_food_intakes').select(`food_id, foods(name)`).eq('user_id', userId).order('created_at', { ascending: false });
        if (isCronJob) {
            intakeQuery = intakeQuery.gte('created_at', startOfYesterdayISO).lt('created_at', startOfTodayISO);
        } else {
            intakeQuery = intakeQuery.limit(3);
        }

        const { data: intakes } = await intakeQuery;
        
        if (!intakes || intakes.length === 0) return null;

        const uniqueFoods = [...new Set(intakes.filter(item => item.foods).map(item => item.foods.name))];
        const consumedFoodString = uniqueFoods.join(', '); 

        const RECOMMEND_URL = process.env.ML_SERVICE_URL_RECOMMENDATION;
        let allRecommendations = [];

        for (const foodName of uniqueFoods.slice(0, 3)) {
            try {
                const mlResponse = await fetch(RECOMMEND_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ food_name: foodName })
                });

                if (mlResponse.ok) {
                    const mlResult = await mlResponse.json();
                    if (mlResult.recommend_food) {
                        allRecommendations.push(...mlResult.recommend_food);
                    }
                }
            } catch (err) {
                console.error(`Gagal fetch AI untuk ${foodName}:`, err.message);
            }
        }

        const uniqueRecsMap = new Map();
        allRecommendations.forEach(food => {
            if (!uniqueRecsMap.has(food.name)) {
                uniqueRecsMap.set(food.name, food);
            }
        });

        const finalRecommendations = Array.from(uniqueRecsMap.values()).slice(0, 5);

        if (finalRecommendations.length === 0) return null;

        const finalPayload = {
            user_context: {
                target_calories: profile.target_calories,
                consumed_calories: summary.calories_in,
                burned_from_activity: totalBurned,
                net_calories: netCalories,
                is_over_target: netCalories > profile.target_calories
            },
            last_consumed_food: consumedFoodString,
            recommendations: finalRecommendations
        };

        return finalPayload;

    } catch (error) {
        if (error.code !== 'PGRST116') {
            console.error(`Error internal recommendation untuk user ${userId}:`, error.message);
        }
        return null;
    }
};

exports.getDailyRecommendation = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await getRecommendationInternal(userId, false);

        if (!data) {
            return res.status(404).json({ status: 'error', message: 'Data belum lengkap untuk analisis.' });
        }

        return res.status(200).json({
            status: 'success',
            message: `Analisis harian selesai. Rekomendasi berdasarkan: ${data.last_consumed_food}`,
            ...data
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
};

exports.getRecommendationInternal = getRecommendationInternal;