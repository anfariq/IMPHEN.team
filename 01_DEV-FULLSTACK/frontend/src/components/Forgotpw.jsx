import React, { useState } from "react";

export default function ForgotPassword() {
  // 1. State untuk mengelola input, loading, dan pesan balasan
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // 2. Fungsi untuk menembak API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      // Ganti URL ini sesuai dengan URL backend Laravel Anda
      const response = await fetch("http://localhost:3000/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json", // Wajib agar Laravel merespon dengan JSON saat error
          "x-api-key": "WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=="
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Jika sukses (Status 200)
        setMessage(data.message);
        setEmail(""); // Kosongkan form
      } else {
        // Jika gagal (Status 4xx/5xx dari validasi Laravel)
        setError(data.message || "Terjadi kesalahan, silakan coba lagi.");
      }
    } catch (err) {
      // Jika server mati atau ada masalah CORS
      setError("Gagal terhubung ke server. Pastikan backend sedang berjalan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE - Branding */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-500 text-white p-10">
          <h1 className="text-3xl font-bold mb-4">Healthy App</h1>
          <p className="text-sm text-blue-100 text-center">
            Secure your account and continue your journey towards a healthier lifestyle.
          </p>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center md:text-left">
            Reset Password
          </h2>

          <p className="text-sm text-gray-500 mb-6 text-center md:text-left">
            Enter your registered email and we’ll send you a secure link to reset your password.
          </p>

          {/* Alert Sukses */}
          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              {message}
            </div>
          )}

          {/* Alert Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-bold py-3 rounded-lg focus:ring-2 focus:ring-blue-500 flex justify-center items-center ${
                isLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isLoading ? (
                <span>Mengirim...</span>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="px-3 text-sm text-gray-400">OR</span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>

          {/* Back to Login */}
          <p className="text-sm text-center text-gray-600">
            Remember your password?{' '}
            <a href="/login" className="text-blue-600 font-medium hover:underline">
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}