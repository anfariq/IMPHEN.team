<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Http;

#[Fillable(['name', 'full_name', 'email', 'gender', 'date_of_birth', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relasi: User memiliki satu Profil.
     * Penggunaan: $user->profile->weight
     */
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }
    // Tambahkan di dalam class User
    public function getAgeAttribute()
    {
        // Menghitung selisih tahun antara tanggal lahir dan sekarang
        return \Carbon\Carbon::parse($this->date_of_birth)->age;
    }

    // Pastikan age disertakan saat model diubah ke JSON
    protected $appends = ['age'];

    public function sendPasswordResetNotification($token)
    {
        // Bikin URL yang mengarah ke Vercel lo
        $url = 'https://frontend-kohl-beta-61.vercel.app/reset-password?token=' . $token . '&email=' . $this->email;

        // Tembak langsung ke API Resend (Bypass mail.php dan SMTP)
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('MAIL_PASSWORD'), // Pastikan ini API Key Resend lo
            'Content-Type' => 'application/json',
        ])->post('https://api.resend.com/emails', [
            'from' => env('MAIL_FROM_ADDRESS'), // Pastikan email ini verified di dashboard Resend lo
            'to' => $this->email,
            'subject' => 'Reset Password - Healthy App',
            'html' => '<p>Halo,</p><p>Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda.</p><p>Klik link di bawah ini untuk mereset password Anda:</p><p><a href="' . $url . '">Reset Password</a></p>',
        ]);

        // Opsional: Buat ngecek di log Railway kalau API Resend nolak (misal domain belum verified)
        if ($response->failed()) {
            \Log::error('Gagal kirim Resend API: ' . $response->body());
        }
    }
}
