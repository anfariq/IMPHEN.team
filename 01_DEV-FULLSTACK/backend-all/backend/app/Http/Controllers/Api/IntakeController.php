<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserFoodIntake;
use App\Models\UserWaterIntake; // <-- IMPORT MODEL BARU
use App\Services\CalorieService;
use App\Services\DailySummaryService;
use Illuminate\Http\Request;

class IntakeController extends Controller
{
    protected $calorieService;
    protected $summaryService;

    public function __construct(CalorieService $cs, DailySummaryService $ds)
    {
        $this->calorieService = $cs;
        $this->summaryService = $ds;
    }

    // --- ENDPOINT MAKANAN (Kembali Ketat) ---
    public function store(Request $request)
    {
        try {
            $request->validate([
                'food_id' => 'required|exists:foods,id',
                'qty_grams' => 'required|numeric',
                'total_calories' => 'required|numeric',
                'consumed_at' => 'nullable|date',
            ]);

            $intake = UserFoodIntake::create([
                'user_id' => $request->user()->id,
                'food_id' => $request->food_id,
                'qty_grams' => $request->qty_grams,
                'total_calories' => $request->total_calories,
                'consumed_at' => $request->consumed_at ?? now(),
            ]);

            $this->summaryService->updateDailySummary($request->user()->id);

            return response()->json(['status' => 'success', 'data' => $intake]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // --- ENDPOINT AIR MINUM (Pakai Tabel Baru) ---
    public function storeWater(Request $request)
    {
        try {
            $request->validate([
                'water' => 'required|integer|min:1',
            ]);

            // SIMPAN KE TABEL BARU
            $waterIntake = UserWaterIntake::create([
                'user_id' => $request->user()->id,
                'water' => $request->water,
                'consumed_at' => now(),
            ]);

            // Trigger update summary
            $this->summaryService->updateDailySummary($request->user()->id);

            return response()->json([
                'status' => 'success', 
                'message' => 'Air minum tercatat!', 
                'data' => $waterIntake
            ]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}