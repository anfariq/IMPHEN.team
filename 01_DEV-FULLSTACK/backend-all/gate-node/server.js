const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const LARAVEL_URL = 'https://imphenteam-production.up.railway.app'; // https://imphenteam-production.up.railway.app
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',                   // Tetap izinkan local buat dev
  'https://preview-imphen.ownspace.my.id',    // Domain frontend kamu sekarang
  'https://imphen.ownspace.my.id'             // Jaga-jaga kalau nanti ganti domain utama
];

app.use(cors({
  origin: function (origin, callback) {
    // izinkan request tanpa origin (seperti mobile apps atau curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  credentials: true // Penting kalau kamu mainan cookie/session
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

module.exports = app;
/*
app.listen(PORT, () => {
    console.log(`🚀 Gerbang Node.js aktif di port ${PORT}`);
    console.log(`🔑 Proteksi API Key diaktifkan.`);
});*/