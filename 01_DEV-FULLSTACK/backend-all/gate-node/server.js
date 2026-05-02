const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const LARAVEL_URL = 'https://imphenteam-production.up.railway.app'; // https://imphenteam-production.up.railway.app
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;
const cors = require('cors');

// Izinkan FE kamu akses (Ganti URL-nya sesuai URL localhost/production FE kamu)
app.use(cors({
    origin: '*', // Untuk dev boleh '*', tapi pas production ganti ke URL frontendmu
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// 1. Logika Logging
app.use((req, res, next) => {
    console.log(`[GATEWAY] ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// 2. PROTEKSI: Middleware API Key
const authMiddleware = (req, res, next) => {
    // KASIH JALAN TOL BUAT OPTIONS
    if (req.method === 'OPTIONS') {
        return next();
    }

    const userApiKey = req.headers['x-api-key'];

    if (!userApiKey || userApiKey !== GATEWAY_API_KEY) {
        console.log(`[GATEWAY] Akses Ditolak: API Key tidak valid!`);
        return res.status(401).json({ 
            success: false, 
            message: 'Unauthorized: API Key diperlukan.' 
        });
    }
    next();
};

// 3. Konfigurasi Proxy
const laravelProxy = createProxyMiddleware({
    target: LARAVEL_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[GATEWAY] Kunci Valid. Meneruskan ke Laravel...`);
    }
});

// Terapkan proteksi authMiddleware SEBELUM proxy
app.use('/', authMiddleware, laravelProxy);

app.listen(PORT, () => {
    console.log(`🚀 Gerbang Node.js aktif di port ${PORT}`);
    console.log(`🔑 Proteksi API Key diaktifkan.`);
});