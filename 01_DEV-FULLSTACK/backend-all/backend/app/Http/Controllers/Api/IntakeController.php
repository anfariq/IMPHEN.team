<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserFoodIntake;
use App\Models\Food;
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
                'water' => 0, // Jika tidak ada input water, default ke 0
                'consumed_at' => $request->consumed_at ?? now(),
            ]);

            // Trigger update summary
            $this->summaryService->updateDailySummary($request->user()->id);

            return response()->json(['status' => 'success', 'data' => $intake]);

        } catch (\Exception $e) {
            // Ini akan memunculkan pesan error asli kalau ada yang salah di database/service
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // --- 2. ENDPOINT KHUSUS AIR MINUM ---
    public function storeWater(Request $request)
    {
        try {
            $request->validate([
                'water' => 'required|integer|min:1',
            ]);

            $intake = UserFoodIntake::create([
                'user_id' => $request->user()->id,
                'food_id' => null, // Sengaja null karena ini bukan makanan
                'qty_grams' => 0,
                'total_calories' => 0,
                'water' => $request->water,
                'consumed_at' => now(),
            ]);

            // Trigger update summary
            $this->summaryService->updateDailySummary($request->user()->id);

            return response()->json(['status' => 'success', 'message' => 'Air minum tercatat!', 'data' => $intake]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}