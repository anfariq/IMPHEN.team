<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Food;
use Illuminate\Http\Request;
use App\Services\MLClientService;
use App\Models\MLPredictionLog;

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

        // Jika user tidak mengetik apa-apa, kembalikan array kosong
        if (!$query) {
            return response()->json([]);
        }

        // Cari makanan yang namanya mirip dengan inputan user (Limit 15 agar responsif)
        $foods = Food::where('name', 'LIKE', "%{$query}%")
            ->limit(15)
            ->get();

        return response()->json($foods);
    }

    // Mengambil detail 1 makanan berdasarkan ID
    public function show(Food $food, MLClientService $mlService)
    {
        // Siapkan data nutrisi dari database untuk dikirim ke AI
        $nutrisi = [
            'protein' => $food->protein,
            'lemak' => $food->fat,
            'karbohidrat' => $food->carbohydrate,
            'total_nutrisi' => $food->protein + $food->fat + $food->carbohydrate,
            'gram' => 100 // Standar per 100g
        ];

        // Tanya AI Hugging Face
        $aiResult = $mlService->getPrediction('/predict-calories', $nutrisi);

        return response()->json([
            'food_info' => $food,
            'ai_prediction' => $aiResult['data'] ?? null,
            'status' => $aiResult['status']
        ]);
        
    }
}