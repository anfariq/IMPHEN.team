<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Food;
use Illuminate\Http\Request;

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
    public function show(Food $food)
    {
        return response()->json($food);
    }
}