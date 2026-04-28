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
| Public Routes (Bisa diakses tanpa login)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Wajib pakai Bearer Token / Login)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Profil User
    Route::get('/profile', [AuthController::class, 'showProfile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Auth & Profile
    Route::post('/logout', [AuthController::class, 'logout']);

    // Makanan (CRUD & List)
    Route::get('/foods', [FoodController::class, 'index']);
    Route::post('/foods', [FoodController::class, 'store']);
    Route::get('/foods/{food}', [FoodController::class, 'show']);

    // Catatan Makan (Intake)
    Route::post('/intakes', [IntakeController::class, 'store']);

    // Aktivitas & Olahraga
    Route::get('/activities', [ActivityController::class, 'index']);
    Route::get('/activities/record', [ActivityController::class, 'history']);
    Route::post('/activities/record', [ActivityController::class, 'store']);


    // Dashboard & Grafik
    Route::get('/dashboard', [SummaryController::class, 'getDashboardData']);

    // Machine Learning Proxy
    Route::post('/ml/predict-burn', [MLProxyController::class, 'predictBurn']);
});