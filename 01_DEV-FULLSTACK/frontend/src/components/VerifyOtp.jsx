import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from 'react-hot-toast';

export default function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.error("Sesi tidak valid. Silakan login kembali untuk melanjutkan verifikasi.", {
                duration: 4000,
                style: {
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    color: '#0f172a',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                },
                iconTheme: {
                    primary: '#eab308',
                    secondary: '#fff',
                },
            });
            navigate("/login");
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp.length < 6) {
            return toast.error("Kode verifikasi harus 6 digit", {
                duration: 4000,
                style: {
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    color: '#0f172a',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                },
                iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                },
            });
        }

        try {
            setLoading(true);

            const res = await fetch("https://imphenteam-production.up.railway.app/api/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
                },
                body: JSON.stringify({
                    email: email,
                    otp_code: otp,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Verifikasi gagal");
            }

            toast.success('Email berhasil diverifikasi! Anda telah login.', {
                duration: 4000,
                style: {
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    color: '#0f172a',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                },
                iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                },
            });

            localStorage.setItem("token", data.access_token);
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            navigate("/dashboard");

        } catch (err) {
            toast.error(err.message, {
                duration: 4000,
                style: {
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    color: '#0f172a',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                },
                iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setResending(true);
            const res = await fetch("https://imphenteam-production.up.railway.app/api/resend-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
                },
                body: JSON.stringify({ email: email }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Gagal mengirim ulang kode");

            toast.success("Kode OTP baru telah dikirim ke email Anda!", {
                duration: 4000,
                style: {
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    color: '#0f172a',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                },
                iconTheme: {
                    primary: '#3b82f6',
                    secondary: '#fff',
                },
            });
        } catch (err) {
            toast.error(err.message, {
                duration: 4000,
                style: {
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    color: '#0f172a',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                },
                iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                },
            });
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4 relative">
            
            {/* BACK TO LOGIN (Tombol Melayang di Kiri Atas) */}
            <button
                onClick={() => navigate("/login")}
                className="absolute top-6 left-6 text-sm text-blue-600 font-medium hover:text-blue-800 hover:underline flex items-center gap-1 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm transition-all"
            >
                ← Kembali ke Login
            </button>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-10">

                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Verifikasi Email</h2>
                    <p className="text-sm text-gray-500 mt-2">
                        Kami telah mengirimkan 6 digit kode OTP ke email <br />
                        <span className="font-semibold text-blue-600">{email}</span>
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 text-center mb-2">Kode OTP</label>
                        <input
                            type="text"
                            maxLength="6"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                            placeholder="••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.length < 6}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Memverifikasi..." : "Verifikasi Akun"}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 flex flex-col items-center gap-3">
                    <p className="text-sm text-center text-gray-500">
                        Belum menerima email?{' '}
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            type="button"
                            className="text-blue-600 font-medium hover:underline focus:outline-none disabled:opacity-50 disabled:no-underline"
                        >
                            {resending ? "Mengirim ulang..." : "Kirim Ulang"}
                        </button>
                    </p>
                    
                    {/* Opsi Ganti Email jika user salah ketik saat Register */}
                    <button 
                        onClick={() => navigate("/register")}
                        className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Salah memasukkan alamat email? Daftar ulang
                    </button>
                </div>
            </div>
        </div>
    );
}