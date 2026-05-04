<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;


class PasswordResetController extends Controller
{
    /**
     * Endpoint 1: Menerima email dan mengirimkan link konfirmasi
     */
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ], [
            'email.exists' => 'Email tidak ditemukan di sistem kami.'
        ]);

        // Broker Laravel akan mengurus pembuatan token dan pengiriman email
        $status = Password::broker()->sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Link reset password telah dikirim ke email Anda.'], 200);
        }

        return response()->json(['message' => 'Gagal mengirim link reset password.'], 400);
    }

    /**
     * Endpoint 2: Menerima token, email, dan password baru dari frontend
     */
    public function reset(Request $request)
    {
        // Validasi input dari frontend
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed', // Frontend harus mengirim field 'password' & 'password_confirmation'
        ]);

        $status = Password::broker()->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password berhasil diubah.'], 200);
        }

        return response()->json(['message' => 'Token tidak valid atau email salah.'], 400);
    }
}