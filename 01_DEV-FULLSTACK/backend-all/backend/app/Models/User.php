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

    /**
     * OVERRIDE: Fungsi bawaan Laravel untuk kirim email reset password via Resend API
     */
    public function sendPasswordResetNotification($token)
    {
        // Bikin URL yang mengarah ke Vercel lo
        $url = 'https://frontend-kohl-beta-61.vercel.app/reset-password?token=' . $token . '&email=' . $this->email;

        // Racik UI HTML mirip Laravel Default
        $htmlContent = '
        <div style="background-color: #edf2f7; margin: 0; padding: 50px 0; width: 100%; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                    <td align="center">
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 570px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);">
                            <tr>
                                <td style="padding: 25px 35px; text-align: center;">
                                    <span style="font-size: 19px; font-weight: bold; color: #3d4852;">' . env('MAIL_FROM_NAME', 'Healthy App') . '</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 35px; border-top: 1px solid #edeff2; border-bottom: 1px solid #edeff2; background-color: #ffffff;">
                                    <p style="font-size: 16px; color: #718096; margin-bottom: 25px;">Hello!</p>
                                    <p style="font-size: 16px; color: #718096; margin-bottom: 25px;">You are receiving this email because we received a password reset request for your account.</p>

                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                        <tr>
                                            <td align="center">
                                                <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                    <tr>
                                                        <td>
                                                            <a href="' . $url . '" style="display: inline-block; padding: 10px 25px; background-color: #2d3748; color: #ffffff; border-radius: 4px; text-decoration: none; font-weight: bold;">Reset Password</a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="font-size: 14px; color: #e53e3e; margin-top: 25px; text-align: center; font-weight: 500;">This password reset link will expire in 60 minutes.</p>
                                    
                                    <p style="font-size: 16px; color: #718096; margin-top: 25px;">If you did not request a password reset, no further action is required.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 35px; text-align: center;">
                                    <p style="font-size: 12px; color: #b0adc5;">&copy; ' . date('Y') . ' ' . env('MAIL_FROM_NAME', 'Healthy App') . '. All rights reserved.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>';

        // Format pengirim biar muncul Namanya, bukan cuma emailnya aja
        $senderName = env('MAIL_FROM_NAME', 'Healthy App');
        $senderEmail = env('MAIL_FROM_ADDRESS');
        $fromFormat = "{$senderName} <{$senderEmail}>";

        // Tembak langsung ke API Resend
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('MAIL_PASSWORD'),
            'Content-Type' => 'application/json',
        ])->post('https://api.resend.com/emails', [
                    'from' => $fromFormat,
                    'to' => $this->email,
                    'subject' => 'Reset Password',
                    'html' => $htmlContent,
                ]);

        if ($response->failed()) {
            \Log::error('Gagal kirim Resend API: ' . $response->body());
        }
    }
}
