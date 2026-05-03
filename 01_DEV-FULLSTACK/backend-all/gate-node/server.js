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

app.use(cors({
  origin: function (origin, callback) {
    // Izinkan request tanpa origin (seperti server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked by Gateway'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200 // Paksa status 200 untuk preflight
}));

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