import { useState } from "react";

const NAV_LINKS = ["Fitur", "Cara Kerja", "Blog", "FAQ"];

const MEALS = [
  { name: "Sarapan", cal: 420, max: 600 },
  { name: "Makan Siang", cal: 680, max: 800 },
  { name: "Makan Malam", cal: 0, max: 600 },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Cari Makanan Indonesia",
    desc: "Ketik nama makanan — nasi padang, gorengan, soto, rendang. Database lokal kami langsung mengenalinya.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-6 h-6"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Log Makan Sehari-hari",
    desc: "Tambahkan makanan ke diary harian. Porsi bisa disesuaikan — sepiring, setengah, atau dua porsi.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-6 h-6"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Pantau Progress Harian",
    desc: "Lihat kalori tersisa, nutrisi makro, dan tren mingguan dalam dashboard yang bersih & intuitif.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-6 h-6"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    title: "AI Food Detection",
    desc: "Foto makanan Anda dan AI kami langsung mengenali hidangan Indonesia — bahkan warung pinggir jalan.",
    badge: "Powered by AI",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-7 h-7"
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    title: "Kalori & Nutrisi Otomatis",
    desc: "Kalori, protein, karbohidrat, lemak — semuanya dihitung otomatis berdasarkan data gizi lokal yang akurat.",
    badge: "Real Data",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-7 h-7"
      >
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    title: "Database Makanan Lokal",
    desc: "Ribuan menu Indonesia dari warung, restoran Padang, hingga jajanan pasar sudah tersedia.",
    badge: "10.000+ menu",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-7 h-7"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
];

const TESTIMONIALS = [
  {
    name: "Rina S.",
    city: "Jakarta",
    text: "Akhirnya ada app yang ngerti nasi uduk itu beda kalorinya sama nasi putih biasa 😂 Sangat membantu!",
    avatar: "RS",
  },
  {
    name: "Budi P.",
    city: "Surabaya",
    text: "Database-nya lengkap banget. Soto ayam, lontong, semua ada. Diet jadi lebih masuk akal pakai ini.",
    avatar: "BP",
  },
  {
    name: "Dewi A.",
    city: "Bandung",
    text: "Sudah 2 bulan turun 5 kg hanya dengan tracking pakai app ini. Simple dan tidak ribet.",
    avatar: "DA",
  },
];

const FAQS = [
  {
    q: "Apakah data kalori makanan Indonesia akurat?",
    a: "Ya. Dataset kami dikurasi dari data gizi BPOM, penelitian universitas, dan nutrisi restoran lokal. Kami terus update secara berkala.",
  },
  {
    q: "Apakah fitur AI food detection perlu koneksi internet?",
    a: "Ya, deteksi foto membutuhkan koneksi internet. Namun pencarian dan logging manual bisa dilakukan offline.",
  },
  {
    q: "Apakah aplikasinya gratis?",
    a: "Core features sepenuhnya gratis. Ada fitur premium opsional untuk analisis lebih mendalam dan meal planning AI.",
  },
  {
    q: "Bagaimana cara menghitung kalori makanan rumahan?",
    a: "Cukup masukkan nama masakan atau bahan-bahannya. AI kami akan estimasi kalori berdasarkan resep umum Indonesia.",
  },
];

const BLOGS = [
  {
    tag: "Nutrisi",
    title: "Berapa Kalori Nasi Padang Sebenarnya?",
    desc: "Breakdown lengkap kalori rendang, gulai, dan sayur nangka dalam satu porsi.",
    mins: "4 min",
  },
  {
    tag: "Tips Diet",
    title: "Gorengan & Diet: Bisa Tetap Makan Dengan Bijak",
    desc: "Cara menikmati gorengan favorit tanpa merusak progress diet Anda.",
    mins: "3 min",
  },
  {
    tag: "Gaya Hidup",
    title: "Menu Sehat dari Warung Pinggir Jalan",
    desc: "Panduan memilih makanan bergizi dari warung makan sehari-hari.",
    mins: "5 min",
  },
];

function CircleProgress({ value, max, size = 120 }) {
  const pct = Math.min(value / max, 1);
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="-rotate-90"
    >
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="8"
      />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="#2563eb"
        strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
    </svg>
  );
}

export default function App() {
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalCal = 1840;
  const consumed = 1100;
  const remaining = totalCal - consumed;

  return (
    <div
      className="min-h-screen bg-white text-slate-800"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .grad-text { background: linear-gradient(135deg, #1d4ed8, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(37,99,235,0.10); }
        .faq-transition { max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease; }
        .faq-open { max-height: 200px; }
      `}</style>

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              HealthyAI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(" ", "-")}`}
                className="text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium"
              >
                {l}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Masuk
            </button>
            <button className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Mulai Gratis
            </button>
          </div>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <div className="w-5 h-0.5 bg-slate-700 mb-1"></div>
            <div className="w-5 h-0.5 bg-slate-700 mb-1"></div>
            <div className="w-5 h-0.5 bg-slate-700"></div>
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href={`#${l}`}
                className="text-sm font-medium text-slate-600"
              >
                {l}
              </a>
            ))}
            <button className="text-sm font-semibold bg-blue-600 text-white px-4 py-2.5 rounded-lg w-full">
              Mulai Gratis
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              Khusus Makanan Indonesia 🇮🇩
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-[3.25rem] font-bold leading-tight text-slate-900 mb-5">
              Track kalori
              <br />
              <span className="grad-text">makanan Indonesia</span>
              <br />
              dengan mudah
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-md">
              AI kami paham nasi padang, gorengan, soto, dan makanan rumahan
              sehari-hari. Diet realistis, tanpa skip makanan favorit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-blue-600 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 text-sm">
                Start Tracking Now – Free →
              </button>
              <button className="text-sm font-medium text-slate-600 px-6 py-3.5 rounded-xl border border-slate-200 hover:border-blue-200 hover:text-blue-600 transition-colors">
                Lihat Demo
              </button>
            </div>
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-100">
              {[
                ["50K+", "Pengguna aktif"],
                ["10K+", "Menu Indonesia"],
                ["4.9★", "Rating pengguna"],
              ].map(([val, label]) => (
                <div key={label}>
                  <div className="text-xl font-bold text-slate-900">{val}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Preview Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-50 rounded-3xl"></div>
            <div className="relative p-5 space-y-3">
              {/* Summary card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-slate-700">
                    Ringkasan Hari Ini
                  </span>
                  <span className="text-xs text-blue-500 font-medium">
                    Lihat Semua →
                  </span>
                </div>
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <CircleProgress value={consumed} max={totalCal} size={96} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-slate-900 leading-none">
                        {remaining}
                      </span>
                      <span className="text-xs text-slate-400">sisa</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[
                      ["Karbohidrat", 68, "#2563eb"],
                      ["Protein", 42, "#3b82f6"],
                      ["Lemak", 35, "#93c5fd"],
                    ].map(([label, pct, color]) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">{label}</span>
                          <span className="font-medium text-slate-700">
                            {pct}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, background: color }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Meals */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-700">
                    Catatan Makan
                  </span>
                  <button className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    +
                  </button>
                </div>
                <div className="space-y-2.5">
                  {MEALS.map((m) => (
                    <div
                      key={m.name}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-slate-600">{m.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-400 rounded-full"
                            style={{ width: `${(m.cal / m.max) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-slate-500 w-20 text-right">
                          {m.cal} / {m.max} kkal
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick add */}
              <div className="bg-blue-600 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold text-sm">
                    Makan Malam
                  </div>
                  <div className="text-blue-200 text-xs mt-0.5">
                    Belum diisi — yuk log sekarang
                  </div>
                </div>
                <button className="bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg">
                  + Tambah
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="cara-kerja" className="bg-slate-50 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
              Cara Kerja
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
              Mulai dalam 3 langkah mudah
            </h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto">
              Tidak perlu hitung manual. Cukup cari, log, dan pantau.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-7 border border-slate-100 card-hover"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-300 tracking-widest">
                    STEP {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY INDONESIA */}
      <section className="py-20 md:py-28 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
              Why Focus on Indonesia
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-5">
              Makanan Indonesia itu unik.
              <br />
              Butuh pendekatan lokal.
            </h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              App kalori global sering gagal mengenali nasi padang, soto betawi,
              atau jajanan pasar. Porsi dan bahan berbeda-beda — app barat tidak
              akurat untuk kita.
            </p>
            <p className="text-slate-500 leading-relaxed mb-8">
              HealthyAI dibangun dari awal untuk masakan Indonesia: dari nasi
              kucing hingga rijsttafel, dari warung Tegal hingga restoran fine
              dining.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["10K+", "Menu lokal terverifikasi"],
                ["3 Sumber", "BPOM, Univ & Restoran"],
                ["98%", "Akurasi pengenalan AI"],
                ["Real-time", "Update database rutin"],
              ].map(([val, label]) => (
                <div
                  key={label}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-100"
                >
                  <div className="text-xl font-bold text-blue-600">{val}</div>
                  <div className="text-xs text-slate-500 mt-1 leading-tight">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white">
            <div className="text-sm font-semibold opacity-70 mb-6 uppercase tracking-wider">
              Real Dataset
            </div>
            <div className="space-y-4">
              {[
                {
                  food: "Nasi Padang (Lengkap)",
                  cal: "650–900 kkal",
                  badge: "Populer",
                },
                { food: "Gado-gado", cal: "280–420 kkal", badge: "Sehat" },
                { food: "Mie Ayam", cal: "400–550 kkal", badge: "Populer" },
                {
                  food: "Tempe Goreng (1 ptg)",
                  cal: "75–90 kkal",
                  badge: "Ringan",
                },
                { food: "Soto Ayam", cal: "200–350 kkal", badge: "Segar" },
                {
                  food: "Gorengan (1 pcs)",
                  cal: "80–150 kkal",
                  badge: "Camilan",
                },
              ].map((item) => (
                <div
                  key={item.food}
                  className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3 backdrop-blur"
                >
                  <div>
                    <div className="font-medium text-sm">{item.food}</div>
                    <div className="text-xs text-blue-200 mt-0.5">
                      {item.cal}
                    </div>
                  </div>
                  <span className="text-xs bg-white/20 rounded-full px-2.5 py-1 font-medium">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="fitur" className="bg-slate-50 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
              Fitur
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
              Semua yang kamu butuhkan
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-7 border border-slate-100 card-hover"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <span className="text-xs font-semibold text-blue-500 bg-blue-50 rounded-full px-2.5 py-1">
                  {f.badge}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-28 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
            Testimoni
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            50.000+ pengguna percaya HealthyAI
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-7 border border-slate-100 card-hover"
            >
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-blue-500 text-sm">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-400">{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="bg-slate-50 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                Blog & Jurnal
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
                Edukasi gizi makanan Indonesia
              </h2>
            </div>
            <a
              href="#"
              className="hidden md:block text-sm text-blue-600 font-medium hover:underline"
            >
              Lihat semua →
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {BLOGS.map((b) => (
              <article
                key={b.title}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 card-hover cursor-pointer"
              >
                <div className="h-40 bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="1.2"
                    className="w-16 h-16 opacity-60"
                  >
                    <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 rounded-full px-2.5 py-1">
                      {b.tag}
                    </span>
                    <span className="text-xs text-slate-400">
                      {b.mins} baca
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="py-20 md:py-28 max-w-3xl mx-auto px-4 sm:px-6"
      >
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Pertanyaan Umum
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-semibold text-slate-800 text-sm pr-4">
                  {f.q}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`w-4 h-4 flex-shrink-0 text-blue-500 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                className={`faq-transition ${openFaq === i ? "faq-open" : ""} px-6`}
              >
                <p className="text-slate-500 text-sm leading-relaxed pb-5">
                  {f.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-blue-600 rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 0%, transparent 60%), radial-gradient(circle at 80% 20%, white 0%, transparent 50%)",
            }}
          ></div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mulai diet realistis hari ini
            </h2>
            <p className="text-blue-200 mb-8 max-w-md mx-auto">
              Tidak perlu skip nasi. Tidak perlu diet ekstrem. Cukup track
              makanan Indonesia favoritmu.
            </p>
            <button className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl text-sm hover:bg-blue-50 transition-colors shadow-lg">
              Start Tracking Now – Free →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                </div>
                <span className="font-bold text-slate-900 text-lg">
                  HealthyAI
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Tracker kalori pertama yang benar-benar fokus pada makanan
                Indonesia. Untuk diet yang realistis dan berkelanjutan.
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Produk
              </div>
              <div className="space-y-2.5">
                {["Fitur", "Database Makanan", "Harga", "Blog"].map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="block text-sm text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Perusahaan
              </div>
              <div className="space-y-2.5">
                {["Tentang Kami", "Karir", "Privasi", "Syarat & Ketentuan"].map(
                  (l) => (
                    <a
                      key={l}
                      href="#"
                      className="block text-sm text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      {l}
                    </a>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              © 2025 HealthyAI. Dibuat dengan ❤️ untuk Indonesia.
            </p>
            <div className="flex items-center gap-4">
              {["Twitter", "Instagram", "TikTok"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-xs text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
