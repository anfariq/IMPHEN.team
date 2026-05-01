**Deskripsi:**

Dataset ini berisi informasi tentang kandungan gizi (makronutrien dan kalori) dari berbagai makanan dan minuman Indonesia. Data disajikan berdasarkan takaran saji per 100 gram.

1. Kolom Original (setelah pembersihan data)

| Nama Kolom | Tipe Data | Deskripsi | Contoh Nilai |
|:---------:|:---------:|:---------:|:---------:|
| Nama | String | Nama unik dari makanan atau minuman Indonesia. | "Abon", "Agar-agar", "Nasi Goreng" |
| Kalori | Float | Jumlah energi yang terkandung dalam 100 gram makanan/minuman, diukur dalam kilokalori (kkal). | 280.0, 45.0, 0.0, 625.0 |
| Protein | Float | Kandungan protein dalam 100 gram makanan/minuman, diukur dalam gram (g). | 9.2, 1.1, 0.0, 34.2 |
| Lemak | Float | Kandungan lemak dalam 100 gram makanan/minuman, diukur dalam gram (g). | 28.4, 0.4, 0.2, 16.8 |
| Karbohidrat | Float | Kandungan karbohidrat  dalam 100 gram makanan/minuman, diukur dalam gram (g). | 0.0, 10.8, 3.8, 87.4 |
| URL Gambar | String | Tautan (URL) menuju gambar dari makanan/minuman tersebut. | "https://img-global.cpcdn.com/recipes/cbf330fbd1ba6316/1200x630cq70/photo.jpg" |

2. Kolom Lanjutan

| Nama Kolom | Tipe Data | Deskripsi | Contoh Nilai |
|:---------:|:---------:|:---------:|:---------:|
| Total Nutrisi | Float | Total keseluruhan kandungan makronutrien (Protein + Lemak + Karbohidrat) dalam 100 gram makanan yang digunakan untuk mengukur kepadatan nutrisi total secara umum. | 0.2, 12.3, 23.4, 98.1 |

3. Variabel dalam Analisis

| Nama Variabel | Deskripsi | Rumus/Metode |
|:---------:|:---------:|:---------:|
| Total Nutrisi | Total keseluruhan kandungan makronutrien (Protein + Lemak + Karbohidrat) dalam 100 gram makanan yang digunakan untuk mengukur kepadatan nutrisi total secara umum. | Protein + Lemak + Karbohidrat |
| Protein Efficiency | Rasio untuk mengevaluasi efisiensi protein. Nilai yang lebih tinggi menunjukkan makanan lebih efisien dalam menyediakan protein per kalori. | Protein/Kalori |