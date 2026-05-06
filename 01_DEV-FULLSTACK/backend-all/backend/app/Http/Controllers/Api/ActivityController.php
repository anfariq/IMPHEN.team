<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\UserActivityBurn;
use App\Services\CalorieService;
use App\Services\DailySummaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

use App\Models\DailySummary;
use App\Models\UserFoodIntake;

class ActivityController extends Controller
{
    protected $calorieService;
    protected $summaryService;

    public function __construct(CalorieService $cs, DailySummaryService $ds)
    {
        $this->calorieService = $cs;
        $this->summaryService = $ds;
    }

    // List semua jenis olahraga (untuk dropdown di Next.js)
    public function index()
    {
        return response()->json(Activity::orderBy('category')->get());
    }

    // Simpan catatan olahraga user
    public function store(Request $request)
    {
        $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'duration_minutes' => 'required|numeric',
        ]);

        $activity = Activity::find($request->activity_id);
        $user = $request->user();

        // Ambil berat badan dari profil, default 60kg jika belum diisi
        $weight = $user->profile->weight ?: 60;

        // Hitung kalori terbakar via Service
        $burned = $this->calorieService->calculateActivityBurn(
            $activity->met_value,
            $weight,
            $request->duration_minutes
        );

        $burnRecord = UserActivityBurn::create([
            'user_id' => $user->id,
            'activity_id' => $request->activity_id,
            'duration_minutes' => $request->duration_minutes,
            'calories_burned' => $burned,
        ]);

        // Update Ringkasan Harian (Kalori Keluar)
        $this->summaryService->updateDailySummary($user->id);

        return response()->json($burnRecord, 201);
    }
    // Ambil riwayat olahraga user (untuk history di React)
    public function history(Request $request)
    {
        // Mengambil data dari tabel user_activity_burns milik user yang sedang login
        // with('activity') digunakan agar relasi ke tabel activities (nama olahraga) ikut terbawa
        $records = UserActivityBurn::with('activity')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc') // Urutkan dari yang terbaru
            ->get();

        return response()->json($records);
    }

    public function getWeeklyActivity(Request $request)
    {
        $user = $request->user();

        // Menentukan rentang waktu: 7 hari terakhir (termasuk hari ini)
        $startDate = Carbon::now()->subDays(6)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        // 1. Ambil data Ringkasan Harian (Daily Summaries)
        // Asumsi tabel ini memiliki kolom 'date' (tipe date)
        $summaries = DailySummary::where('user_id', $user->id)
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->get()
            ->keyBy('date'); // Jadikan tanggal sebagai key array

        // 2. Ambil data Aktivitas/Olahraga
        // Asumsi tabel menggunakan 'created_at' untuk waktu aktivitas
        $activities = UserActivityBurn::where('user_id', $user->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function ($item) {
                return Carbon::parse($item->created_at)->format('Y-m-d');
            });

        // 3. Ambil data Konsumsi Makanan
        $foods = UserFoodIntake::where('user_id', $user->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function ($item) {
                return Carbon::parse($item->created_at)->format('Y-m-d');
            });

        // 4. Format Data agar rapi per hari untuk Frontend
        $weeklyData = [];

        // Looping dari 6 hari yang lalu sampai hari ini
        for ($i = 6; $i >= 0; $i--) {
            $dateString = Carbon::now()->subDays($i)->format('Y-m-d');
            $dateFormatted = Carbon::now()->subDays($i)->translatedFormat('l, d M Y'); // Contoh: Senin, 01 Mei 2026

            $weeklyData[] = [
                'date' => $dateString,
                'date_formatted' => $dateFormatted,
                // Jika tidak ada summary di hari itu, kembalikan null
                'summary' => $summaries->get($dateString, null),
                // Jika tidak ada aktivitas/makanan, kembalikan array kosong
                'activities' => $activities->get($dateString, []),
                'foods' => $foods->get($dateString, []),
            ];
        }

        // Kembalikan response JSON
        return response()->json([
            'status' => 'success',
            'message' => 'Data aktivitas mingguan berhasil diambil.',
            'data' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'weekly_logs' => array_reverse($weeklyData) // Urutkan dari hari ini ke hari terlama
            ]
        ]);
    }
}