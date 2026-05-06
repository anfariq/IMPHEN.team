import React, { useEffect, useState } from "react";
import { Home, Activity as ActivityIcon, User, Flame, UtensilsCrossed, CalendarDays, Info, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ── fonts ── */
const FONTS = "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap";

/* ── animation helpers ── */
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.3, delay, ease: [0.16, 1, 0.3, 1] },
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

export default function WeeklyActivity() {
    const [loading, setLoading] = useState(true);
    const [weeklyData, setWeeklyData] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0); // Index 0 = Hari Ini

    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await fetch("https://gateforlaravl.vercel.app/api/activity/weekly", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
                    },
                });

                const data = await response.json();
                if (data.status === 'success' && data.data) {
                    setWeeklyData(data.data.weekly_logs);
                }
            } catch (error) {
                console.error("Gagal mengambil data aktivitas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [token]);

    // Helper untuk memecah string tanggal (ex: "Senin, 01 Mei 2026")
    const parseDateInfo = (dateFormatted) => {
        if (!dateFormatted) return { dayName: "", dateNum: "" };
        const parts = dateFormatted.split(', ');
        const dayName = parts[0] ? parts[0].substring(0, 3) : ""; // Ambil 3 huruf pertama (Sen, Sel, dsb)
        const dateNum = parts[1] ? parts[1].split(' ')[0] : ""; // Ambil angka tanggalnya saja
        return { dayName, dateNum };
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-white gap-3.5" style={{ fontFamily: "'Sora', sans-serif" }}>
                <motion.div
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                    className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-600"
                />
                <p className="text-emerald-500 text-[13px] font-semibold">Memuat aktivitas...</p>
            </div>
        );
    }

    const activeDay = weeklyData[selectedIndex];

    return (
        <>
            <link href={FONTS} rel="stylesheet" />
            <style>{`
                /* Sembunyikan scrollbar untuk slider kalender horizontal */
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div className="flex flex-col md:flex-row min-h-screen bg-slate-50" style={{ fontFamily: "'Sora', -apple-system, sans-serif" }}>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 pb-28 md:pb-8 md:pl-[90px] w-full relative">

                    {/* ─── HEADER HERO (Lebih compact) ─── */}
                    <div className="bg-gradient-to-br from-teal-600 to-emerald-600 pt-[clamp(32px,6vw,40px)] pb-20 px-6 rounded-b-[40px] relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                        <div className="max-w-[800px] mx-auto relative z-10 flex items-center justify-between">
                            <div>
                                <h1 className="text-[24px] font-extrabold text-white tracking-tight">Riwayat Mingguan</h1>
                                <p className="text-emerald-100 text-[13px] font-medium mt-0.5">Pilih tanggal untuk melihat detail</p>
                            </div>
                        </div>
                    </div>

                    {/* ─── HORIZONTAL DATE SELECTOR ─── */}
                    <div className="max-w-[800px] mx-auto relative z-20 -mt-12 mb-4">
                        <div className="flex gap-3 overflow-x-auto px-6 pb-4 pt-2 hide-scrollbar snap-x">
                            {weeklyData.map((day, index) => {
                                const { dayName, dateNum } = parseDateInfo(day.date_formatted);
                                const isSelected = selectedIndex === index;
                                const isToday = index === 0;

                                return (
                                    <motion.button
                                        key={day.date}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedIndex(index)}
                                        className={`snap-center shrink-0 flex flex-col items-center justify-center w-[64px] h-[80px] rounded-[20px] transition-all duration-300 ${
                                            isSelected 
                                            ? "bg-white text-emerald-600 shadow-[0_8px_20px_rgba(16,185,129,0.15)] border-2 border-emerald-500 scale-105" 
                                            : "bg-white/80 backdrop-blur-md text-slate-500 border border-white/40 shadow-sm hover:bg-white"
                                        }`}
                                    >
                                        <span className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-emerald-500' : 'text-slate-400'}`}>
                                            {isToday ? "Kini" : dayName}
                                        </span>
                                        <span className={`text-[20px] font-extrabold ${isSelected ? 'text-emerald-600' : 'text-slate-700'}`}>
                                            {dateNum}
                                        </span>
                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ─── CONTENT AREA FOR SELECTED DAY ─── */}
                    <div className="max-w-[800px] mx-auto px-6 relative z-20">
                        {weeklyData.length === 0 ? (
                            <div className="bg-white rounded-[24px] border border-slate-100 p-8 text-center flex flex-col items-center gap-3">
                                <CalendarDays size={32} className="text-slate-300 mb-2" />
                                <h3 className="font-bold text-slate-800 text-lg">Belum Ada Catatan</h3>
                                <p className="text-sm text-slate-500">Data aktivitas mingguan Anda akan muncul di sini.</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.div key={selectedIndex} {...fadeUp(0)} className="flex flex-col gap-5">
                                    
                                    {/* TANGGAL TERPILIH (Label) */}
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-[15px] font-bold text-slate-800">
                                            {selectedIndex === 0 ? "Aktivitas Hari Ini" : activeDay.date_formatted}
                                        </h2>
                                    </div>

                                    {/* KARTU SUMMARY (Grid 2 Kolom) */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white border border-orange-100 rounded-[20px] p-4 flex flex-col shadow-[0_4px_15px_rgba(249,115,22,0.04)] relative overflow-hidden">
                                            <div className="absolute -right-3 -top-3 w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                                                <UtensilsCrossed size={16} className="text-orange-300" />
                                            </div>
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Konsumsi</span>
                                            <div className="flex items-end gap-1 mt-1">
                                                <span className="text-2xl font-extrabold text-orange-500 font-mono leading-none">{activeDay.summary?.total_calories_in || 0}</span>
                                                <span className="text-[11px] font-bold text-orange-400 mb-0.5">kcal</span>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-emerald-100 rounded-[20px] p-4 flex flex-col shadow-[0_4px_15px_rgba(16,185,129,0.04)] relative overflow-hidden">
                                            <div className="absolute -right-3 -top-3 w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                                                <Flame size={16} className="text-emerald-300" />
                                            </div>
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Terbakar</span>
                                            <div className="flex items-end gap-1 mt-1">
                                                <span className="text-2xl font-extrabold text-emerald-500 font-mono leading-none">{activeDay.summary?.total_calories_out || 0}</span>
                                                <span className="text-[11px] font-bold text-emerald-400 mb-0.5">kcal</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* LIST MAKANAN */}
                                    <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                                                <UtensilsCrossed size={16} className="text-orange-500" />
                                            </div>
                                            <h4 className="text-[14px] font-bold text-slate-800">Catatan Makanan</h4>
                                        </div>
                                        
                                        {activeDay.foods.length === 0 ? (
                                            <div className="bg-slate-50 border border-slate-100 border-dashed rounded-2xl p-4 text-center">
                                                <span className="text-[12px] text-slate-400 font-medium">Tidak ada makanan dicatat hari ini.</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-3">
                                                {activeDay.foods.map((food, i) => (
                                                    <div key={i} className="flex items-center justify-between group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-orange-300" />
                                                            <span className="font-semibold text-[13px] text-slate-700">{food.food_name || "Makanan"}</span>
                                                        </div>
                                                        <span className="text-[13px] font-bold text-orange-600 bg-orange-50/80 px-2.5 py-1 rounded-lg font-mono">+{food.calories || 0}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* LIST OLAHRAGA */}
                                    <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                                <Flame size={16} className="text-emerald-500" />
                                            </div>
                                            <h4 className="text-[14px] font-bold text-slate-800">Catatan Olahraga</h4>
                                        </div>
                                        
                                        {activeDay.activities.length === 0 ? (
                                            <div className="bg-slate-50 border border-slate-100 border-dashed rounded-2xl p-4 text-center">
                                                <span className="text-[12px] text-slate-400 font-medium">Tidak ada olahraga dicatat hari ini.</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-3">
                                                {activeDay.activities.map((act, i) => (
                                                    <div key={i} className="flex items-center justify-between group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-300" />
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-[13px] text-slate-700">{act.activity_name || "Aktivitas"}</span>
                                                                <span className="text-[11px] text-slate-400 font-medium">{act.duration_minutes || 0} Menit</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-[13px] font-bold text-emerald-600 bg-emerald-50/80 px-2.5 py-1 rounded-lg font-mono">-{act.calories_burned || 0}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                </main>

                {/* ─── NAVBAR / SIDEBAR ─── */}
                <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 flex justify-around p-2 pb-[max(16px,env(safe-area-inset-bottom))] z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.02)] md:top-0 md:bottom-0 md:w-[90px] md:flex-col md:justify-start md:py-10 md:border-t-0 md:border-r md:border-slate-200 md:shadow-[4px_0_20px_rgba(0,0,0,0.02)] md:gap-4">
                    <NavItem icon={<Home />} label="Home" to="/dashboard" active={location.pathname === "/dashboard"} />
                    <NavItem icon={<ActivityIcon />} label="Aktivitas" to="/activity" active={location.pathname === "/activity"} />
                    <NavItem icon={<CalendarDays />} label="Weekly Aktivitas" to="/weekly-activity" active={location.pathname === "/weekly-activity"} />
                    <NavItem icon={<User />} label="Profil" to="/profile" active={location.pathname === "/profile"} />
                </nav>
            </div>
        </>
    );
}