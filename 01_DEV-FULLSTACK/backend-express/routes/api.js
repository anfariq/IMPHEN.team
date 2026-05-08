const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware'); // Import Middleware

const authController = require('../controllers/authController');
const foodController = require('../controllers/foodController'); // <-- 1. Import Food Controller
const activityController = require('../controllers/activityController');
const summaryController = require('../controllers/summaryController');
const passwordResetController = require('../controllers/passwordResetController');
const intakeController = require('../controllers/intakeController');
const mlController = require('../controllers/mlController');

// Health Check
router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

/* =========================================
   PUBLIC ROUTES (Tidak butuh token)
   ========================================= */
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/forgot-password', passwordResetController.sendResetLinkEmail); // <--- Tambahkan ini
router.post('/reset-password', passwordResetController.reset); // <--- Tambahkan ini

router.get('/foods/search', foodController.search);
router.get('/foods', foodController.index);

/* =========================================
   PROTECTED ROUTES (Wajib Token / Sanctum Equivalent)
   ========================================= */
// Semua route di bawah ini otomatis akan melewati middleware 'protect'
router.use(protect); 

router.get('/profile', authController.showProfile);
router.post('/profile', authController.updateProfile);
router.delete('/user/delete', authController.deleteAccount);

// Makanan: Rute yang dilindungi
router.get('/foods/:id', foodController.show); // Menampilkan detail & panggil AI
router.post('/foods', foodController.store);
// Catatan Makanan (Dua route mengarah ke fungsi yang sama seperti di Laravel)
router.post('/food-intake', intakeController.storeFood);
router.post('/intakes', intakeController.storeFood);

// Catatan Air Minum
router.post('/water', intakeController.storeWater);

// Olahraga
router.get('/activities', activityController.index);
router.get('/activities/record', activityController.history);
router.post('/activities/record', activityController.store);
router.get('/activity/weekly', activityController.getWeeklyActivity);

// ML Service
router.post('/ml/predict-calories', mlController.predictFood);
router.post('/ml/predict-image', mlController.uploadImageMiddleware, mlController.predictFoodImage);

// Dashboard
router.get('/dashboard', summaryController.getDashboardData);
router.get('/insights', summaryController.getDsInsights);

// Untuk logout di Express dengan JWT (karena stateless), biasanya cukup dihapus dari sisi Frontend (hapus token dari local storage/cookies). 
// Namun jika mau dikasih respon sukses:
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Berhasil logout.' });
});

module.exports = router;