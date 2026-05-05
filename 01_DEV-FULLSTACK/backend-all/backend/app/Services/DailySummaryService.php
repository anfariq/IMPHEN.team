<?php

namespace App\Services;

use App\Models\DailySummary;
use App\Models\UserFoodIntake;
use App\Models\UserActivityBurn;
use App\Models\UserWaterIntake; // <-- IMPORT MODEL BARU
use Carbon\Carbon;

class DailySummaryService
{
    public function updateDailySummary($userId, $date = null)
    {
        $date = $date ?: Carbon::today()->format('Y-m-d');

        // 1. Hitung total kalori masuk (makanan)
        $totalIn = UserFoodIntake::where('user_id', $userId)
            ->whereDate('consumed_at', $date)
            ->sum('total_calories');

        // 2. Hitung total kalori keluar (olahraga)
        $totalOut = UserActivityBurn::where('user_id', $userId)
            ->whereDate('created_at', $date)
            ->sum('calories_burned');

        // 3. Hitung total AIR MINUM (Dari tabel baru)
        $totalWater = UserWaterIntake::where('user_id', $userId)
            ->whereDate('consumed_at', $date)
            ->sum('water');

        // 4. Ambil total Nutrisi
        $nutrients = UserFoodIntake::join('foods', 'user_food_intakes.food_id', '=', 'foods.id')
            ->where('user_food_intakes.user_id', $userId)
            ->whereDate('user_food_intakes.consumed_at', $date)
            ->selectRaw('SUM(foods.protein * user_food_intakes.qty_grams / 100) as total_protein')
            ->selectRaw('SUM(foods.carbs * user_food_intakes.qty_grams / 100) as total_carbs')
            ->selectRaw('SUM(foods.fat * user_food_intakes.qty_grams / 100) as total_fat')
            ->first();

        // 5. Update ke daily_summaries
        return DailySummary::updateOrCreate(
            ['user_id' => $userId, 'date' => $date],
            [
                'calories_in' => (int) round($totalIn),
                'calories_out' => (int) round($totalOut),
                'water' => (int) $totalWater, // Simpan total air ke dashboard
                'protein' => (int) round($nutrients->total_protein ?? 0),
                'carbs' => (int) round($nutrients->total_carbs ?? 0),
                'fat' => (int) round($nutrients->total_fat ?? 0),
            ]
        );
    }
}