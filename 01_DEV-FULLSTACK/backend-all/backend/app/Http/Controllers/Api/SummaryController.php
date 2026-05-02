<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DailySummary;
use App\Models\UserActivityBurn; // <-- PENTING: Import model aktivitas
use Illuminate\Http\Request;
use Carbon\Carbon;

class SummaryController extends Controller
{
    public function getDashboardData(Request $request)
    {
        $user = $request->user();
        $todayDate = now()->toDateString();

        $today = DailySummary::where('user_id', $user->id)
            ->whereDate('date', $todayDate)
            ->first();

        // AMBIL DATA MAKANAN TERAKHIR (ID, Nama dari relasi food, Jam, dan Kalori)
        $recentMeals = \App\Models\UserFoodIntake::with('food')
            ->where('user_id', $user->id)
            ->whereDate('consumed_at', $todayDate)
            ->orderBy('consumed_at', 'desc') // Paling baru di atas
            ->take(5)
            ->get()
            ->map(function ($intake) {
                return [
                    'name' => $intake->food->name ?? 'Unknown Food',
                    'time' => $intake->consumed_at->format('H:i'), // Format jam:menit
                    'calories' => $intake->total_calories,
                ];
            });

        $recentActivities = \App\Models\UserActivityBurn::with('activity')
            ->where('user_id', $user->id)
            ->whereDate('created_at', $todayDate)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'target_calories' => $user->profile->target_calories ?? 2000,
            'today' => [
                'calories_in' => $today->calories_in ?? 0,
                'calories_out' => $today->calories_out ?? 0,
                'protein' => $today->protein ?? 0,
                'carbs' => $today->carbs ?? 0,
                'fat' => $today->fat ?? 0,
                'water' => $today->water ?? 0,
                'meals' => $recentMeals, // <-- SEKARANG SUDAH BERISI DATA REAL
                'activities' => $recentActivities,
            ],
        ]);
    }
}