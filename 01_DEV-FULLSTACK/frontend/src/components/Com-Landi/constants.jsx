export const NAV_LINKS = ["Fitur", "Cara Kerja", "Blog", "FAQ"];

export const MEALS = [
  { name: "Sarapan", cal: 420, max: 600 },
  { name: "Makan Siang", cal: 680, max: 800 },
  { name: "Makan Malam", cal: 0, max: 600 },
];

export const HOW_IT_WORKS = [
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

export const FEATURES = [
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

export const TESTIMONIALS = [
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

export const FAQS = [
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

export const BLOGS = [
  {
    tag: "Nutrisi",
    title: "Berapa Kalori Nasi Padang Sebenarnya?",
    desc: "Breakdown lengkap kalori rendang, gulai, dan sayur nangka dalam satu porsi.",
    mins: "4 min",
    image: "https://rricoid-assets.obs.ap-southeast-4.myhuaweicloud.com/berita/Palangkaraya/o/1745972783410-IMG_2765_jpg/ceuz3r5in0zrxp3.webp",
  },
  {
    tag: "Tips Diet",
    title: "Gorengan & Diet: Bisa Tetap Makan Dengan Bijak",
    desc: "Cara menikmati gorengan favorit tanpa merusak progress diet Anda.",
    mins: "3 min",
    image: "https://cdn0-production-images-kly.akamaized.net/u5B4WzGlgXDauFGKRmii9tm0IIY=/1x61:1000x624/1200x675/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/4300389/original/060560700_1674522690-shutterstock_1893335917.jpg",
  },
  {
    tag: "Gaya Hidup",
    title: "Menu Sehat dari Warung Pinggir Jalan",
    desc: "Panduan memilih makanan bergizi dari warung makan sehari-hari.",
    mins: "5 min",
    image: "https://shopee.co.id/inspirasi-shopee/wp-content/uploads/2019/02/Food_at_Warung_Tegal.jpg",
  },
];
