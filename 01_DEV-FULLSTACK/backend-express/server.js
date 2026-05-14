const express = require('express');
require('dotenv').config();
const apiRoutes = require('./routes/api');

const cron = require('node-cron');
// --- TAMBAHAN IMPORTS UNTUK CRON JOB ---
const supabase = require('./config/supabase'); // Sesuaikan path ke supabase.js kamu
const { getRecommendationInternal } = require('./controllers/mlController');
const { sendEmailRecommendation } = require('./utils/mailer'); // Sesuaikan path ke mailer.js kamu
// ---------------------------------------

const app = express();
const PORT = process.env.PORT || 5000;
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;

// 1. DYNAMIC CORS MIDDLEWARE (Sesuai Gate sebelumnya)
const allowedOrigins = [
  'http://localhost:5173',
  'https://frontend-kohl-beta-61.vercel.app'
];

app.use((req, res, next) => {
    res.removeHeader('Access-Control-Allow-Origin');
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// 2. LOGGING
app.use((req, res, next) => {
    console.log(`[EXPRESS] ${new Date().toISOString()} - ${req.method} ${req.url} dari ${req.headers.origin || 'No Origin'}`);
    next();
});

// 3. API KEY AUTH MIDDLEWARE
const apiKeyMiddleware = (req, res, next) => {
    // Kasih jalan bebas hambatan untuk request OPTIONS (Preflight), favicon, atau root check
    if (req.method === 'OPTIONS' || req.url === '/favicon.ico' || req.url === '/' || req.url === '/api/health') {
        return next();
    }

    const userApiKey = req.headers['x-api-key'];

    if (!userApiKey || userApiKey !== GATEWAY_API_KEY) {
        console.log(`[EXPRESS] Akses Ditolak! API Key tidak valid/kosong.`);
        return res.status(401).json({ 
            success: false, 
            message: 'Unauthorized: API Key diperlukan.' 
        });
    }
    next();
};

// Penjadwalan: Berjalan setiap jam 07:00 Pagi
// ubah jadwal, '* * * * *' untuk untuk testing (setiap menit), '0 7 * * *' untuk setiap hari jam 7 pagi
cron.schedule('0 7 * * *', async () => {
    console.log('--- Memulai Tugas Otomatis: Pengiriman Email Rekomendasi ---');
    
    try {
        // Ambil semua user (pastikan nama kolom email dan id benar sesuai tabel kamu)
        const { data: users, error: userError } = await supabase
            .from('users')
            .select('id, full_name, email'); 

        if (userError) throw userError;

        for (const user of users) {
            if (!user.email) continue; // Skip jika user tidak punya email

            console.log(`Memproses rekomendasi untuk: ${user.full_name}`);
            
            // Panggil fungsi internal dari mlController
            const recommendationData = await getRecommendationInternal(user.id);
            
            if (recommendationData) {
                // Kirim Email via Resend dari mailer.js
                await sendEmailRecommendation(user, recommendationData);
            } else {
                console.log(`Data tidak lengkap untuk ${user.full_name}, email di-skip.`);
            }
        }
        console.log('--- Semua email berhasil diproses ---');
    } catch (error) {
        console.error('Error pada Cron Job:', error.message);
    }
});

app.use(express.json());

// 4. TERAPKAN API KEY MIDDLEWARE
app.use(apiKeyMiddleware);

// 5. DAFTARKAN ROUTES
app.use('/api', apiRoutes);

// WAJIB tambahkan '0.0.0.0' agar bisa diakses proxy Railway
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server sukses mengudara di port ${PORT}`);
});