const express = require('express');
require('dotenv').config();
const apiRoutes = require('./routes/api');

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
    if (req.method === 'OPTIONS' || req.url === '/favicon.ico' || req.url === '/') {
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

app.use(express.json());

// 4. TERAPKAN API KEY MIDDLEWARE
app.use(apiKeyMiddleware);

// 5. DAFTARKAN ROUTES
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});