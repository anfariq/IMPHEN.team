const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = 3000; // Gerbang berjalan di port 3000
const LARAVEL_URL = 'https://imphenteam-production.up.railway.app'; // Alamat Laravel kamu

// 1. Logika Middleware (Contoh: Catat siapa yang bertamu)
app.use((req, res, next) => {
    console.log(`[GATEWAY] ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// 2. Konfigurasi Proxy
// Semua request yang masuk ke http://localhost:3000/api 
// akan diteruskan ke https://imphenteam-production.up.railway.app/api
const laravelProxy = createProxyMiddleware({
    target: LARAVEL_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        // Kamu bisa memodifikasi header di sini jika perlu
        console.log(`[GATEWAY] Meneruskan ke Laravel...`);
    }
});

// Gunakan proxy untuk semua rute /api
app.use('/', laravelProxy);

app.listen(PORT, () => {
    console.log(`🚀 Gerbang Node.js aktif di http://localhost:${PORT}`);
    console.log(`🔗 Meneruskan trafik ke Laravel di ${LARAVEL_URL}`);
});