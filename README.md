# BCA website revamp prototype

Prototipe lokal untuk beranda BCA yang ditingkatkan dan alur kartu kredit. Halaman yang saling terhubung:

- `/` — beranda BCA
- `/kartu-kredit` — landing page kartu kredit
- `/kartu-kredit/krisflyer-visa-signature` — detail kartu BCA Singapore Airlines KrisFlyer Visa Signature
- `/kartu-kredit/bandingkan?cards=1,2` — perbandingan dua kartu yang dipilih

Kartu kredit pada beranda membuka landing page. Kartu pertama pada landing page membuka detailnya; pilihan **Bandingkan** membuka halaman perbandingan. Tautan di luar cakupan prototipe dapat mengarah ke situs BCA atau sumber referensi.

## Menjalankan secara lokal

Gunakan Node.js 24 atau lebih baru.

```bash
npm ci
npm run check
npm run dev
```

Buka [http://localhost:3001/](http://localhost:3001/). Gunakan `PORT=3002 npm run dev` jika port 3001 sedang dipakai. `npm run start` menjalankan server tanpa mode watch.

## Struktur

- `mirror/server.mjs` menyajikan keempat rute dan aset lokal.
- `mirror/credit-card-*.mjs` dan `.css` berisi halaman kartu kredit, komponen, dan interaksinya.
- `mirror/*-improvements.*` berisi penyesuaian beranda.
- `public/assets/kartu-kredit/` berisi aset halaman kartu kredit.
- `docs/research/bca-homepage/source.html` dan `mirror/_next/static/` menyimpan snapshot beranda sumber.

Server menggunakan Node.js. GitHub Pages hanya menyajikan berkas statis, jadi publikasi melalui Pages memerlukan tahap ekspor statis dan penyesuaian path sebelum diaktifkan. Repository ini belum mengaktifkan GitHub Pages.

Ini adalah prototipe tidak resmi. Aset dan konten BCA tidak diberikan lisensi terbuka melalui repository ini; lisensi MIT di `docs/template-LICENSE` hanya milik template asal.
