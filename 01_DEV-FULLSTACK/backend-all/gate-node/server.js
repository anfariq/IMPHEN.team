const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const LARAVEL_URL = 'https://imphenteam-production.up.railway.app';
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;

// 1. DYNAMIC CORS MIDDLEWARE
const allowedOrigins = [
  'http://localhost:5173',
  'https://preview-imphen.ownspace.my.id',
  'https://imphen.ownspace.my.id'
];

app.use((req, res, next) => {
    // Hapus header origin bawaan jika ada
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

// 2. EXTRA HEADER FIX (PENTING UNTUK VERCEL)
// Ini untuk memastikan header Access-Control tidak ditimpa oleh proxy
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Langsung balas jika request-nya OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// 3. LOGGING
app.use((req, res, next) => {
    console.log(`[GATEWAY] ${new Date().toISOString()} - ${req.method} ${req.url} dari ${req.headers.origin || 'No Origin'}`);
    next();
});

// 4. AUTH MIDDLEWARE
const authMiddleware = (req, res, next) => {
    // 1. KASIH JALAN TOL buat request OPTIONS (Preflight) dan Favicon
    if (req.method === 'OPTIONS' || req.url === '/favicon.ico') {
        return next();
    }

    // 2. KASIH JALAN TOL buat cek status (opsional, biar tau gateway idup)
    if (req.url === '/') {
        return res.status(200).send("Gateway is running!");
    }

    const userApiKey = req.headers['x-api-key'];

    // Debugging di Vercel Log: Cek apa yang sebenernya diterima server
    console.log(`[DEBUG] Incoming Key: ${userApiKey}`);
    console.log(`[DEBUG] Expected Key: ${GATEWAY_API_KEY}`);

    if (!userApiKey || userApiKey !== GATEWAY_API_KEY) {
        console.log(`[GATEWAY] Akses Ditolak!`);
        return res.status(401).json({ 
            success: false, 
            message: 'Unauthorized: API Key diperlukan.' 
        });
    }
    next();
};

// 5. PROXY CONFIG
const laravelProxy = createProxyMiddleware({
    target: LARAVEL_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api', // Pastikan path tetap konsisten
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[GATEWAY] Meneruskan ke Laravel...`);
    },
    onProxyRes: (proxyRes, req, res) => {
        // Hapus header CORS dari Laravel agar tidak bentrok dengan Gateway
        delete proxyRes.headers['access-control-allow-origin'];
    }
});

// Jalankan Auth dulu baru Proxy
app.use('/', authMiddleware, laravelProxy);

module.exports = app;