const fs = require('fs');
const path = require('path');

function copyFoundImages() {
  const txtPath = 'catatan_gagal.txt';
  const targetFolder = './images_pub';
  
  // Kita cek di dua folder ini biar aman
  const sourceFolders = ['./gambar_makanan_hilang'];

  // 1. Buat folder images_pub kalau belum ada
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
    console.log(`📁 Folder '${targetFolder}' berhasil dibuat!`);
  }

  // 2. Baca file catatan_gagal.txt
  if (!fs.existsSync(txtPath)) {
    console.log(`❌ File ${txtPath} tidak ditemukan.`);
    return;
  }

  const textData = fs.readFileSync(txtPath, 'utf-8');
  const lines = textData.split('\n');
  
  // 3. Ekstrak nama makanan dari teks log
  const foodsToCheck = [];
  lines.forEach(line => {
    const match = line.match(/^\d+\.\s*(.*?)\s*-/);
    if (match && match[1]) {
      foodsToCheck.push(match[1].trim());
    }
  });

  if (foodsToCheck.length === 0) {
    console.log('Tidak ada nama makanan di dalam catatan_gagal.txt.');
    return;
  }

  console.log(`🚀 Mulai mengecek ${foodsToCheck.length} gambar untuk dicopy ke 'images_pub'...`);

  let foundCount = 0;
  let missingCount = 0;
  
  // Kemungkinan ekstensi gambar
  const extensions = ['.jpg', '.png', '.jpeg', '.webp'];

  // 4. Proses pencarian dan copy
  for (const rawName of foodsToCheck) {
    const safeName = rawName.trim().replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    let isFound = false;

    // Cek di masing-masing folder sumber
    for (const folder of sourceFolders) {
      if (!fs.existsSync(folder)) continue;

      // Cek untuk setiap ekstensi
      for (const ext of extensions) {
        const fileName = `${safeName}${ext}`;
        const sourcePath = path.join(folder, fileName);
        const targetPath = path.join(targetFolder, fileName);

        if (fs.existsSync(sourcePath)) {
          // Kalau file-nya ada, copy filenya!
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`✅ [KETEMU] ${fileName} (Dicopy dari ${folder})`);
          isFound = true;
          foundCount++;
          break; // Stop cari ekstensi lain kalau udah ketemu
        }
      }
      
      if (isFound) break; // Stop cari di folder sumber lain kalau udah ketemu
    }

    // Kalau muter-muter tetep ga ketemu
    if (!isFound) {
      console.log(`❌ [KOSONG] Gambar '${safeName}' tidak ditemukan di folder manapun.`);
      missingCount++;
    }
  }

  console.log(`\n=== 🎉 PROSES COPY SELESAI 🎉 ===`);
  console.log(`✅ Gambar yang berhasil dicopy : ${foundCount}`);
  console.log(`❌ Gambar yang masih ga ada    : ${missingCount}`);
  console.log(`Semua gambar yang valid udah ngumpul di folder '${targetFolder}' siap dipakai!`);
}

copyFoundImages();