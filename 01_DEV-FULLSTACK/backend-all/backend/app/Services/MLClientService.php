<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\MLPredictionLog;
use Illuminate\Support\Facades\Auth;

class MLClientService
{
    protected $baseUrl;

    public function __construct()
    {
        // Gunakan config() sebagai prioritas, pastikan fallback-nya benar
        $this->baseUrl = config('services.ml.url') ?? env('ML_SERVICE_URL');

        // Hilangkan slash di akhir baseUrl jika ada, biar nggak double slash nantinya
        $this->baseUrl = rtrim($this->baseUrl, '/');
    }

    /**
     * Mengambil prediksi kalori dan mencatatnya ke database
     */
    // app/Services/MLClientService.php

    /**
     * Mengambil prediksi dari AI (Bisa buat makanan atau olahraga)
     */
    public function getPrediction(string $endpoint, array $data)
    {
        $path = '/' . ltrim($endpoint, '/');
        $fullUrl = $this->baseUrl . $path;

        try {
            // Tambahkan withoutVerifying() untuk bypass masalah SSL di lokal
            $response = Http::withoutVerifying()
                ->timeout(30) // Naikin timeout jadi 30s buat jaga-jaga HF "ngantuk"
                ->post($fullUrl, $data);

            if ($response->successful()) {
                $responseData = $response->json();

                // Catat Log Sukses
                $this->logPrediction($endpoint, $data, $responseData, 'success');

                return [
                    'status' => 'success',
                    'data' => $responseData
                ];
            }

            // Jika responsenya bukan 2xx (misal 404 atau 500)
            return ['status' => 'error', 'message' => 'AI Service returned ' . $response->status()];

        } catch (\Exception $e) {
            \Log::error("ML Service Error at $fullUrl: " . $e->getMessage());
            return ['status' => 'offline', 'message' => $e->getMessage()];
        }
    }

    // Helper untuk simpan log biar rapi
    private function logPrediction($endpoint, $data, $response, $status)
    {
        MLPredictionLog::create([
            'user_id' => \Auth::id() ?? 1, // Fallback ke ID 1 jika ngetes via Tinker
            'endpoint' => $endpoint,
            'request_payload' => $data,
            'response_payload' => $response,
            'status' => $status,
        ]);
    }
}