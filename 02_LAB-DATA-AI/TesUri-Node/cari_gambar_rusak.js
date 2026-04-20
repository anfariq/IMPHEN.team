const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function scrapeGoogleImagesGacor() {
  const txtPath = 'catatan_gagal.txt';
  const downloadFolder = './gambar_makanan_hilang';

  if (!fs.existsSync(downloadFolder)) {
    fs.mkdirSync(downloadFolder);
  }

  if (!fs.existsSync(txtPath)) {
    console.log('File catatan_gagal.txt tidak ditemukan. Udah beres semua bos!');
    return;
  }

  const textData = fs.readFileSync(txtPath, 'utf-8');
  const lines = textData.split('\n');
  
  const foodsToSearch = [];
  lines.forEach(line => {
    const match = line.match(/^\d+\.\s*(.*?)\s*-/);
    if (match && match[1]) {
      foodsToSearch.push(match[1].trim());
    }
  });

  if (foodsToSearch.length === 0) {
    console.log('Tidak ada nama makanan yang perlu dicari.');
    return;
  }

  console.log(`🚀 [MODE GACOR] Siap berburu ${foodsToSearch.length} Real Food...`);

  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'] 
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  let successCount = 0;
  let stillFailed = []; 

  for (let i = 0; i < foodsToSearch.length; i++) {
    const rawName = foodsToSearch[i];
    const safeName = rawName.trim().replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const filePath = path.join(downloadFolder, `${safeName}.jpg`);

    console.log(`🔍 Berburu: ${rawName}...`);

    try {
      // LOGIKA GACOR 1: Jangan pakai kutip ketat, tambahkan sinonim biar Google paham konteksnya
      const query = encodeURIComponent(`${rawName} (daging OR mentah OR makanan OR pasar)`);
      
      // LOGIKA GACOR 2: tbs=itp:photo (Hanya Foto Jepretan Asli)
      const searchUrl = `https://www.google.com/search?tbm=isch&q=${query}&tbs=itp:photo`;

      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

      // Tunggu selector grid utama Google Images muncul
      await page.waitForSelector('#islrg', { timeout: 5000 }).catch(() => {});
      
      // Kasih jeda render sejenak
      await new Promise(r => setTimeout(r, 1000));

      const imgSrc = await page.evaluate(() => {
        // Fokus cari di dalam grid hasil pencarian (mencegah salah ambil gambar profil/logo)
        const grid = document.querySelector('#islrg') || document.body;
        const imgs = Array.from(grid.querySelectorAll('img'));
        
        // Cari gambar yang benar-benar tampil besar
        const validImg = imgs.find(img => {
          const src = img.src || img.getAttribute('data-src') || '';
          const rect = img.getBoundingClientRect(); // Cek ukuran asli yang dirender di layar
          
          return src.length > 50 && rect.width > 90 && !src.includes('logo');
        });

        return validImg ? (validImg.src || validImg.getAttribute('data-src')) : null;
      });

      if (!imgSrc) {
        console.log(`   ❌ [GAGAL] Google nyerah, foto nggak ketemu.`);
        stillFailed.push(`${rawName} - Tidak ditemukan foto aslinya`);
        continue;
      }

      // Proses Download
      if (imgSrc.startsWith('data:image')) {
        const base64Data = imgSrc.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(filePath, buffer);
        console.log(`   ✅ [SUKSES HD] ${safeName}.jpg`);
        successCount++;
      } else if (imgSrc.startsWith('http')) {
        const res = await fetch(imgSrc);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filePath, buffer);
        console.log(`   ✅ [SUKSES HD] ${safeName}.jpg`);
        successCount++;
      }

    } catch (error) {
      console.log(`   ❌ [GAGAL] Jaringan nyangkut: ${error.message}`);
      stillFailed.push(`${rawName} - Timeout`);
    }

    // Jeda 2 detik agar tidak dikira nge-DDOS Google
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  await browser.close();
  
  if (stillFailed.length > 0) {
    let txtContent = "Daftar Makanan yang BENAR-BENAR KOSONG FOTONYA DI GOOGLE:\n\n";
    stillFailed.forEach((log, index) => {
      txtContent += `${index + 1}. ${log}\n`;
    });
    fs.writeFileSync('gambar_rusak_part2.txt', txtContent);
  }

  console.log(`\n=== 🎉 SCRAPING GACOR SELESAI 🎉 ===`);
  console.log(`Berhasil menyelamatkan: ${successCount} gambar.`);
}

scrapeGoogleImagesGacor();