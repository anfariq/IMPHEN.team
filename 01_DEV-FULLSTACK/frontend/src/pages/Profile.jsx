import React, { useEffect, useState } from "react";
import { Home, Activity, Camera, User, LogOut, Save, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

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
                    setCalculatedAge(data.user.age); // Ambil umur otomatis dari backend
                }
                if (data.profile) {
                    setForm({
                        weight: data.profile.weight || "",
                        height: data.profile.height || "",
                        gender: data.profile.gender || "male",
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
        if (window.confirm("Apakah Anda yakin ingin keluar?")) {
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-blue-600 font-bold bg-blue-50">
                Memuat profil...
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(160deg, #eff6ff 0%, #ffffff 100%)", // Gradient biru muda ke putih
            fontFamily: "'DM Sans', -apple-system, sans-serif",
            paddingBottom: 90,
        }}>
            {/* HEADER */}
            <div style={{
                background: "#2563eb", // Biru solid
                padding: "40px 20px 30px",
                borderBottomLeftRadius: 30,
                borderBottomRightRadius: 30,
                color: "white",
                boxShadow: "0 4px 20px rgba(37, 99, 235, 0.15)"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Profil Saya</h1>
                        <p style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Atur data diri dan target nutrisi</p>
                    </div>
                    <div style={{
                        width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
                    }}>
                        <User size={24} color="white" />
                    </div>
                </div>
            </div>

            <div style={{ padding: "0 20px", marginTop: -15 }}>
                {/* INFO AKUN */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
                    background: "white", borderRadius: 20, padding: "20px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)", marginBottom: 20
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                        <div style={{ background: "#dbeafe", padding: 12, borderRadius: 15 }}>
                            <Settings size={22} color="#2563eb" />
                        </div>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f" }}>{userInfo.name || "Pengguna"}</div>
                            <div style={{ fontSize: 12, color: "#93c5fd" }}>{userInfo.email}</div>
                        </div>
                    </div>
                </motion.div>

                {/* FORM DATA DIRI */}
                <form onSubmit={handleSave}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{
                        background: "white", borderRadius: 20, padding: "20px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.05)", marginBottom: 20
                    }}>
                        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", marginBottom: 15 }}>Metrik Tubuh & Target</h2>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 15 }}>
                            <InputGroup label="Berat (kg)" name="weight" type="number" value={form.weight} onChange={handleChange} />
                            <InputGroup label="Tinggi (cm)" name="height" type="number" value={form.height} onChange={handleChange} />
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Umur (Otomatis)</label>
                                <div style={{
                                    padding: "10px 12px", borderRadius: 10, background: "#f1f5f9",
                                    fontSize: 14, color: "#475569", border: "1px solid #e2e8f0"
                                }}>
                                    {calculatedAge} Tahun
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Gender</label>
                                <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
                                    <option value="male">Laki-laki</option>
                                    <option value="female">Perempuan</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 15 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Tingkat Aktivitas</label>
                            <select name="activity_level" value={form.activity_level} onChange={handleChange} style={inputStyle}>
                                <option value="sedentary">Sangat Jarang Olahraga</option>
                                <option value="light">Jarang (1-3 hari/minggu)</option>
                                <option value="moderate">Cukup Sering (3-5 hari/minggu)</option>
                                <option value="active">Sering (6-7 hari/minggu)</option>
                            </select>
                        </div>

                        <InputGroup
                            label="Target Kalori Harian (kcal)"
                            name="target_calories"
                            type="number"
                            value={form.target_calories}
                            onChange={handleChange}
                        />

                        <button type="submit" disabled={saving} style={{
                            width: "100%", background: saving ? "#93c5fd" : "#2563eb", color: "white",
                            padding: "14px", borderRadius: 14, border: "none", fontWeight: 600, fontSize: 14,
                            marginTop: 20, display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
                            cursor: saving ? "not-allowed" : "pointer", transition: "0.2s"
                        }}>
                            <Save size={18} />
                            {saving ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </motion.div>
                </form>

                {/* LOGOUT BUTTON */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <button onClick={handleLogout} style={{
                        width: "100%", background: "#fee2e2", color: "#ef4444",
                        padding: "14px", borderRadius: 14, border: "none", fontWeight: 600, fontSize: 14,
                        display: "flex", justifyContent: "center", alignItems: "center", gap: 8, cursor: "pointer"
                    }}>
                        <LogOut size={18} />
                        Keluar dari Akun
                    </button>
                </motion.div>

            </div>

            {/* BOTTOM NAVBAR */}
            <div style={{
                position: "fixed", bottom: 0, left: 0, right: 0,
                background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(59,130,246,0.1)",
                display: "flex", justifyContent: "space-around", padding: "10px 0 20px", zIndex: 100,
            }}>
                <NavItem icon={<Home />} label="Home" to="/dashboard" active={location.pathname === "/dashboard"} />
                <NavItem icon={<Activity />} label="Activity" to="/activity" active={location.pathname === "/activity"} />
                <NavItem icon={<Camera />} label="Scan" to="/scan" active={location.pathname === "/scan"} />
                <NavItem icon={<User />} label="Profile" to="/profile" active={location.pathname === "/profile"} />
            </div>
        </div>
    );
}

// --- Komponen Pendukung Pendek ---
const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 10,
    border: "1px solid #e2e8f0", background: "#f8fafc",
    fontSize: 14, color: "#1e293b", outline: "none", boxSizing: "border-box"
};

function InputGroup({ label, ...props }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>{label}</label>
            <input style={inputStyle} {...props} required />
        </div>
    );
}

function NavItem({ icon, label, to, active }) {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(to)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: active ? "#2563eb" : "#93c5fd", cursor: "pointer"
        }}>
            {React.cloneElement(icon, { size: 21, strokeWidth: active ? 2.2 : 1.8 })}
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{label}</span>
        </div>
    );
}