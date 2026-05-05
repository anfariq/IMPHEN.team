import React, { useEffect, useState } from "react";
import { Home, Activity, User, Zap, ChevronRight, Flame, Apple, ChevronDown, X } from "lucide-react";
import FoodPredictor from "./Foods"; 
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { apiGet } from "../lib/api"; // <-- Tambahkan import apiGet di sini

/* ── fonts ── */
const FONTS = "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap";

/* ── animation helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ── CountUp ── */
function CountUp({ target, duration = 1.4 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return <>{val.toLocaleString("id-ID")}</>;
}

/* ── Circular Progress Ring ── */
function RingProgress({ percent, size = 110, stroke = 9, color = "#2563eb", trackColor = "rgba(37,99,235,0.12)", children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

/* ── Macro bar ── */
function MacroBar({ label, value, max = 200, color, bg }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex-1">
      <div className="flex justify-between mb-1.5">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.5px]">{label}</span>
        <span className="text-xs font-bold font-mono" style={{ color, fontFamily: "'JetBrains Mono', monospace" }}>{value}g</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: bg }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

/* ── Meal row ── */
const MEAL_ICONS = ["🍚", "🍢", "🥗", "🐟", "🍳", "🥘", "🫕", "🥙"];
function MealRow({ name, time, calories, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.07 }}
      className="flex items-center gap-3 py-2.5 border-b border-slate-100"
    >
      <div className="w-[42px] h-[42px] rounded-xl bg-blue-50 flex items-center justify-center text-lg shrink-0">
        {MEAL_ICONS[index % MEAL_ICONS.length]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-slate-800 truncate">{name}</div>
        {time && <div className="text-[11px] text-slate-400 mt-0.5">{time}</div>}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-xs font-bold text-blue-600 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{calories}</span>
        <span className="text-[10px] text-slate-400 font-medium">kcal</span>
      </div>
    </motion.div>
  );
}

/* ── Activity row ── */
const ACT_ICONS = ["🏃", "🚴", "🏊", "🏋️", "🚶", "🧘"];
function ActivityRow({ name, duration, calories_burned, index, dimmed = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.55 + index * 0.07 }}
      className={`flex items-center gap-3 py-2.5 border-b border-red-50 ${dimmed ? 'opacity-55' : 'opacity-100'}`}
    >
      <div className="w-[42px] h-[42px] rounded-xl bg-red-50 flex items-center justify-center text-lg shrink-0">
        {ACT_ICONS[index % ACT_ICONS.length]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-slate-800 truncate">{name}</div>
        <div className="text-[11px] text-red-300 mt-0.5">{duration} menit</div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-[11px] text-red-500 font-semibold">−</span>
        <span className="text-xs font-bold text-red-500 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{calories_burned}</span>
        <span className="text-[10px] text-red-300 font-medium">kcal</span>
      </div>
    </motion.div>
  );
}

/* ── Water glass ── */
function WaterGlass({ filled }) {
  return (
    <div className={`flex-1 h-7 rounded-md flex items-center justify-center ${filled ? 'bg-gradient-to-b from-blue-400 to-blue-600 border-none' : 'bg-blue-50 border border-blue-200'}`}>
      {filled && <div className="w-1.5 h-1.5 rounded-full bg-white/60" />}
    </div>
  );
}

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
        <motion.div
          layoutId="navBg"
          className="absolute inset-0 rounded-2xl bg-blue-50 z-0"
        />
      )}
      <div className={`z-10 transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
        {React.cloneElement(icon, { size: 20, strokeWidth: active ? 2.2 : 1.7 })}
      </div>
      <span className={`text-[10px] z-10 ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </motion.button>
  );
}

/* ── Section card ── */
function Card({ children, delay = 0, className = "", onClick }) {
  return (
    <motion.div 
      {...fadeUp(delay)} 
      onClick={onClick} 
      className={`bg-white rounded-[22px] border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(37,99,235,0.04)] p-5 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ── Section header ── */
function SectionHeader({ title, action, actionColor = "text-blue-600", onClick }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <span className="text-[15px] font-bold text-slate-900">{title}</span>
      {action && (
        <button onClick={onClick} className={`flex items-center gap-0.5 text-xs font-semibold cursor-pointer p-0 bg-transparent border-none ${actionColor}`}>
          {action} <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}

/* ── Helper: Cek apakah tanggal adalah hari ini ── */
const isToday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/* ── Helper: Cek apakah tanggal adalah kemarin ── */
const isYesterday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const yesterday = new Date();
  
  // Kurangi 1 hari dari hari ini untuk mendapatkan tanggal kemarin
  yesterday.setDate(yesterday.getDate() - 1);
  
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/* ════════════════════════════════
   MAIN DASHBOARD
════════════════════════════════ */
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showYesterdayAct, setShowYesterdayAct] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Diubah menjadi async untuk memanggil API secara paralel dan memfilter secara ketat
  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }

    try {
      // Panggil Dashboard API dan Record API secara bersamaan
      const [dashRes, recordsRes] = await Promise.all([
        fetch("https://gateforlaravl.vercel.app/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
            'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
          },
        }).then(r => r.json()),
        
        // Memanfaatkan apiGet untuk mengambil raw records riwayat
        apiGet("/activities/record", token).catch(() => []) 
      ]);

      // Ambil array record (mencegah error jika data kosong)
      const allRecords = Array.isArray(recordsRes) ? recordsRes : (recordsRes?.data || []);

      // Filter ketat menggunakan helper yang sudah dibuat
      const todayActivities = allRecords.filter(a => isToday(a.created_at));
      const yesterdayActivities = allRecords.filter(a => isYesterday(a.created_at));

      // Hitung manual berdasarkan data valid
      const todayBurned = todayActivities.reduce((sum, a) => sum + (a.calories_burned || a.burned || 0), 0);
      const yesterdayBurned = yesterdayActivities.reduce((sum, a) => sum + (a.calories_burned || a.burned || 0), 0);

      const normalized = {
        calories_today: dashRes?.today?.total_calories_in || dashRes?.today?.calories_in || 0,
        
        // Prioritaskan perhitungan dari validitas hari ini, jika 0 pakai fallback dashboard
        calories_burned: todayBurned > 0 ? todayBurned : (dashRes?.today?.total_calories_out || dashRes?.today?.calories_out || 0),
        
        calorie_goal: dashRes?.target_calories || 2000,
        macros: {
          protein: dashRes?.today?.protein || 0,
          carbs: dashRes?.today?.carbs || 0,
          fat: dashRes?.today?.fat || 0,
        },
        water: { current: dashRes?.today?.water ?? 0, goal: 8 },
        recent_meals: dashRes?.today?.meals || [],
        
        // Gunakan aktivitas yang sudah di filter
        recent_activities: todayActivities.length > 0 ? todayActivities : (dashRes?.today?.activities || []),
        yesterday_activities: yesterdayActivities,
        yesterday_calories_burned: yesterdayBurned,
      };

      setData(normalized);
      setLoading(false);

    } catch (error) {
      console.error("Gagal memuat data Dashboard:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white gap-3.5" style={{ fontFamily: "'Sora', sans-serif" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
          className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600"
        />
        <p className="text-blue-300 text-[13px] font-semibold">Memuat dashboard…</p>
      </div>
    );
  }

  const percent = Math.min((data.calories_today / data.calorie_goal) * 100, 100);
  const remaining = Math.max(data.calorie_goal - data.calories_today, 0);
  const netCalories = data.calories_today - data.calories_burned;

  return (
    <>
      <link href={FONTS} rel="stylesheet" />
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50" style={{ fontFamily: "'Sora', -apple-system, sans-serif" }}>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 pb-24 md:pb-8 md:pl-[90px] w-full">

          {/* ─── HEADER HERO ─── */}
          <motion.div {...fadeUp(0)} className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 pt-[clamp(32px,8vw,48px)] pb-9 px-6 rounded-b-[32px] md:rounded-b-[40px] relative overflow-hidden">
            <div className="absolute -top-10 -right-7 w-36 h-36 rounded-full bg-white/5" />
            <div className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full bg-white/5" />

            <div className="max-w-[1100px] mx-auto">
              <div className="flex justify-between items-center mb-8 relative">
                <div>
                  <div className="text-xs text-white/70 font-semibold tracking-wide uppercase">Selamat datang</div>
                  <h1 className="text-[clamp(22px,5vw,28px)] font-extrabold text-white mt-1 tracking-tight">Dashboard 👋</h1>
                </div>
                <motion.div whileTap={{ scale: 0.9 }} className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center cursor-pointer">
                  <User size={20} color="white" strokeWidth={2} />
                </motion.div>
              </div>

              <div className="flex items-center gap-5 md:gap-10">
                <RingProgress percent={percent} size={120} stroke={10} color="rgba(255,255,255,0.9)" trackColor="rgba(255,255,255,0.18)">
                  <div className="text-center">
                    <div className="text-[11px] text-white/70 font-semibold">dimakan</div>
                    <div className="text-2xl font-extrabold text-white leading-tight font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      <CountUp target={data.calories_today} />
                    </div>
                    <div className="text-[11px] text-white/60 font-medium">kcal</div>
                  </div>
                </RingProgress>

                <div className="flex-1">
                  <div className="mb-3.5">
                    <div className="text-xs text-white/70 mb-1">Target harian</div>
                    <div className="text-[26px] font-extrabold text-white font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {data.calorie_goal.toLocaleString("id-ID")}
                      <span className="text-sm font-medium text-white/60 ml-1.5">kcal</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 bg-white/10 rounded-xl py-2 px-3 w-max">
                      <Zap size={15} className="text-yellow-200" strokeWidth={2.5} />
                      <span className="text-[13px] font-semibold text-white">{remaining.toLocaleString("id-ID")} kcal tersisa</span>
                    </div>

                    {data.calories_burned > 0 && (
                      <div className="flex items-center gap-2 bg-white/10 rounded-xl py-2 px-3 w-max">
                        <Flame size={15} className="text-red-300" strokeWidth={2.5} />
                        <span className="text-[13px] font-semibold text-white/90">{data.calories_burned} kcal terbakar</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 relative">
                <div className="bg-white/15 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${percent}%` }}
                    transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
                    className="h-full bg-white/90 rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[11px] text-white/60">0</span>
                  <span className="text-[11px] text-white/80 font-bold">{percent.toFixed(0)}%</span>
                  <span className="text-[11px] text-white/60">{data.calorie_goal.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── BENTO GRID CONTENT ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 p-4 md:p-8 max-w-[1100px] mx-auto">

            {/* MACROS */}
            <Card delay={0.08} className="lg:col-span-1 lg:col-start-1">
              <SectionHeader title="Nutrisi Hari Ini" />
              <div className="flex flex-col gap-3.5">
                <MacroBar label="Protein" value={data.macros.protein} max={180} color="#2563eb" bg="#dbeafe" />
                <MacroBar label="Karbo" value={data.macros.carbs} max={300} color="#0ea5e9" bg="#e0f2fe" />
                <MacroBar label="Lemak" value={data.macros.fat} max={80} color="#3b82f6" bg="#eff6ff" />
              </div>
            </Card>

            {/* WATER */}
            <Card delay={0.13} className="lg:col-span-1 lg:col-start-2">
              <SectionHeader
                title="Air Minum"
                action={`${data.water.current}/${data.water.goal} gelas`}
              />
              <div className="text-xs text-slate-500 mb-3 -mt-2.5">Total: {data.water.current * 250}ml</div>
              <div className="flex gap-1.5">
                {Array.from({ length: data.water.goal }).map((_, i) => (
                  <motion.div
                    key={i} initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ delay: 0.25 + i * 0.05, duration: 0.3 }}
                    className="flex-1"
                  >
                    <WaterGlass filled={i < data.water.current} />
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* QUICK ACTIONS - SINGLE CARD */}
            <div className="lg:col-span-1 lg:col-start-3 flex flex-col">
              <Card delay={0.18} className="flex-1 flex flex-col justify-center cursor-pointer hover:-translate-y-1 transition-transform !p-6" onClick={() => setShowFoodModal(true)}>
                <div className="w-14 h-14 rounded-[16px] bg-sky-100 flex items-center justify-center mb-4">
                  <Apple size={28} className="text-sky-500" />
                </div>
                <div className="text-base font-bold text-slate-900">Input makanan anda</div>
                <div className="text-[13px] text-slate-500 mt-1">Catat kalori & nutrisi masuk</div>
              </Card>
            </div>

            {/* NET CALORIE SUMMARY */}
            <Card delay={0.22} className="lg:col-span-3 !bg-gradient-to-br !from-sky-50 !to-blue-50 !p-6">
              <div className="flex justify-between items-center">
                <div className="text-center flex-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Masuk</div>
                  <div className="text-2xl font-extrabold text-blue-600 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{data.calories_today.toLocaleString("id-ID")}</div>
                  <div className="text-xs text-blue-300 mt-0.5">kcal</div>
                </div>
                <div className="w-[2px] h-12 bg-blue-200" />
                <div className="text-center flex-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Terbakar</div>
                  <div className="text-2xl font-extrabold text-red-500 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{data.calories_burned.toLocaleString("id-ID")}</div>
                  <div className="text-xs text-red-300 mt-0.5">kcal</div>
                </div>
                <div className="w-[2px] h-12 bg-blue-200" />
                <div className="text-center flex-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Neto</div>
                  <div className={`text-2xl font-extrabold font-mono ${netCalories > 0 ? "text-blue-600" : "text-emerald-500"}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {netCalories.toLocaleString("id-ID")}
                  </div>
                  <div className="text-xs text-blue-300 mt-0.5">kcal</div>
                </div>
              </div>
            </Card>

            {/* RECENT MEALS */}
            <Card delay={0.26} className="lg:col-span-2">
              <SectionHeader title="Makan Hari Ini" action="Lihat semua" onClick={() => navigate("/foods")} />
              {data.recent_meals.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🍽️</div>
                  <p className="text-sm text-slate-400 m-0">Belum ada makanan hari ini</p>
                </div>
              ) : (
                data.recent_meals.map((m, i) => (
                  <MealRow key={i} name={m.name} time={m.time} calories={m.calories} index={i} />
                ))
              )}
            </Card>

            {/* TODAY'S ACTIVITIES */}
            <Card delay={0.3} className="lg:col-span-1 !border-red-50">
              <SectionHeader title="Aktivitas Hari Ini" action="Lihat semua" actionColor="text-red-500" onClick={() => navigate("/activity")} />
              {data.recent_activities.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🏃</div>
                  <p className="text-sm text-red-300 m-0">Belum ada aktivitas hari ini</p>
                </div>
              ) : (
                data.recent_activities.map((a, i) => (
                  <ActivityRow key={i} name={a.name || a.activity?.name} duration={a.duration_minutes || a.duration} calories_burned={a.calories_burned || a.burned} index={i} />
                ))
              )}
            </Card>

            {/* YESTERDAY'S ACTIVITIES */}
            <motion.div {...fadeUp(0.34)} className="lg:col-span-3">
              <div onClick={() => setShowYesterdayAct(v => !v)} className="bg-white border border-amber-100 rounded-[22px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(245,158,11,0.06)] cursor-pointer select-none">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Activity size={20} className="text-amber-600" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-slate-900">Aktivitas Kemarin</div>
                      {data.yesterday_activities.length > 0 && data.yesterday_calories_burned > 0 ? (
                        <div className="text-xs text-amber-600 mt-0.5 font-semibold">
                          {data.yesterday_activities.length} aktivitas · {data.yesterday_calories_burned} kcal terbakar
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 mt-0.5">Tidak ada data kemarin</div>
                      )}
                    </div>
                  </div>
                  <motion.div animate={{ rotate: showYesterdayAct ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={20} className="text-amber-600" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {showYesterdayAct && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} className="overflow-hidden">
                      <div className="mt-4 border-t border-amber-100 pt-4">
                        {data.yesterday_activities.length === 0 ? (
                          <div className="text-center py-5">
                            <div className="text-3xl mb-2">😴</div>
                            <p className="text-sm text-amber-600/60 m-0">Tidak ada aktivitas kemarin</p>
                          </div>
                        ) : (
                          data.yesterday_activities.map((a, i) => (
                            <ActivityRow key={i} name={a.name || a.activity?.name} duration={a.duration_minutes || a.duration} calories_burned={a.calories_burned || a.burned} index={i} dimmed />
                          ))
                        )}

                        {data.yesterday_calories_burned > 0 && (
                          <div className="mt-3 flex items-center justify-between bg-amber-100 rounded-2xl py-3 px-4">
                            <span className="text-[13px] font-semibold text-amber-900">Total terbakar kemarin</span>
                            <span className="text-base font-extrabold text-amber-600 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                              {data.yesterday_calories_burned} kcal
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

          </div>
        </main>

        {/* ─── MODAL POP-UP TAMBAH MAKANAN ─── */}
        <AnimatePresence>
          {showFoodModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-md"
              >
                {/* Tombol Tutup Pop-Up */}
                <button
                  onClick={() => setShowFoodModal(false)}
                  className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>

                {/* Panggil komponen FoodPredictor */}
                <FoodPredictor
                  onSuccess={() => {
                    // Beri jeda 2 detik agar pengguna bisa melihat hasil prediksinya dulu
                    setTimeout(() => {
                      setShowFoodModal(false); // Tutup pop up
                      fetchDashboardData(); // Refresh data Dashboard agar kalori langsung bertambah
                    }, 2000);
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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