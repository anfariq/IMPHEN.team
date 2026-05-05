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
        // Ubah menjadi nullable agar bisa saling independen
        $validated = $request->validate([
            'food_id' => 'nullable|exists:foods,id',
            'qty_grams' => 'nullable|numeric',
            'total_calories' => 'nullable|numeric',
            'water' => 'nullable|integer',
        ]);

        // Cek apakah minimal ada data makanan ATAU data air yang dikirim
        if (empty($validated['food_id']) && empty($validated['water'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Harus mengisi makanan atau air minum.'
            ], 422);
        }

        $intake = UserFoodIntake::create([
            'user_id' => $request->user()->id,
            'food_id' => $validated['food_id'] ?? null, // Jika null, biarkan null
            'qty_grams' => $validated['qty_grams'] ?? 0, // Jika tidak ada, isi 0
            'total_calories' => $validated['total_calories'] ?? 0,
            'water' => $validated['water'] ?? 0, // Jika tidak ada, isi 0
            'consumed_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data berhasil disimpan!',
            'data' => $intake
        ], 201);
    }
}