<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FoodController;
use App\Http\Controllers\Api\IntakeController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\SummaryController;
use App\Http\Controllers\Api\MLProxyController;
use App\Http\Controllers\Api\PasswordResetController;

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

Route::get('/foods/search', [FoodController::class, 'search']); 
Route::get('/foods', [FoodController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Profil User
    Route::get('/profile', [AuthController::class, 'showProfile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Makanan (CRUD & Search)
    // Tambahkan route search SEBELUM resource /foods agar tidak dianggap sebagai ID
    Route::post('/foods', [FoodController::class, 'store']);
    Route::get('/foods/{food}', [FoodController::class, 'show']);

    // Catatan Makan (Intake)
    Route::post('/food-intake', [IntakeController::class, 'store']);

    // Endpoint khusus untuk mencatat air minum (water intake)
    Route::post('/water', [IntakeController::class, 'storeWater']);

    // Catatan Makan (Intake)
    Route::post('/intakes', [IntakeController::class, 'store']);

    // Aktivitas & Olahraga
    Route::get('/activities', [ActivityController::class, 'index']);
    Route::get('/activities/record', [ActivityController::class, 'history']);
    Route::post('/activities/record', [ActivityController::class, 'store']);

    // Dashboard & Grafik
    Route::get('/dashboard', [SummaryController::class, 'getDashboardData']);

    /*
    |----------------------------------------------------------------------
    | Machine Learning Proxy
    |----------------------------------------------------------------------
    */
    Route::prefix('ml')->group(function () {
        // Untuk menghitung kalori terbakar (Olahraga)
        Route::post('/predict-burn', [MLProxyController::class, 'predictBurn']);
        
        // Tambahkan ini untuk menghitung kalori makanan (Nutrisi)
        Route::post('/predict-calories', [MLProxyController::class, 'predictFood']);
    });
});