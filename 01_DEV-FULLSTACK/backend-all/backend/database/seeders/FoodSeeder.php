<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Food;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema; // <--- 1. TAMBAHKAN INI DI ATAS

class FoodSeeder extends Seeder
{
    public function run()
    {
        // 2. MATIKAN SEMENTARA PENGECEKAN FOREIGN KEY
        Schema::disableForeignKeyConstraints();

        // Bersihkan tabel sebelum diisi ulang
        Food::truncate(); 

        // 3. NYALAKAN KEMBALI PENGECEKAN FOREIGN KEY
        Schema::enableForeignKeyConstraints();

        $jsonPath = database_path('data/data_capstone.json');
        
        if (!File::exists($jsonPath)) {
            $this->command->error("File JSON tidak ditemukan di: " . $jsonPath);
            return;
        }

        $json = File::get($jsonPath);
        $foods = json_decode($json, true);

        // Daftar 288 makanan yang gambarnya rusak
        $brokenFoods = [
            "Alpukat segar", "Ampas tahu kukus", "Anak sapi daging sedang segar", "Apel malang segar", 
            "Arwan sirsir", "Babi ginjal segar", "Bagea kenari asin", "Batang Tading", "Batatas kelapa ubi segar", 
            "Bayam tumis + oncom", "Bayam tumis bersantan", "Beef burger", "Beef teriyaki masakan", "Bekasang", 
            "Belibis daging segar", "Belutlaut segar", "Bengkuang", "Bentul talas kukus", "Beras ganyong", 
            "Beras giling var rojolele mentah", "Beras jagung kuning kering mentah", "Beras Ketan Hitam tumbuk", 
            "Beras ketan putih tumbuk mentah", "Beras Menir", "Beras Merah tumbuk", "Beras Pecah Kulit", 
            "Beras Siger", "Bihun", "Bihun Goreng", "Bihun Jagung mentah", "Biji Jambu Mete goreng", 
            "Bika Ambon", "Biwah segar", "Bonggol Pisang kering", "Botok lamtoro", "Buah Atung", 
            "Buah kom segar", "Buah Nona", "Buah rotan segar", "Bulung Sangu", "Buncis", "Bungkil Biji Karet", 
            "Buras", "Coklat bubuk", "Combro", "Coto mangkasara kuda masakan", "Cumi-cumi segar", 
            "Daun Gandaria", "Daun kasbi/singkong karet segar", "Daun Katuk", "Daun kenikir segar", "Daun Kumak", 
            "Daun Leunca", "Daun Lobak", "Daun ndusuk segar", "Daun paku segar", "Daun simpur segar", 
            "Daun talas rebus", "Daun talas segar", "Daun Tales rebus", "Daun Ubi Jalar kukus", "Daun ubi tinta segar", 
            "Dendeng belut goreng", "Dideh darah sapi", "Dodol kedondong", "Dodol manado", "Duku", "Duwet segar", 
            "Embacang", "Empal (daging) Goreng masakan", "Emping komak", "Encung asam segar", "Es Mambo", "Es Sirup", 
            "Gado-gado", "Gadung ubi segar", "Gambas lodeh", "Geplak", "Ginjal Babi", "Gula Kelapa", 
            "Gula Merah Tebu belum dimurnikan", "Gulai ikan masakan", "Gulai kambing", "Gulai pliek", "Hati Sapi", 
            "Hofa/Ubi hutan segar", "Ikan asar merah masakan", "Ikan Asin kering", "Ikan bambangan segar", 
            "Ikan banjar segar", "Ikan baronang segar", "Ikan Bekasang", "Ikan Belut Segar goreng", "Ikan Beunteur", 
            "Ikan biawan segar", "Ikan calo/ peda mentah", "Ikan kakatua segar", "Ikan kawalinya segar", "Ikan Layang", 
            "Ikan layur segar", "Ikan Lele goreng", "Ikan Lemuru", "Ikan malalugis segar", "Ikan Mujair goreng", 
            "Ikan Mujair pepes", "Ikan Mujair segar", "Ikan papuyu/ betok segar", "Ikan Pindang selar mentah", 
            "Ikan selar segar", "Ikan sidat segar", "Ikan sunu asin mentah", "Ikan tempahas segar", 
            "Ikan Teri Nasi kering", "Ikan Teri tepung", "Ikan titang segar", "Jagung pipil var. harapan kering", 
            "Jagung Sayur (tumis)", "Jagung titi", "Jali", "Jam selai", "Jambu Air", "Jampang huma mentah", "Jenang", 
            "Jeruk Garut", "Jukku pallu kaloa masakan", "Kacang ercis segar", "Kacang goyang", "Kacang Gude muda", 
            "Kacang hitam kering", "Kacang Kapri muda", "Kacang kedelai segar", "Kacang komak segar", 
            "Kacang kuning kering", "Kacang lebui /iris kering", "Kacang merah segar", "Kacang mete/biji jambu monyet segar", 
            "Kacang sukro", "Kacang Tanah atom", "Kacang tanah sangan tanpa selaput", "Kacang tanah sari", 
            "Kacang urei kering", "Kapurung", "Katul Jagung", "Kecipir biji", "Kelapa Muda daging", 
            "Kelapa Setengah Tua daging", "Kelepon", "Kemang", "Kembang Turi", "Kenari banda kering", 
            "Keripik tempe abadi murni", "Keripik tempe abadi sedang", "Keripik tempe abadi telur", "Keripik ubi", 
            "Kerupuk Aci", "Kerupuk Melinjo mentah", "Kerupuk Melinjo tebal goreng asin", 
            "Kerupuk Melinjo tebal goreng manis", "Kerupuk Melinjo tipis goreng", "Kerupuk Udang berpati", 
            "Ketela singkong segar", "Kluwek", "Kokosan", "Koro andong kering", "Krokot", "Kue jahe", "Kue kelapa", 
            "Kue lumpur", "Kue Pia", "Kue Satu", "Kue sus", "Kue Talam", "Lamtoro var. gung tanpa kulit", "Lapis legit", 
            "Lemak Babi", "Lepok/Ubi rumput", "Leupeut Ketan", "Lokan segar", "Lontar segar", "Lumai/Leunca segar", 
            "Mangga benggala segar", "Mangga Gedong", "Mangga Harum Manis", "Mangga segar", "Martabak mesir", 
            "Martabak Telur", "Melase", "Melinjo", "Mi kering", "Mie Goreng", "Mie kering", "Mie pangsit basah", 
            "Mie Sagu", "Minyak Zaitun", "Nasi beras merah", "Nasi gemuk", "Nasi jagung", "Nasi rames", "Nasi tim", 
            "Nasi Uduk", "Nasu likku masakan", "Noga Kacang Tanah", "Oncom ampas kacang hijau", "Oncom Goreng", 
            "Oncom Hitam Goreng bertepung", "Oncom kacang hijau + singkong", "Oncom Kacang Tanah pepes", 
            "Oncom Merah Goreng bertepung", "Onde-onde", "Papeda", "Parede baleh masakan", "Pati Singkong (tapioka)", 
            "Pelepah manuk masakan", "Pempek kelesan", "Pempek kulit", "Pepea oncom ampas tahu", "Pete Segar", 
            "Pisang Ambon", "Pisang ayam segar", "Pisang kidang segar", "Pisang Lampung", "Pisang talas segar", 
            "Rajungan segar", "Rasbi (Beras Ubi)", "Rasi (Beras Singkong)", "Rawon masakan", "Rebon udang kecil segar", 
            "Renggi goreng", "Risoles", "Rumput laut", "Sagu kasbi segar", "Sagu lempeng", "Salak medan segar", 
            "Sale pisang siam", "Saos Tomat", "Sapi daging dendeng mentah", "Sapi dideh/darah", "Sarimuka", 
            "Sate penyu masakan", "Sawo duren segar", "Sawo kecik segar", "Sayur asem", "Sayur garu", "Sayur kohu-kohu", 
            "Sayur ndusuk", "Selada", "Selada Air rebus", "Serbuk Coklat", "Singkah (rotan muda)", "Singkong Goreng", 
            "Sop Kool", "Soto banjar masakan", "Soto dengan Daging", "Soto kudus masakan", "Soto madura masakan", 
            "Sukiyaki masakan", "Sukun muda segar", "Susu asam untuk bayi bubuk", "Susu Skim (tak berlemak)", 
            "Susu skim segar", "Suweg mentah", "Suweg talas segar", "Talas pontianak segar", "Taoge goreng", 
            "Tauji cap singa", "Tebu Terubuk", "Telur Ayam bagian kuning", "Telur burung puyuh segar", 
            "Tempe koro benguk", "Tepung Garut (arrowroot)", "Tepung Jagung Kuning", "Tepung jagung putih", 
            "Tepung Pisang", "Tepung singkong/ Tapioka", "Tepung Tales Beneng", "Teri balado masakan", "Terong segar", 
            "Tim (nasi tim)", "Tipa-tipa", "Tiwul Instan", "Tomat air (juice) segar", "Tomat Masak", "Tomat merah segar", 
            "Tomat muda segar", "Ubi jalar tinta/ kemayung", "Udang galah segar", "Udang kering", "Ulat sagu panggang"
        ];

        foreach ($foods as $food) {
            $rawName = $food['Nama'] ?? '';
            $cleanName = trim(str_replace('"', '', $rawName));
            $imageUrl = null;

            if (in_array($cleanName, $brokenFoods)) {
                $fileName = Str::slug($cleanName) . '.jpg';
                $imageUrl = '/food_images/' . $fileName;
            } else {
                $imageUrl = $food['URL Gambar'] ?? null;
            }

            Food::create([
                'name'     => $cleanName,
                'calories' => (float) ($food['Kalori'] ?? 0),
                'protein'  => (float) ($food['Protein'] ?? 0),
                'fat'      => (float) ($food['Lemak'] ?? 0),
                'carbs'    => (float) ($food['Karbohidrat'] ?? 0),
                'image_url'=> $imageUrl,
            ]);
        }
    }
}