<?php

namespace App\Services;

use App\Models\DailySummary;
use App\Models\UserFoodIntake;
use App\Models\UserActivityBurn;
use Carbon\Carbon;

class DailySummaryService
{
    public function updateDailySummary($userId, $date = null)
    {
        $date = $date ?: Carbon::today()->format('Y-m-d');

        // 1. Hitung total kalori masuk (dari makanan)
        $totalIn = UserFoodIntake::where('user_id', $userId)
            ->whereDate('consumed_at', $date)
            ->sum('total_calories');

        // 2. Hitung total kalori keluar (dari olahraga)
        $totalOut = UserActivityBurn::where('user_id', $userId)
            ->whereDate('created_at', $date)
            ->sum('calories_burned');

        // 3. Ambil total Nutrisi (Protein, Carbs, Fat) 
        // Ini opsional, tapi bagus buat ngisi kolom protein/carbs/fat di daily_summaries lo
        $nutrients = UserFoodIntake::join('foods', 'user_food_intakes.food_id', '=', 'foods.id')
            ->where('user_food_intakes.user_id', $userId)
            ->whereDate('user_food_intakes.consumed_at', $date)
            ->selectRaw('SUM(foods.protein * user_food_intakes.qty_grams / 100) as total_protein')
            ->selectRaw('SUM(foods.carbs * user_food_intakes.qty_grams / 100) as total_carbs')
            ->selectRaw('SUM(foods.fat * user_food_intakes.qty_grams / 100) as total_fat')
            ->first();

        // 4. Simpan atau Update ke tabel daily_summaries
        return DailySummary::updateOrCreate(
            ['user_id' => $userId, 'date' => $date],
            [
                'calories_in' => (int) round($totalIn),
                'calories_out' => (int) round($totalOut),
                'protein' => (int) round($nutrients->total_protein ?? 0),
                'carbs' => (int) round($nutrients->total_carbs ?? 0),
                'fat' => (int) round($nutrients->total_fat ?? 0),
                // net_calories tidak perlu disimpan jika lo pakai Accessor di Model
            ]
        );
    }
}