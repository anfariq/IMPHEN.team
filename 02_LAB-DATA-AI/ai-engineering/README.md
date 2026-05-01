# Kalories AI Engineer Model

Project ini merupakan implementasi model Artificial Intelligence untuk memprediksi jumlah kalori makanan Indonesia berdasarkan kandungan nutrisi.

Project ini dibuat untuk memenuhi task **Artificial Intelligence - AI Engineer**, dengan fokus pada pengembangan model Deep Learning, custom component, model export, inference, dan beberapa pengembangan tambahan melalui Side Quest.

---

## 1. Business Problem

Aplikasi membutuhkan fitur estimasi kalori makanan berdasarkan kandungan nutrisi.

Model AI ini dibuat untuk membantu memprediksi jumlah kalori makanan per 100 gram berdasarkan beberapa fitur nutrisi, yaitu:

- Protein
- Lemak
- Karbohidrat
- Total Nutrisi

Selain itu, model juga dapat digunakan untuk menghitung estimasi kalori berdasarkan ukuran porsi makanan yang dimasukkan oleh pengguna.

---

## 2. Dataset

Dataset utama yang digunakan adalah:

- `data_capstone.csv`

Dataset ini berisi informasi makanan/minuman Indonesia beserta kandungan nutrisinya per 100 gram.

File pendukung:

- `data_capstone.json`  
  Digunakan sebagai format data yang dapat dipakai oleh sistem aplikasi.

- `Data Dictionary.md`  
  Digunakan sebagai dokumentasi kolom dataset.

- `nutrition.csv`  
  Dataset awal / raw dataset.

- `train_data.csv` dan `test_data.csv`  
  Dataset tambahan hasil pemisahan data.

---

## 3. Input dan Target Model

### Input Model

Model menggunakan fitur:

| Fitur | Deskripsi |
|---|---|
| Protein | Kandungan protein makanan per 100 gram |
| Lemak | Kandungan lemak makanan per 100 gram |
| Karbohidrat | Kandungan karbohidrat makanan per 100 gram |
| Total Nutrisi | Total dari Protein, Lemak, dan Karbohidrat |

### Target Model

Target yang diprediksi adalah:

| Target | Deskripsi |
|---|---|
| Kalori | Jumlah kalori makanan per 100 gram |

---

## 4. Main Quest

Project ini memenuhi Main Quest AI Engineer sebagai berikut:

| Checklist | Implementasi | Status |
|---|---|---|
| Membangun model Deep Learning menggunakan TensorFlow Functional API / Model Subclassing | Model dibuat menggunakan TensorFlow Functional API | Terpenuhi |
| Model disesuaikan dengan dataset dan problem bisnis | Model memprediksi kalori makanan berdasarkan data nutrisi | Terpenuhi |
| Mengimplementasikan custom component | Menggunakan Custom Layer dan Custom Callback | Terpenuhi |
| Menyimpan dan mengekspor model dalam format TensorFlow siap produksi | Model diekspor ke `.keras` dan SavedModel | Terpenuhi |
| Membuat kode inference sederhana | Fungsi inference dibuat untuk prediksi kalori berdasarkan input nutrisi | Terpenuhi |

---

## 5. Model Architecture

Model dibangun menggunakan **TensorFlow Functional API**.

Arsitektur model:

1. Input Layer  
   Menerima input berupa Protein, Lemak, Karbohidrat, dan Total Nutrisi.

2. Custom MacroCalorieFeatureLayer  
   Menambahkan fitur tambahan berdasarkan rumus estimasi kalori makronutrien:

   ```text
   Protein * 4 + Lemak * 9 + Karbohidrat * 4
