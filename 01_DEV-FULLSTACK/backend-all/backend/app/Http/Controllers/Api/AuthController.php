<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    /**
     * Endpoint 1: Menerima data pendaftaran, simpan dengan status uncomplete, dan kirim OTP via Resend
     */
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

        // Generate 6 digit kode OTP
        $otpCode = (string) rand(100000, 999999);

        // Bungkus dalam transaksi database agar aman (jika gagal buat profil, user tidak tersimpan)
        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $request->name,
                'full_name' => $request->full_name,
                'email' => $request->email,
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'password' => Hash::make($request->password),
                'status' => 'verifikasi uncomplete',
                'otp_code' => $otpCode,
            ]);

            Profile::create([
                'user_id' => $user->id,
                'weight' => 0,
                'height' => 0,
                'age' => 0,
                'gender' => $request->gender,
                'activity_level' => 'sedentary'
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat menyimpan data.'], 500);
        }

        // Template HTML Email yang Cantik untuk Resend
        $htmlContent = "
            <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;'>
                <h2 style='color: #0f172a; text-align: center;'>Selamat datang di Healthy AI! 🌱</h2>
                <p style='color: #475569; font-size: 16px;'>Halo <b>{$user->name}</b>,</p>
                <p style='color: #475569; font-size: 16px;'>Terima kasih telah mendaftar. Untuk menyelesaikan registrasi dan mengaktifkan akun Anda, silakan masukkan kode verifikasi berikut:</p>
                <div style='text-align: center; margin: 30px 0;'>
                    <span style='font-size: 36px; font-weight: bold; color: #10B981; letter-spacing: 10px; background: #ecfdf5; padding: 15px 30px; border-radius: 8px; display: inline-block;'>{$otpCode}</span>
                </div>
                <p style='color: #64748b; font-size: 14px;'>Kode ini berlaku untuk sesi ini dan bersifat rahasia. Jangan berikan kode ini kepada siapa pun.</p>
            </div>
        ";

        try {
            // KIRIM VIA HTTP API RESEND (Bypass SMTP Vercel)
            $response = Http::withToken(env('MAIL_PASSWORD'))
                ->post('https://api.resend.com/emails', [
                    'from' => 'Healthy AI <' . env('MAIL_FROM_ADDRESS') . '>',
                    'to' => [$user->email],
                    'subject' => 'Kode Verifikasi Akun Healthy AI',
                    'html' => $htmlContent
                ]);

            if (!$response->successful()) {
                // Rollback user jika gagal kirim email
                // DB::rollBack(); (Aktifkan jika pakai DB Transaction)
                return response()->json(['message' => 'Gagal ngirim email: ' . $response->body()], 500);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Koneksi gagal: ' . $e->getMessage()], 500);
        }

        return response()->json([
            'status' => 'pending_verification',
            'message' => 'Registrasi berhasil! Link verifikasi telah dikirim ke email Anda.',
            'email' => $user->email // Kirim email ke frontend agar bisa otomatis diisi di halaman input OTP
        ], 201);
    }

    /**
     * Endpoint 2: Menerima kode OTP dan memverifikasi akun
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp_code' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Pengguna tidak ditemukan.'], 404);
        }

        if ($user->status === 'verifikasi complete') {
            return response()->json(['message' => 'Akun ini sudah diverifikasi sebelumnya.'], 400);
        }

        if ($user->otp_code !== $request->otp_code) {
            return response()->json(['message' => 'Kode verifikasi salah.'], 400);
        }

        // Verifikasi Sukses: Ubah status, hapus OTP, dan berikan Token Login
        $user->update([
            'status' => 'verifikasi complete',
            'otp_code' => null
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Email berhasil diverifikasi! Anda telah login.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('profile')
        ], 200);
    }

    /**
     * Endpoint untuk mengirim ulang kode OTP
     */
    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Pengguna tidak ditemukan.'], 404);
        }

        if ($user->status === 'verifikasi complete') {
            return response()->json(['message' => 'Akun ini sudah diverifikasi. Anda bisa langsung login.'], 400);
        }

        // Generate OTP Baru
        $newOtpCode = (string) rand(100000, 999999);

        $user->update([
            'otp_code' => $newOtpCode
        ]);

        // Template HTML Email yang Cantik untuk Resend
        $htmlContent = "
            <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;'>
                <h2 style='color: #0f172a; text-align: center;'>Kode OTP Baru Anda 🔄</h2>
                <p style='color: #475569; font-size: 16px;'>Halo <b>{$user->name}</b>,</p>
                <p style='color: #475569; font-size: 16px;'>Kami menerima permintaan untuk mengirimkan ulang kode verifikasi Anda. Berikut adalah kode OTP baru Anda:</p>
                <div style='text-align: center; margin: 30px 0;'>
                    <span style='font-size: 36px; font-weight: bold; color: #3b82f6; letter-spacing: 10px; background: #eff6ff; padding: 15px 30px; border-radius: 8px; display: inline-block;'>{$newOtpCode}</span>
                </div>
                <p style='color: #64748b; font-size: 14px;'>Kode ini akan menggantikan kode sebelumnya. Jangan berikan kode ini kepada siapa pun.</p>
            </div>
        ";

        try {
            // KIRIM VIA HTTP API RESEND (Bypass SMTP Vercel)
            $response = Http::withToken(env('MAIL_PASSWORD'))
                ->post('https://api.resend.com/emails', [
                    'from' => 'Healthy AI <' . env('MAIL_FROM_ADDRESS') . '>',
                    'to' => [$user->email],
                    'subject' => 'Kirim Ulang: Kode Verifikasi Healthy AI',
                    'html' => $htmlContent
                ]);

            if (!$response->successful()) {
                // Sengaja kita tampilkan error asli dari Resend biar gampang debug
                return response()->json(['message' => 'Gagal dari Resend: ' . $response->body()], 500);
            }

        } catch (\Exception $e) {
            return response()->json(['message' => 'Koneksi API gagal: ' . $e->getMessage()], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Kode OTP baru berhasil dikirim ke email Anda.'
        ], 200);
    }

    /**
     * Endpoint 3: Login User Biasa
     */
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

        // Cegah login jika belum verifikasi OTP
        if ($user->status === 'verifikasi uncomplete') {
            return response()->json([
                'status' => 'unverified',
                'message' => 'Akun Anda belum diverifikasi. Silakan masukkan kode OTP yang dikirim ke email Anda.',
                'email' => $user->email
            ], 403);
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

    /**
     * Endpoint 4: Logout
     */
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