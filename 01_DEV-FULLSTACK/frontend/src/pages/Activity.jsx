import React, { useEffect, useState } from "react";
import { Home, Activity as ActivityIcon, User, Flame, Plus, History, ChevronRight, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { apiGet, apiPost } from "../lib/api";

/* ── fonts ── */
const FONTS = "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap";

/* ── animation helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

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

/* ── Activity row for History ── */
const ACT_ICONS = ["🏃", "🚴", "🏊", "🏋️", "🚶", "🧘", "🤸", "🧗"];
function ActivityRow({ name, duration, calories_burned, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      className="flex items-center gap-3 py-3 border-b border-red-50 last:border-0"
    >
      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-xl shrink-0">
        {ACT_ICONS[index % ACT_ICONS.length]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-bold text-slate-800 truncate">{name}</div>
        {duration && <div className="text-xs text-slate-400 mt-0.5">{duration} menit</div>}
      </div>
      <div className="flex items-center gap-1 shrink-0 bg-red-50 px-3 py-1.5 rounded-lg">
        <Flame size={14} className="text-red-500" />
        <span className="text-sm font-bold text-red-600 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{calories_burned}</span>
        <span className="text-[10px] text-red-400 font-medium uppercase tracking-wider">kcal</span>
      </div>
    </motion.div>
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
        <motion.div layoutId="navBg" className="absolute inset-0 rounded-2xl bg-blue-50 z-0" />
      )}
      <div className={`z-10 transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
        {React.cloneElement(icon, { size: 20, strokeWidth: active ? 2.2 : 1.7 })}
      </div>
      <span className={`text-[10px] z-10 ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </motion.button>
  );
}

/* ── Section card ── */
function Card({ children, delay = 0, className = "" }) {
  return (
    <motion.div {...fadeUp(delay)} className={`bg-white rounded-[24px] border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(239,68,68,0.04)] p-6 md:p-8 ${className}`}>
      {children}
    </motion.div>
  );
}

export default function Activity() {
  const [activities, setActivities] = useState({});
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ activity_id: "", duration_minutes: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // State untuk custom dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [actData, historyData] = await Promise.all([
        apiGet("/activities", token),
        apiGet("/activities/record", token)
      ]);
      
      const rawActivities = Array.isArray(actData) ? actData : (actData?.data || []);
      const groupedActivities = rawActivities.reduce((acc, curr) => {
        const category = curr.category || "Lainnya";
        if (!acc[category]) acc[category] = [];
        acc[category].push(curr);
        return acc;
      }, {});

      setActivities(groupedActivities);

      const safeRecords = Array.isArray(historyData) ? historyData : (historyData?.data || []);
      setRecords(safeRecords);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setActivities({});
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchData();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.activity_id || !form.duration_minutes) return;

    setSubmitting(true);
    try {
      await apiPost(
        "/activities/record",
        {
          activity_id: Number(form.activity_id),
          duration_minutes: Number(form.duration_minutes),
        },
        token
      );
      setForm({ activity_id: "", duration_minutes: "" });
      fetchData(); 
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan aktivitas");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter records berdasarkan hari ini
  const todaysRecords = (records || []).filter(r => isToday(r.created_at));
  const totalBurned = todaysRecords.reduce((sum, r) => sum + (r.calories_burned || 0), 0);

  // Helper untuk mendapatkan nama aktivitas yang dipilih pada dropdown
  const getSelectedActivityName = () => {
    if (!form.activity_id) return "Pilih aktivitas...";
    for (const cat in activities) {
      const found = activities[cat].find(a => String(a.id) === String(form.activity_id));
      if (found) return found.name;
    }
    return "Pilih aktivitas...";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-white gap-3.5" style={{ fontFamily: "'Sora', sans-serif" }}>
        <motion.div
          animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
          className="w-8 h-8 rounded-full border-4 border-red-100 border-t-red-500"
        />
        <p className="text-red-400 text-[13px] font-semibold">Memuat aktivitas...</p>
      </div>
    );
  }

  return (
    <>
      <link href={FONTS} rel="stylesheet" />
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}} />
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50" style={{ fontFamily: "'Sora', -apple-system, sans-serif" }}>
        
        <main className="flex-1 pb-24 md:pb-8 md:pl-[90px] w-full">
          {/* ─── HEADER HERO ─── */}
          <motion.div {...fadeUp(0)} className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 pt-[clamp(32px,8vw,48px)] pb-10 px-6 rounded-b-[32px] md:rounded-b-[40px] relative overflow-hidden">
            <div className="absolute -top-10 -right-7 w-40 h-40 rounded-full bg-white/10 blur-xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10 blur-xl" />

            <div className="max-w-[1100px] mx-auto relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-xs text-white/80 font-semibold tracking-widest uppercase mb-1">Tracker</div>
                  <h1 className="text-[clamp(24px,5vw,32px)] font-extrabold text-white tracking-tight">Aktivitas Fisik 🔥</h1>
                </div>
              </div>

              {/* SUMMARY HIGHLIGHT */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-white/80 text-[13px] font-medium mb-1">Total Kalori Terbakar Hari Ini</p>
                  <div className="flex items-end gap-2">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {(Number(totalBurned) || 0).toFixed(0)}
                    </h2>
                    <span className="text-white/70 text-lg font-medium mb-1.5 md:mb-2">kcal</span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <Flame size={32} className="text-white drop-shadow-md" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── BENTO GRID CONTENT ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 md:p-8 max-w-[1100px] mx-auto -mt-4 relative z-20">

            {/* FORM TAMBAH AKTIVITAS */}
            <Card delay={0.1} className="lg:col-span-5 flex flex-col h-fit">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Plus size={20} className="text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Catat Aktivitas</h2>
                  <p className="text-xs text-slate-500">Pilih jenis olahraga dan durasinya</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* --- CUSTOM DROPDOWN --- */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Jenis Aktivitas</label>
                  
                  {/* Overlay background to close dropdown when clicking outside */}
                  {isDropdownOpen && (
                    <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                  )}

                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full bg-slate-50 border ${isDropdownOpen ? 'border-red-400 ring-4 ring-red-500/10' : 'border-slate-200'} text-slate-800 text-[14px] font-medium rounded-2xl px-4 py-3.5 flex items-center justify-between cursor-pointer transition-all relative z-40`}
                  >
                    <span className={!form.activity_id ? "text-slate-400" : "text-slate-800 truncate"}>
                      {getSelectedActivityName()}
                    </span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden"
                      >
                        <div className="max-h-[280px] overflow-y-auto custom-scrollbar py-2">
                          {Object.keys(activities).map((cat) => (
                            <div key={cat} className="mb-1">
                              <div className="sticky top-0 bg-white/95 backdrop-blur-md px-4 py-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest z-10">
                                {cat}
                              </div>
                              <div className="flex flex-col">
                                {(activities[cat] || []).map((a) => (
                                  <div
                                    key={a.id}
                                    onClick={() => {
                                      setForm({ ...form, activity_id: String(a.id) });
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`px-4 py-3 text-[13px] font-medium cursor-pointer transition-colors flex items-center justify-between ${
                                      String(form.activity_id) === String(a.id)
                                        ? "bg-red-50 text-red-600"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                  >
                                    <span className="truncate pr-4">{a.name}</span>
                                    <span className={`shrink-0 text-[10px] font-bold font-mono px-2 py-1 rounded-lg ${
                                        String(form.activity_id) === String(a.id) ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-400"
                                    }`}>
                                      MET {a.met_value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* --- END CUSTOM DROPDOWN --- */}

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Durasi</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Contoh: 30"
                      value={form.duration_minutes}
                      onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium font-mono rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-400 transition-all"
                      min="1"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-slate-400">menit</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold text-[15px] py-4 rounded-2xl shadow-[0_8px_20px_-8px_rgba(239,68,68,0.5)] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <>Simpan Aktivitas</>
                  )}
                </motion.button>
              </form>
            </Card>

            {/* RIWAYAT AKTIVITAS - HANYA HARI INI */}
            <Card delay={0.2} className="lg:col-span-7 flex flex-col h-full min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <History size={20} className="text-red-500" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Riwayat Anda (Hari Ini)</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
                {todaysRecords.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-60">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <ActivityIcon size={32} className="text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">Belum ada aktivitas yang dicatat hari ini.</p>
                    <p className="text-sm text-slate-400 mt-1">Ayo mulai bergerak hari ini!</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {todaysRecords.map((r, i) => (
                      <ActivityRow
                        key={r.id}
                        index={i}
                        name={r.activity?.name || "Aktivitas Tidak Diketahui"}
                        duration={r.duration_minutes || r.duration}
                        calories_burned={r.calories_burned}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>

          </div>
        </main>

        {/* ─── NAVBAR / SIDEBAR ─── */}
        <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 flex justify-around p-2 pb-[max(16px,env(safe-area-inset-bottom))] z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.02)] md:top-0 md:bottom-0 md:w-[90px] md:flex-col md:justify-start md:py-10 md:border-t-0 md:border-r md:border-slate-200 md:shadow-[4px_0_20px_rgba(0,0,0,0.02)] md:gap-4">
          <NavItem icon={<Home />} label="Home" to="/dashboard" active={location.pathname === "/dashboard"} />
          <NavItem icon={<ActivityIcon />} label="Aktivitas" to="/activity" active={location.pathname === "/activity"} />
          <NavItem icon={<User />} label="Profil" to="/profile" active={location.pathname === "/profile"} />
        </nav>
      </div>
    </>
  );
}