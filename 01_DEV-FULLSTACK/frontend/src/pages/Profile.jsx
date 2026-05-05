import React, { useEffect, useState } from "react";
import { Home, Activity, User, LogOut, Save, Settings, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';


/* ── fonts ── */
const FONTS = "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap";

/* ── animation helpers ── */
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ── Nav item ── */
function NavItem({ icon, label, to, active }) {
    const navigate = useNavigate();
    return (
        <motion.button
            whileTap={{ scale: 0.87 }}
            onClick={() => navigate(to)}
            className={`relative flex flex-col items-center gap-1 px-4 py-2 w-[68px] cursor-pointer border-none bg-transparent ${active ? 'text-blue-600' : 'text-slate-400'}`}
        >
            {active && (
                <motion.div layoutId="navBg" className="absolute inset-0 rounded-2xl bg-blue-50 z-0" />
            )}
            <div className={`z-10 transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
                {React.cloneElement(icon, { size: 20, strokeWidth: active ? 2.2 : 1.7 })}
            </div>
            <span className={`text-[10px] z-10 ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
        </motion.button>
    );
}

/* ── Reusable Input ── */
function InputGroup({ label, ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
            <input
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
                {...props}
                required
            />
        </div>
    );
}

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: "", email: "" });
    const [form, setForm] = useState({
        weight: "",
        height: "",
        gender: "male",
        activity_level: "sedentary",
        target_calories: "",
    });
    const [calculatedAge, setCalculatedAge] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("https://gateforlaravl.vercel.app/api/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
                'Accept': 'application/json',
                'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUserInfo(data.user);
                    setCalculatedAge(data.user.age);
                }
                if (data.profile) {
                    setForm({
                        weight: data.profile.weight || "",
                        height: data.profile.height || "",
                        gender: data.profile.gender || "",
                        activity_level: data.profile.activity_level || "sedentary",
                        target_calories: data.profile.target_calories || 2000,
                    });
                }
                setLoading(false);
            });
    }, [token]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch("https://gateforlaravl.vercel.app/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                alert("Profil berhasil diperbarui!");
            } else {
                alert("Gagal memperbarui profil. Periksa kembali isian Anda.");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan jaringan.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        toast('Sampai jumpa lagi!', {
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
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white gap-3.5" style={{ fontFamily: "'Sora', sans-serif" }}>
                <motion.div
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                    className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600"
                />
                <p className="text-blue-400 text-[13px] font-semibold">Memuat profil...</p>
            </div>
        );
    }

    return (
        <>
            <link href={FONTS} rel="stylesheet" />
            <div className="flex flex-col md:flex-row min-h-screen bg-slate-50" style={{ fontFamily: "'Sora', -apple-system, sans-serif" }}>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 pb-24 md:pb-8 md:pl-[90px] w-full">

                    {/* ─── HEADER HERO ─── */}
                    <motion.div {...fadeUp(0)} className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 pt-[clamp(32px,8vw,48px)] pb-12 px-6 rounded-b-[32px] md:rounded-b-[40px] relative overflow-hidden">
                        <div className="absolute -top-10 -right-7 w-40 h-40 rounded-full bg-white/5 blur-xl" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5 blur-xl" />

                        <div className="max-w-[800px] mx-auto relative z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-white/80 font-semibold tracking-widest uppercase mb-1">Pengaturan</div>
                                    <h1 className="text-[clamp(24px,5vw,32px)] font-extrabold text-white tracking-tight">Profil Saya ⚙️</h1>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <User size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ─── CONTENT GRID ─── */}
                    <div className="max-w-[800px] mx-auto px-4 md:px-8 -mt-6 relative z-20 flex flex-col gap-5">

                        {/* INFO AKUN (READ ONLY) */}
                        <motion.div {...fadeUp(0.1)} className="bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(37,99,235,0.04)] p-5 md:p-6 flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                                <Shield size={24} className="text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-base font-bold text-slate-900 truncate">{userInfo.name || "Pengguna"}</div>
                                <div className="text-[13px] text-slate-500 truncate mt-0.5">{userInfo.email}</div>
                            </div>
                        </motion.div>

                        {/* FORM DATA DIRI */}
                        <motion.div {...fadeUp(0.2)} className="bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(37,99,235,0.04)] p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <Settings size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Metrik Tubuh & Target</h2>
                                    <p className="text-xs text-slate-500">Sesuaikan untuk perhitungan kalori akurat</p>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="flex flex-col gap-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup label="Berat (kg)" name="weight" type="number" step="0.1" value={form.weight} onChange={handleChange} />
                                    <InputGroup label="Tinggi (cm)" name="height" type="number" value={form.height} onChange={handleChange} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Umur (Auto)</label>
                                        <div className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-[14px] font-medium rounded-2xl px-4 py-3.5 flex items-center font-mono">
                                            {calculatedAge} <span className="text-xs ml-1 font-sans">Tahun</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
                                        <select
                                            name="gender" value={form.gender} onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
                                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
                                        >
                                            <option value="male">Laki-laki</option>
                                            <option value="female">Perempuan</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Tingkat Aktivitas</label>
                                    <select
                                        name="activity_level" value={form.activity_level} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
                                    >
                                        <option value="sedentary">Sangat Jarang Olahraga</option>
                                        <option value="light">Jarang (1-3 hari/minggu)</option>
                                        <option value="moderate">Cukup Sering (3-5 hari/minggu)</option>
                                        <option value="active">Sering (6-7 hari/minggu)</option>
                                    </select>
                                </div>

                                <div className="mt-2">
                                    <InputGroup label="Target Kalori Harian (kcal)" name="target_calories" type="number" value={form.target_calories} onChange={handleChange} />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={saving}
                                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-[15px] py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Simpan Perubahan
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>

                        {/* LOGOUT BUTTON */}
                        <motion.div {...fadeUp(0.3)}>
                            <button onClick={handleLogout} className="w-full bg-white hover:bg-red-50 border border-red-100 text-red-500 font-bold text-[14px] py-4 rounded-[20px] transition-all flex items-center justify-center gap-2 shadow-sm">
                                <LogOut size={18} />
                                Keluar dari Akun
                            </button>
                        </motion.div>

                    </div>
                </main>

                {/* ─── NAVBAR / SIDEBAR ─── */}
                <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 flex justify-around p-2 pb-[max(16px,env(safe-area-inset-bottom))] z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.02)] md:top-0 md:bottom-0 md:w-[90px] md:flex-col md:justify-start md:py-10 md:border-t-0 md:border-r md:border-slate-200 md:shadow-[4px_0_20px_rgba(0,0,0,0.02)] md:gap-4">
                    <NavItem icon={<Home />} label="Home" to="/dashboard" active={location.pathname === "/dashboard"} />
                    <NavItem icon={<Activity />} label="Aktivitas" to="/activity" active={location.pathname === "/activity"} />
                    <NavItem icon={<User />} label="Profil" to="/profile" active={location.pathname === "/profile"} />
                </nav>
            </div>
        </>
    );
}