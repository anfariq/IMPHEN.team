<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // Registrasi User Baru + Otomatis Buat Profil Kosong
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'gender' => 'required|string|in:male,female',
            'date_of_birth' => 'required|date',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'full_name' => $request->full_name,
            'email' => $request->email,
            'gender' => $request->gender,
            'date_of_birth' => $request->date_of_birth,
            'password' => Hash::make($request->password),
        ]);

        // Buat profil default agar tidak error saat diakses pertama kali
        Profile::create([
            'user_id' => $user->id,
            'weight' => 0,
            'height' => 0,
            'age' => 0,
            'gender' => $request->gender,
            'activity_level' => 'sedentary'
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('profile')
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email atau password salah.'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $sessionId = Str::random(40);

        $payload = base64_encode(json_encode([
            'user_id' => $user->id,
            'email' => $user->email,
        ]));

        \DB::table('sessions')->insert([
            'id' => $sessionId,
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
            'payload' => $payload,
            'last_activity' => now()->timestamp,
        ]);

        return response()->json([
            'access_token' => $token,
            'session_id' => $sessionId,
            'token_type' => 'Bearer',
            'user' => $user->load('profile')
        ]);
    }

    // Logout (Hapus Token)
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Berhasil logout.']);
    }
    public function showProfile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'age' => $user->age,
            ],
            'profile' => $user->profile
        ]);
    }

    // Memperbarui data profil
    public function updateProfile(Request $request)
    {
        // 1. Ubah validasi menjadi 'nullable' agar mengizinkan data kosong/tidak dikirim
        $request->validate([
            'weight' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'gender' => 'nullable|in:male,female',
            'activity_level' => 'nullable|string',
            'target_calories' => 'nullable|numeric|min:500',
        ]);

        $user = $request->user();

        // 2. Cari profil yang sudah ada, atau buat instance baru jika belum pernah ada
        $profile = Profile::firstOrNew(['user_id' => $user->id]);

        // 3. Update HANYA kolom yang dikirim dari Frontend
        // Jika tidak dikirim (null), maka data lama di database tidak akan tertimpa/hilang
        if ($request->has('weight') && $request->weight != null) {
            $profile->weight = $request->weight;
        }
        if ($request->has('height') && $request->height != null) {
            $profile->height = $request->height;
        }
        if ($request->has('gender') && $request->gender != null) {
            $profile->gender = $request->gender;
        }
        if ($request->has('activity_level') && $request->activity_level != null) {
            $profile->activity_level = $request->activity_level;
        }
        if ($request->has('target_calories') && $request->target_calories != null) {
            $profile->target_calories = $request->target_calories;
        }

        // Selalu sinkronkan umur dari tabel user (seperti kode Nona Muda sebelumnya)
        $profile->age = $user->age;

        // 4. Simpan ke database
        $profile->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Profil berhasil diperbarui!',
            'profile' => $profile
        ]);
    }
}