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