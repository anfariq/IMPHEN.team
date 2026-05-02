import { useEffect, useState } from "react";
import { Home, Activity as ActivityIcon, Camera, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiGet, apiPost } from "../lib/api";

export default function Activity() {
  const [activities, setActivities] = useState({});
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    activity_id: "",
    duration_minutes: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      // Jalankan request GET ke /activities dan /activities/record secara bersamaan
      const [actData, historyData] = await Promise.all([
        apiGet("/activities", token),
        apiGet("/activities/record", token) // Memanggil endpoint history
      ]);
      
      // 1. Kelompokkan (Group) array data berdasarkan "category"
      const rawActivities = Array.isArray(actData) ? actData : (actData?.data || []);
      const groupedActivities = rawActivities.reduce((acc, curr) => {
        const category = curr.category || "Lainnya";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(curr);
        return acc;
      }, {});

      setActivities(groupedActivities);

      // 2. Set state records dengan data history dari backend
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
    if (!token) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.activity_id || !form.duration_minutes) return;

    setSubmitting(true);

    try {
      // Endpoint ini sesuai dengan route POST /activities/record di api.php
      await apiPost(
        "/activities/record",
        {
          activity_id: Number(form.activity_id),
          duration_minutes: Number(form.duration_minutes),
        },
        token
      );

      setForm({ activity_id: "", duration_minutes: "" });
      alert("Aktivitas berhasil ditambahkan!");
      
      // Refresh data jika sudah ada endpoint untuk history
      fetchData(); 
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan aktivitas");
    } finally {
      setSubmitting(false);
    }
  };

  // Kalkulasi total kalori
  const totalBurned = (records || []).reduce(
    (sum, r) => sum + (r.calories_burned || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-600 font-bold">
        Memuat data aktivitas...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 pb-24">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-bold text-blue-700">
          Activity Tracker
        </h1>
      </div>

      <div className="px-6 space-y-6 mt-6">
        {/* SUMMARY */}
        <div className="bg-blue-600 text-white p-6 rounded-2xl">
          <p>Calories Burned</p>
          <h2 className="text-3xl font-bold">
            {(Number(totalBurned) || 0).toFixed(0)} kcal
          </h2>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-xl space-y-3 shadow-sm"
        >
          <select
            value={form.activity_id}
            onChange={(e) =>
              setForm({ ...form, activity_id: e.target.value })
            }
            className="w-full border p-2 rounded"
          >
            <option value="">Select Activity</option>
            {/* Render data yang sudah dikelompokkan */}
            {Object.keys(activities).map((cat) => (
              <optgroup key={cat} label={cat}>
                {(activities[cat] || []).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} (MET: {a.met_value})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <input
            type="number"
            placeholder="Duration (minutes)"
            value={form.duration_minutes}
            onChange={(e) =>
              setForm({ ...form, duration_minutes: e.target.value })
            }
            className="w-full border p-2 rounded"
            min="1"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors"
            disabled={submitting}
          >
            {submitting ? "Adding..." : "Add Activity"}
          </button>
        </form>

        {/* HISTORY */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-bold mb-3">History</h2>

          {records.length === 0 ? (
            <p className="text-gray-400 text-sm">No records yet</p>
          ) : (
            records.map((r) => (
              <div
                key={r.id}
                className="flex justify-between border-b py-2 text-sm"
              >
                <span>{r.activity?.name || "Unknown Activity"}</span>
                <span className="font-semibold text-blue-600">{r.calories_burned} kcal</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* NAV */}
      <div className="fixed bottom-0 w-full bg-white flex justify-around p-3 border-t">
        <NavItem
          to="/dashboard"
          icon={<Home />}
          active={location.pathname === "/dashboard"}
        />
        <NavItem to="/activity" icon={<ActivityIcon />} active />
        <NavItem
          to="/scan"
          icon={<Camera />}
          active={location.pathname === "/scan"}
        />
        <NavItem
          to="/profile"
          icon={<User />}
          active={location.pathname === "/profile"}
        />
      </div>
    </div>
  );
}

function NavItem({ icon, to, active }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className={active ? "text-blue-600" : "text-gray-400"}
    >
      {icon}
    </button>
  );
}