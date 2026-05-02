import React, { useState, useEffect } from "react";

export default function ResetPassword() {
  // 1. State untuk form dan status
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // 2. Mengambil Parameter dari URL saat komponen dimuat
  useEffect(() => {
    // Menangkap query string dari URL (contoh: ?token=abc&email=user@test.com)
    const searchParams = new URLSearchParams(window.location.search);
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (emailParam && tokenParam) {
      setEmail(emailParam);
      setToken(tokenParam);
    } else {
      setError("Link reset password tidak valid atau sudah kadaluarsa.");
    }
  }, []);

  // 3. Fungsi untuk menembak API Reset Password
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi dasar di frontend
    if (password !== passwordConfirmation) {
      setError("Konfirmasi password tidak cocok!");
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("https://gateforlaravl.vercel.app/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
          'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
        },
        body: JSON.stringify({
          email: email,
          token: token,
          password: password,
          password_confirmation: passwordConfirmation, // Sesuai requirement validasi Laravel
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Password berhasil diubah! Silakan login.");
        setPassword("");
        setPasswordConfirmation("");
        // Opsional: Redirect ke halaman login setelah 3 detik
        // setTimeout(() => window.location.href = '/login', 3000);
      } else {
        // Menangkap pesan error dari validasi Laravel (misal: password terlalu pendek)
        setError(data.message || "Gagal mereset password.");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan. Pastikan server berjalan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE - Branding */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-600 text-white p-10">
          <h1 className="text-3xl font-bold mb-4">Healthy App</h1>
          <p className="text-sm text-blue-100 text-center">
            You're almost there! Create a new, strong password to secure your account.
          </p>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center md:text-left">
            Create New Password
          </h2>

          <p className="text-sm text-gray-500 mb-6 text-center md:text-left">
            Please enter your new password below.
          </p>

          {/* Alert Sukses */}
          {message && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-sm flex flex-col gap-2">
              <span>{message}</span>
              <a href="/login" className="font-bold underline hover:text-green-800">
                Go to Login Page &rarr;
              </a>
            </div>
          )}

          {/* Alert Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Sembunyikan form jika token/email tidak ada, atau jika sudah sukses */}
          {email && token && !message ? (
            <form className="space-y-5" onSubmit={handleSubmit}>

              {/* Password Baru */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="Enter new password (min. 8 characters)"
                  required
                  disabled={isLoading}
                  minLength={8}
                />
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="Confirm your new password"
                  required
                  disabled={isLoading}
                  minLength={8}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white font-bold py-3 mt-4 rounded-lg focus:ring-2 focus:ring-blue-500 flex justify-center items-center transition-all ${
                  isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Saving Password..." : "Reset Password"}
              </button>
            </form>
          ) : null}

        </div>
      </div>
    </div>
  );
}