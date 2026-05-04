import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (msg) => alert(msg);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("https://gateforlaravl.vercel.app/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login gagal");
      }

      // simpan token
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success('Selamat Datang Kembali!', {
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
          primary: '#2563eb', // Warna biru yang senada dengan UI kamu
          secondary: '#fff',
        },
      });

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
          primary: '#dc2626', // Warna merah untuk error
          secondary: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden relative">

        {/* BACK TO LANDING */}
        <a
          href="/"
          className="absolute top-4 left-4 text-sm text-white font-medium hover:underline"
        >
          ← Back to Home
        </a>

        {/* LEFT SIDE - Branding */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-500 text-white p-10">
          <h1 className="text-3xl font-bold mb-4">Healthy App</h1>
          <p className="text-sm text-blue-100 text-center">
            Stay consistent, track your progress, and improve your health every day.
          </p>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center md:text-left">
            Welcome Back
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-end">

              <a
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="px-3 text-sm text-gray-400">OR</span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>

          {/* Register Redirect */}
          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{' '}
            <a href="/register" className="text-blue-600 font-medium hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}