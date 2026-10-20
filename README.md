# Klon beranda BCA

Beranda lokal dari [bca-homepage-revamp.vercel.app](https://bca-homepage-revamp.vercel.app/), ditempatkan dalam proyek yang dibuat dari `ai-website-cloner-template`. Cakupan yang disepakati adalah **beranda dan interaksinya**. Tautan ke halaman internal yang tidak termasuk cakupan diarahkan ke situs sumber.

Tag `baseline-2026-10-20` menyimpan versi awal ini. Pembaruan berikutnya dapat dibuat pada cabang terpisah tanpa mengubah tag tersebut.

## Jalankan

```bash
npm run check
npm run start
```

Buka [http://localhost:3001/](http://localhost:3001/). Port dapat diubah dengan `PORT=... npm run start`.

## Isi proyek

- `docs/research/bca-homepage/source.html`: HTML beranda yang diambil dari URL sumber pada 20 Oktober 2026.
- `mirror/_next/static`: CSS, font, dan JavaScript publik yang dirujuk beranda, termasuk chunk yang dimuat saat berinteraksi.
- `public/assets`: gambar dan ikon publik yang digunakan beranda.
- `mirror/server.mjs`: server lokal untuk beranda dan berkas statis. Aset yang belum ada secara lokal diarahkan ke URL sumber.
- `scripts/fetch-source-runtime.py`, `scripts/fetch-homepage-assets.py`: skrip untuk memperbarui aset publik jika sumber berubah.

`npm run check` memverifikasi HTML dan berkas statis yang diperlukan. Ini adalah snapshot situs sumber, sehingga kode JavaScript yang diunduh mengikuti build publiknya dan tidak sepraktis komponen React untuk diubah. Saat situs sumber menerbitkan build baru, snapshot perlu diperbarui agar tampilannya tetap sama.

Berkas `src/` dari percobaan rekonstruksi sebelumnya masih tersimpan di proyek, tetapi tidak dipakai oleh `npm run start` dan tidak ditampilkan di port 3001.

Lisensi MIT di `docs/template-LICENSE` hanya berasal dari template JCodesMore. Berkas dan aset dari situs BCA tidak mendapat lisensi MIT melalui proyek ini.
