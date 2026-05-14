const supabase = require('../config/supabase');
const multer = require('multer');

// 1. Setup Multer (Simpan gambar sementara di Memory/RAM agar cepat diteruskan)
const storage = multer.memoryStorage();
exports.uploadImageMiddleware = multer({ storage: storage }).single('image');

// Helper untuk mencatat log AI ke database (Pengganti MLPredictionLog::create)
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

        // Validasi input
        if (protein === undefined || lemak === undefined || karbohidrat === undefined || total_nutrisi === undefined) {
            return res.status(400).json({ message: 'Data nutrisi tidak lengkap.' });
        }

        const inputData = {
            protein,
            lemak,
            karbohidrat,
            total_nutrisi,
            gram: gram || 100 // Default 100g
        };

        // Gunakan URL FastAPI dari .env
        const ML_SERVICE_URL = process.env.FASTAPI_ML_URL || process.env.ML_SERVICE_URL || 'http://localhost:8000';
        const fullUrl = `${ML_SERVICE_URL}/predict-calories`;

        // Tembak ke API Python (FastAPI/HuggingFace) menggunakan fetch bawaan Node.js
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputData)
        });

        if (response.ok) {
            const responseData = await response.json();

            // Log sukses berjalan di background
            logPrediction(req.user.id, '/predict-calories', inputData, responseData, 'success');

            return res.status(200).json({
                status: 'success',
                data: responseData
            });
        } else {
            const errorText = await response.text();
            // Log error berjalan di background
            logPrediction(req.user.id, '/predict-calories', inputData, { error: errorText }, 'error');

            return res.status(response.status).json({
                status: 'error',
                message: `AI Service returned ${response.status}`
            });
        }

    } catch (error) {
        // Log jika server ML sedang mati/offline
        logPrediction(req.user?.id || null, '/predict-calories', req.body, { error: error.message }, 'offline');

        return res.status(500).json({
            status: 'offline',
            message: 'Koneksi ke Service ML gagal.',
            error: error.message
        });
    }
};

// 2. Endpoint Baru untuk Deteksi Gambar (YOLOv8)
exports.predictFoodImage = async (req, res) => {
    try {
        // Cek apakah ada file gambar yang dikirim dari React
        if (!req.file) {
            return res.status(400).json({ message: 'Gambar tidak ditemukan. Pastikan key form-data adalah "image".' });
        }

        // Siapkan URL FastAPI (Sesuai kesepakatan tim AI: /predict)
        const ML_SERVICE_URL = process.env.FASTAPI_ML_URL || process.env.ML_SERVICE_URL || 'http://localhost:8000';
        const fullUrl = `${ML_SERVICE_URL}/predict`;

        // Siapkan FormData persis seperti yang diminta tim AI
        const formData = new FormData();
        // Ubah buffer dari Multer menjadi Blob agar bisa dikirim via fetch Node.js
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
        formData.append('image', blob, req.file.originalname);

        // Tembak ke FastAPI Tim AI
        const response = await fetch(fullUrl, {
            method: 'POST',
            body: formData
            // Catatan: Jangan set 'Content-Type' manual kalau pakai FormData di fetch, biar boundary-nya di-generate otomatis
        });

        if (response.ok) {
            const aiResult = await response.json(); // Hasilnya: { "foods": [ { "name": "Nasi Goreng", "confidence": 0.94 } ] }

            // Catat log sukses ke Supabase (Kita simpan nama filenya saja sebagai payload)
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

// --- HELPER ZONA WAKTU WIB (ANTI MELESET DI SERVER UTC) ---
const getWIBMidnightISO = (offsetDays = 0) => {
    // Ambil waktu saat ini di server, lalu konversi ke WIB
    const wibTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    wibTime.setDate(wibTime.getDate() + offsetDays);
    
    const y = wibTime.getFullYear();
    const m = String(wibTime.getMonth() + 1).padStart(2, '0');
    const d = String(wibTime.getDate()).padStart(2, '0');
    
    // Buat format standar ISO dengan offset +07:00
    // Hasil akhirnya akan otomatis diconvert ke UTC oleh NodeJS agar dibaca benar oleh Supabase
    return new Date(`${y}-${m}-${d}T00:00:00+07:00`).toISOString();
};

// --------------------------------------------------------------------------
// FUNGSI INTERNAL: Dipanggil oleh Cron Job & Endpoint Express
// Tambahan isCronJob agar Dashboard React tidak error karena mencari data "kemarin"
// --------------------------------------------------------------------------
const getRecommendationInternal = async (userId, isCronJob = false) => {
    try {
        const startOfYesterdayISO = getWIBMidnightISO(-1);
        const startOfTodayISO = getWIBMidnightISO(0);

        // 1. Ambil Profil
        const { data: profile } = await supabase.from('profiles').select('target_calories').eq('user_id', userId).single();
        if (!profile) return null;

        // 2. Query Daily Summary
        // Jika Dashboard, ambil summary terakhir. Jika CronJob, kunci ke hari kemarin.
        let summaryQuery = supabase.from('daily_summaries').select('calories_in').eq('user_id', userId).order('created_at', { ascending: false }).limit(1);
        if (isCronJob) summaryQuery = summaryQuery.gte('created_at', startOfYesterdayISO).lt('created_at', startOfTodayISO);
        
        const { data: summary } = await summaryQuery.single();
        if (!summary) return null; // "Data belum lengkap" sering terjadi di sini

        // 3. Query Aktivitas Terbakar
        let burnQuery = supabase.from('user_activity_burns').select('calories_burned').eq('user_id', userId);
        if (isCronJob) burnQuery = burnQuery.gte('created_at', startOfYesterdayISO).lt('created_at', startOfTodayISO);
        else burnQuery = burnQuery.gte('created_at', startOfTodayISO); // Dashboard: Aktivitas hari ini

        const { data: burns } = await burnQuery;
        const totalBurned = burns ? burns.reduce((acc, curr) => acc + curr.calories_burned, 0) : 0;
        const netCalories = summary.calories_in - totalBurned;

        // 4. Query Makanan Terakhir
        let intakeQuery = supabase.from('user_food_intakes').select(`food_id, foods(name)`).eq('user_id', userId).order('created_at', { ascending: false });
        if (isCronJob) {
            // CronJob (Email): Wajib ambil semua makanan KEMARIN
            intakeQuery = intakeQuery.gte('created_at', startOfYesterdayISO).lt('created_at', startOfTodayISO);
        } else {
            // Dashboard React: Ambil 3 makanan TERBARU kapanpun itu dicatat
            intakeQuery = intakeQuery.limit(3);
        }

        const { data: intakes } = await intakeQuery;
        
        // Jika tidak ada data, batalkan (Ini juga pemicu "Data belum lengkap")
        if (!intakes || intakes.length === 0) return null;

        // Ekstrak nama makanan & buang duplikat
        const uniqueFoods = [...new Set(intakes.filter(item => item.foods).map(item => item.foods.name))];
        const consumedFoodString = uniqueFoods.join(', '); // Hasil: "Ayam, Beras"

        // 5. Tembak API AI Multiple Kali & Gabungkan Hasilnya
        const RECOMMEND_URL = process.env.ML_SERVICE_URL_RECOMMENDATION;
        let allRecommendations = [];

        // Batasi maksimal 3 makanan saja yang dicek ke AI agar server tidak lambat
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

        // Filter hasil AI agar tidak ada rekomendasi makanan yang dobel
        const uniqueRecsMap = new Map();
        allRecommendations.forEach(food => {
            if (!uniqueRecsMap.has(food.name)) {
                uniqueRecsMap.set(food.name, food);
            }
        });

        // Ambil 5 makanan gabungan terbaik
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

// --------------------------------------------------------------------------
// ENDPOINT EXPRESS: Untuk dipanggil oleh Frontend React
// --------------------------------------------------------------------------
exports.getDailyRecommendation = async (req, res) => {
    try {
        const userId = req.user.id;
        // Panggil fungsi dengan isCronJob = FALSE
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

// EXPORT FUNGSI INTERNAL UNTUK CRON JOB
exports.getRecommendationInternal = getRecommendationInternal;