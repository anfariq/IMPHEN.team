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
    title: "Analitik Progres Akurat",
    desc: "Pantau surplus atau defisit kalori Anda dengan riwayat aktivitas mingguan yang divisualisasikan dengan rapi dan mudah dipahami.",
    badge: "Analytics",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        {/* Ikon Grafik Garis Naik (Melambangkan peningkatan dan analitik) */}
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
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
  {
    name: "Fajri M.",
    city: "Yogyakarta",
    text: "Biasanya susah cari kalori Gudeg di app luar. Di sini lengkap dari krecek sampai arehnya!",
    avatar: "FM",
  },
  {
    name: "Siti K.",
    city: "Makassar",
    text: "Membantu banget buat pantau kalori Coto Makassar kesukaan. Diet tapi tetap bisa makan enak.",
    avatar: "SK",
  },
  {
    name: "Andi R.",
    city: "Medan",
    text: "Interface-nya bersih dan ringan. Gak bikin HP panas pas lagi input menu sarapan.",
    avatar: "AR",
  },
  {
    name: "Maya T.",
    city: "Semarang",
    text: "Gorengan-nya detail banget, dari bakwan sampai mendoan ada. Jadi tahu batas makannya.",
    avatar: "MT",
  },
  {
    name: "Hendra W.",
    city: "Denpasar",
    text: "Fitur riwayat aktivitas mingguannya juara! Bisa langsung lihat perbandingan kalori konsumsi dan olahraga dengan sangat rapi.",
    avatar: "HW",
  },
  {
    name: "Laras P.",
    city: "Malang",
    text: "Dosen saya sampai kaget saya bisa diet tapi tetap makan Bakso Malang tiap hari. Rahasianya ya di-track!",
    avatar: "LP",
  },
  {
    name: "Rizky D.",
    city: "Palembang",
    text: "Pempek kapal selam favorit saya ada di sini. Akhirnya bisa diet tanpa musuhan sama makanan lokal.",
    avatar: "RD",
  },
];

export const FAQS = [
  {
    q: "Apakah data kalori makanan Indonesia akurat?",
    a: "Ya. Dataset kami dikurasi dari data gizi BPOM, penelitian universitas, dan nutrisi restoran lokal. Kami akan terus melakukan update secara berkala.",
  },
  {
    q: "Bagaimana cara aplikasi menghitung target kalori saya?",
    a: "Sistem kami secara otomatis menghitung kebutuhan kalori harian Anda berdasarkan metrik tubuh (berat, tinggi, usia, gender) dan tingkat aktivitas yang Anda atur di halaman Profil.",
  },
  {
    q: "Apakah aplikasinya gratis?",
    a: "Fitur utama seperti pencatatan makanan, olahraga, dan riwayat aktivitas mingguan sepenuhnya gratis untuk digunakan.",
  },
  {
    q: "Bagaimana cara menghitung kalori masakan rumahan?",
    a: "Cukup ketik nama masakan atau bahan-bahannya di pencarian. Sistem kami akan memberikan estimasi kalori berdasarkan standar porsi makanan umum di Indonesia.",
  },
];

export const BLOGS = [
  {
    tag: "Nutrisi",
    title: "Berapa Kalori Nasi Padang Sebenarnya?",
    desc: "Breakdown lengkap kalori rendang, gulai, dan sayur nangka dalam satu porsi.",
    mins: "4 min",
    image: "https://rricoid-assets.obs.ap-southeast-4.myhuaweicloud.com/berita/Palangkaraya/o/1745972783410-IMG_2765_jpg/ceuz3r5in0zrxp3.webp",
    content: "Nasi Padang seringkali dianggap 'musuh' bagi orang yang sedang berdiet. Padahal, kuncinya bukan pada menunya, tapi pada porsi dan pilihan lauknya. Satu porsi nasi padang lengkap bisa mencapai 800-1000 kkal. Komponen terbesar biasanya berasal dari nasi putih (sekitar 200 kkal), Rendang Daging (190 kkal per potong), dan Gulai Daun Singkong yang santannya pekat (sekitar 100 kkal). Tips dari HealthyAI: Mintalah kuah santan dipisah atau dikurangi, dan perbanyak porsi sayur nangka tanpa kuah berlebih untuk menekan asupan lemak jenuh."
  },
  {
    tag: "Tips Diet",
    title: "Gorengan & Diet: Bisa Tetap Makan Dengan Bijak",
    desc: "Cara menikmati gorengan favorit tanpa merusak progress diet Anda.",
    mins: "3 min",
    image: "https://cdn0-production-images-kly.akamaized.net/u5B4WzGlgXDauFGKRmii9tm0IIY=/1x61:1000x624/1200x675/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/4300389/original/060560700_1674522690-shutterstock_1893335917.jpg",
    content: "Gorengan adalah bagian tak terpisahkan dari budaya makan kita. Kabar baiknya, Anda tidak perlu 100% berhenti makan gorengan. Satu buah bakwan goreng rata-rata mengandung 130-150 kkal, sebagian besar berasal dari minyak goreng yang diserap tepung. Jika Anda ingin makan gorengan saat diet, cobalah teknik 'Saving Calories'. Jika Anda tahu sore nanti akan makan mendoan, kurangi porsi lemak pada makan siang Anda. Selain itu, selalu gunakan tisu penyerap minyak sebelum menyantapnya. Ingat, diet adalah tentang keseimbangan jangka panjang, bukan penyiksaan diri."
  },
  {
    tag: "Gaya Hidup",
    title: "Menu Sehat dari Warung Pinggir Jalan",
    desc: "Panduan memilih makanan bergizi dari warung makan sehari-hari.",
    mins: "5 min",
    image: "https://shopee.co.id/inspirasi-shopee/wp-content/uploads/2019/02/Food_at_Warung_Tegal.jpg",
    content: "Warung Tegal atau Warteg sebenarnya adalah surga bagi pelaku diet jika tahu cara memilihnya. Berbeda dengan junk food, Warteg menyediakan sayuran segar seperti tumis kangkung, buncis, dan tauge yang dimasak harian. Untuk protein yang sehat dan murah, pilihlah tempe orek, telur balado, atau ikan kembung. Hindari menu yang digoreng garing (deep fried) dan usahakan setengah piring Anda diisi oleh sayuran. Dengan modal 15-20 ribu rupiah saja, Anda sudah bisa mendapatkan makanan dengan makronutrisi yang lengkap dan seimbang."
  },
];