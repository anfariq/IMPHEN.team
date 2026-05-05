<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Food;
use Illuminate\Http\Request;
use App\Services\MLClientService;
use App\Models\MLPredictionLog;
use App\Models\UserFoodIntake;

class FoodController extends Controller
{
    // Mengambil semua data makanan dengan pagination (Opsional jika dibutuhkan)
    public function index(Request $request)
    {
        $foods = Food::paginate(20);
        return response()->json($foods);
    }

    // Fungsi khusus untuk Live Search di React
    public function search(Request $request)
    {
        $query = $request->query('q');
        if (!$query)
            return response()->json([]);

        // Gunakan kolom 'name' sesuai screenshot Supabase kamu
        $foods = Food::where('name', 'LIKE', "%{$query}%")
            ->limit(15)
            ->get();

        return response()->json($foods);
    }

    public function show(Food $food, MLClientService $mlService)
    {
        $nutrisi = [
            'protein' => $food->protein,
            'lemak' => $food->fat,        // Di screenshot namanya 'fat'
            'karbohidrat' => $food->carbs, // Di screenshot namanya 'carbs'
            'total_nutrisi' => $food->protein + $food->fat + $food->carbs,
            'gram' => 100
        ];

        $aiResult = $mlService->getPrediction('/predict-calories', $nutrisi);

        return response()->json([
            'food_info' => $food,
            'ai_prediction' => $aiResult['data'] ?? null,
            'status' => $aiResult['status']
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'food_id' => 'required|exists:foods,id',
            'qty_grams' => 'required|numeric',
            'total_calories' => 'required|numeric',
            'water' => 'nullable|integer',
        ]);

        $intake = UserFoodIntake::create([
            'user_id' => $request->user()->id, // Ambil ID dari token login
            'food_id' => $validated['food_id'],
            'qty_grams' => $validated['qty_grams'],
            'total_calories' => $validated['total_calories'],
            'water' => $validated['water'],
            'consumed_at' => now(), // Otomatis set waktu sekarang
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data makan berhasil disimpan!',
            'data' => $intake
        ], 201);
    }
}