import React, { useEffect, useState } from "react";
import { Home, Activity, Camera, User, Zap, Droplets, ChevronRight, TrendingUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

/* ── animation helper ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ── CountUp ── */
function CountUp({ target, duration = 1.3 }) {
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

/* ── Macro pill ── */
function MacroPill({ label, value, color, bg }) {
  return (
    <div style={{ background: bg, borderRadius: 14, padding: "12px 10px", textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color }}>{value}g</div>
      <div style={{ fontSize: 10, color, opacity: 0.7, marginTop: 2, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

/* ── Meal row ── */
function MealRow({ name, time, calories, index }) {
  const emojis = ["🍚", "🍢", "🥗", "🐟", "🍳", "🥘", "🫕", "🥙"];
  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.55 + index * 0.08 }}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "11px 0",
        borderBottom: "1px solid rgba(59,130,246,0.08)",
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 12, background: "#EFF6FF",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, flexShrink: 0,
      }}>{emojis[index % emojis.length]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
        {time && <div style={{ fontSize: 11, color: "#93c5fd", marginTop: 2 }}>{time}</div>}
      </div>
      <div style={{
        fontSize: 12, fontWeight: 700, color: "#2563eb",
        background: "#EFF6FF", padding: "4px 10px", borderRadius: 20, flexShrink: 0,
      }}>{calories} kcal</div>
    </motion.div>
  );
}

/* ── Activity row (BARU DITAMBAHKAN) ── */
function ActivityRow({ name, duration, calories_burned, index }) {
  const emojis = ["🏃", "🚴", "🏊", "🏋️", "🚶", "🧘"];
  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.65 + index * 0.08 }}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "11px 0",
        borderBottom: "1px solid rgba(59,130,246,0.08)",
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 12, background: "#FEF2F2",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, flexShrink: 0,
      }}>{emojis[index % emojis.length]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
        <div style={{ fontSize: 11, color: "#f87171", marginTop: 2 }}>{duration} menit</div>
      </div>
      <div style={{
        fontSize: 12, fontWeight: 700, color: "#ef4444",
        background: "#FEF2F2", padding: "4px 10px", borderRadius: 20, flexShrink: 0,
      }}>-{calories_burned} kcal</div>
    </motion.div>
  );
}

/* ── Nav item ── */
function NavItem({ icon, label, to, active }) {
  const navigate = useNavigate();
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={() => navigate(to)}
      style={{
        border: "none", background: "none", cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
        color: active ? "#2563eb" : "#93c5fd", padding: "0 12px",
      }}
    >
      <div style={{ transition: "transform 0.2s", transform: active ? "scale(1.15)" : "scale(1)" }}>
        {React.cloneElement(icon, { size: 21, strokeWidth: active ? 2.2 : 1.8 })}
      </div>
      <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{label}</span>
      {active && (
        <motion.div
          layoutId="navDot"
          style={{ width: 4, height: 4, borderRadius: 2, background: "#2563eb" }}
        />
      )}
    </motion.button>
  );
}

/* ════════════════════════════════
   MAIN DASHBOARD
════════════════════════════════ */
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }

    fetch("http://localhost:3000/api/dashboard", {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
        'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const normalized = {
          calories_today: res?.today?.total_calories_in || res?.today?.calories_in || 0,
          calories_burned: res?.today?.total_calories_out || res?.today?.calories_out || 0, // <-- Diambil dari database Anda (calories_out)
          calorie_goal: res?.target_calories || 2000,
          macros: {
            protein: res?.today?.protein || 0,
            carbs: res?.today?.carbs || 0,
            fat: res?.today?.fat || 0,
          },
          water: { current: res?.today?.water ?? 0, goal: 8 },
          recent_meals: res?.today?.meals || [],
          recent_activities: res?.today?.activities || [], // <-- Menangkap data aktivitas dari backend
        };
        setData(normalized);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(160deg, #dbeafe 0%, #eff6ff 60%, #fff 100%)",
        gap: 16,
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            border: "3px solid #bfdbfe", borderTopColor: "#2563eb",
          }}
        />
        <p style={{ color: "#93c5fd", fontSize: 13, fontWeight: 500 }}>Loading dashboard...</p>
      </div>
    );
  }

  const percent = Math.min((data.calories_today / data.calorie_goal) * 100, 100);
  const remaining = Math.max(data.calorie_goal - data.calories_today, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #dbeafe 0%, #eff6ff 50%, #f8fbff 100%)",
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      paddingBottom: 90,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <motion.div {...fadeUp(0)} style={{ padding: "36px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, color: "#93c5fd", fontWeight: 600, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 4 }}>
            Selamat Datang
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1e40af", margin: 0 }}>Dashboard 👋</h1>
          <p style={{ fontSize: 12, color: "#93c5fd", marginTop: 2 }}>Track your daily nutrition</p>
        </div>
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <User size={18} color="white" strokeWidth={2} />
        </div>
      </motion.div>

      <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* HERO CALORIE CARD */}
        <motion.div {...fadeUp(0.08)} style={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)",
          borderRadius: 24, padding: "22px 22px 20px", color: "white",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -28, right: -24, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "absolute", bottom: -16, left: 120, width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.6px" }}>Today Calories</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: 44, fontWeight: 700, lineHeight: 1 }}>
                    <CountUp target={data.calories_today} />
                  </span>
                  <span style={{ fontSize: 15, opacity: 0.65 }}>kcal</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{percent.toFixed(0)}%</div>
                <div style={{ fontSize: 10, opacity: 0.65 }}>dari target</div>
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: 8, height: 6, margin: "16px 0 6px", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.35 }}
                style={{ height: "100%", background: "rgba(255,255,255,0.9)", borderRadius: 8 }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.6 }}>
              <span>0 kcal</span>
              <span>Goal: {data.calorie_goal.toLocaleString("id-ID")} kcal</span>
            </div>

            {/* TAMBAHAN: Indikator kalori tersisa dan kalori terbakar */}
            <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "6px 12px",
              }}>
                <Zap size={12} color="white" />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{remaining.toLocaleString("id-ID")} kcal tersisa</span>
              </div>
              
              {data.calories_burned > 0 && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,200,200,0.2)", borderRadius: 20, padding: "6px 12px",
                }}>
                  <Activity size={12} color="#fca5a5" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#fee2e2" }}>{data.calories_burned} kcal terbakar</span>
                </div>
              )}
            </div>
            
          </div>
        </motion.div>

        {/* MACROS */}
        <motion.div {...fadeUp(0.15)} style={{
          background: "white", borderRadius: 20,
          border: "1px solid rgba(59,130,246,0.1)", padding: "16px 18px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>Nutrition Breakdown</span>
            <TrendingUp size={15} color="#93c5fd" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <MacroPill label="Protein" value={data.macros.protein} color="#2563eb" bg="#eff6ff" />
            <MacroPill label="Carbs"   value={data.macros.carbs}   color="#1d4ed8" bg="#dbeafe" />
            <MacroPill label="Fat"     value={data.macros.fat}     color="#3b82f6" bg="#eff6ff" />
          </div>
        </motion.div>

        {/* WATER */}
        <motion.div {...fadeUp(0.2)} style={{
          background: "white", borderRadius: 20,
          border: "1px solid rgba(59,130,246,0.1)", padding: "16px 18px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>Water Intake</span>
              <div style={{ fontSize: 11, color: "#93c5fd", marginTop: 2 }}>
                {data.water.current} / {data.water.goal} glasses · {data.water.current * 250}ml
              </div>
            </div>
            <Droplets size={18} color="#3b82f6" />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: data.water.goal }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                style={{
                  flex: 1, height: 32, borderRadius: 8,
                  background: i < data.water.current
                    ? "linear-gradient(180deg, #3b82f6, #1d4ed8)"
                    : "#dbeafe",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {i < data.water.current && (
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.7)" }} />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* QUICK ACTIONS */}
        <motion.div {...fadeUp(0.25)} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { title: "Scan Food",   icon: <Camera size={20} color="#2563eb" />, bg: "#eff6ff", onClick: () => navigate("/scan") },
            { title: "Add Manual",  icon: <Activity size={20} color="#1d4ed8" />, bg: "#dbeafe", onClick: () => navigate("/foods") },
          ].map((a) => (
            <motion.div
              key={a.title}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={a.onClick}
              style={{
                background: "white", border: "1px solid rgba(59,130,246,0.12)",
                borderRadius: 18, padding: "16px", cursor: "pointer",
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 11, background: a.bg,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10,
              }}>{a.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>{a.title}</div>
              <div style={{ fontSize: 11, color: "#93c5fd", marginTop: 2 }}>Tap to open</div>
            </motion.div>
          ))}
        </motion.div>

        {/* RECENT MEALS */}
        <motion.div {...fadeUp(0.3)} style={{
          background: "white", borderRadius: 20,
          border: "1px solid rgba(59,130,246,0.1)", padding: "16px 18px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>Recent Meals</span>
            <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, color: "#3b82f6", cursor: "pointer", fontWeight: 600 }}>
              See all <ChevronRight size={14} />
            </div>
          </div>

          {data.recent_meals.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🍽️</div>
              <p style={{ fontSize: 13, color: "#bfdbfe" }}>No meals yet</p>
            </div>
          ) : (
            data.recent_meals.map((m, i) => (
              <MealRow key={i} name={m.name} time={m.time} calories={m.calories} index={i} />
            ))
          )}
        </motion.div>

        {/* RECENT ACTIVITIES (BARU DITAMBAHKAN) */}
        <motion.div {...fadeUp(0.35)} style={{
          background: "white", borderRadius: 20,
          border: "1px solid rgba(239,68,68,0.1)", padding: "16px 18px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>Recent Activities</span>
            <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, color: "#ef4444", cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("/activity")}>
              See all <ChevronRight size={14} />
            </div>
          </div>

          {data.recent_activities.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🏃</div>
              <p style={{ fontSize: 13, color: "#fca5a5" }}>No activities yet</p>
            </div>
          ) : (
            data.recent_activities.map((a, i) => (
              <ActivityRow 
                key={i} 
                name={a.name || a.activity?.name} 
                duration={a.duration_minutes || a.duration} 
                calories_burned={a.calories_burned || a.burned} 
                index={i} 
              />
            ))
          )}
        </motion.div>

      </div>

      {/* BOTTOM NAVBAR */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(59,130,246,0.1)",
        display: "flex", justifyContent: "space-around",
        padding: "10px 0 20px", zIndex: 100,
      }}>
        <NavItem icon={<Home />}     label="Home"     to="/dashboard" active={location.pathname === "/dashboard"} />
        <NavItem icon={<Activity />} label="Activity" to="/activity"  active={location.pathname === "/activity"} />
        <NavItem icon={<Camera />}   label="Scan"     to="/scan"      active={location.pathname === "/scan"} />
        <NavItem icon={<User />}     label="Profile"  to="/profile"   active={location.pathname === "/profile"} />
      </div>
    </div>
  );
}