const express = require('express');
require('dotenv').config();
const apiRoutes = require('./routes/api');

const cron = require('node-cron');
const supabase = require('./config/supabase');
const { getRecommendationInternal } = require('./controllers/mlController');
const { sendEmailRecommendation } = require('./utils/mailer'); 

const app = express();
const PORT = process.env.PORT || 5000;
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;

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

app.use((req, res, next) => {
    console.log(`[EXPRESS] ${new Date().toISOString()} - ${req.method} ${req.url} dari ${req.headers.origin || 'No Origin'}`);
    next();
});

const apiKeyMiddleware = (req, res, next) => {
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

cron.schedule('0 7 * * *', async () => {
    console.log('--- Memulai Tugas Otomatis: Pengiriman Email Rekomendasi ---');
    
    try {
        const { data: users, error: userError } = await supabase
            .from('users')
            .select('id, full_name, email'); 

        if (userError) throw userError;

        for (const user of users) {
            if (!user.email) continue; 

            console.log(`Memproses rekomendasi untuk: ${user.full_name}`);
            
            const recommendationData = await getRecommendationInternal(user.id);
            
            if (recommendationData) {
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

app.use(apiKeyMiddleware);

app.use('/api', apiRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server sukses mengudara di port ${PORT}`);
});