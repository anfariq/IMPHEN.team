<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MLClientService;
use App\Models\MLPredictionLog;
use Illuminate\Http\Request;

class MLProxyController extends Controller
{
    protected $mlService;

    public function __construct(MLClientService $ml)
    {
        $this->mlService = $ml;
    }

    public function predictFood(Request $request)
    {
        // Validasi input dari React/Next.js
        $inputData = $request->validate([
            'protein' => 'required|numeric',
            'lemak' => 'required|numeric',
            'karbohidrat' => 'required|numeric',
            'total_nutrisi' => 'required|numeric',
            'gram' => 'numeric', // Default 100g jika tidak diisi
        ]);

        // Panggil Service yang nembak ke Hugging Face
        $prediction = $this->mlService->getPrediction('/predict-calories', $inputData);

        // Logging otomatis
        MLPredictionLog::create([
            'user_id' => $request->user()->id,
            'endpoint' => '/predict-calories',
            'request_payload' => $inputData,
            'response_payload' => $prediction,
            'status' => $prediction['status']
        ]);

        return response()->json($prediction);
    }
}