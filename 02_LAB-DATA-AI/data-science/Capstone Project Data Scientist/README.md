# Capstone Project Data Science - Dataset Nutrisi Makanan & Minuman Indonesia

## Deskripsi 
Repository ini berisi proses pengolahan dan pembersihan dataset makanan dan minuman Indonesia yang dilakukan oleh tim Data Scientist sebelum digunakan lebih lanjut oleh tim AI.

Tahapan yang dilakukan meliputi data cleaning, preprocessing, feature engineering, serta penggabungan dataset dengan gambar makanan untuk menghasilkan dataset yang lebih siap digunakan pada proses machine learning maupun pengembangan model AI.

---

## Dataset Source

Dataset utama:
- Dataset Kaggle: https://www.kaggle.com/datasets/anasfikrihanif/indonesian-food-and-drink-nutrition-dataset

---

## Struktur Folder

```text
Capstone Project Data Scientist/
│
├── Dashboard/
│   ├── dashboard.py
│   ├── data_capstone.csv
│   └── logo_tim.jpg
│
├── data_processed/
│   ├── data_clean.csv
│   └── data_capstone_final.csv
│
├── data_raw/
│   └── nutritition.csv
│
├── gambar_makanan/
│   └── kumpulan gambar makanan
│
├── Data Dictionary.md
│
├── main.ipynb
│
└── README.md
```

---

## Fitur Dataset

| Kolom | Deskripsi |
|---|---|
| Nama | Nama makanan |
| Kalori | Jumlah kalori |
| Protein | Kandungan protein |
| Lemak | Kandungan lemak |
| Karbohidrat | Kandungan karbohidrat |
| URL Gambar | URL sumber gambar |
| Total Nutrisi | Total nilai nutrisi |
| Kategori Kalori | Kategori kalori makanan |
| Rasio Protein/Kalori | Rasio protein terhadap kalori |
| Gambar | Path gambar lokal |

---

## Tools dan Library

Project menggunakan:
- Python
- Pandas
- NumPy
- Matplotlib
- Seaborn
- Pillow (PIL)

---

## Catatan

- Sebagian kecil data belum memiliki gambar karena proses pencocokan otomatis tidak menemukan file yang sesuai.
- Seluruh path gambar disimpan pada kolom `Gambar`.
- Folder `gambar_makanan` harus tetap tersedia agar path gambar dapat digunakan dengan benar.

---

## Live Dashboard
Anda dapat mengakses dashboard interaktif proyek ini melalui tautan berikut:
[Dashboard Analisis Nutrisi Makanan & Minuman Indonesia] (https://dashboard-nutrisi-makanan-minuman-indonesia.streamlit.app/)
