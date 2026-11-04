# Shion

Situs restoran Jepang (fiktif) dengan reservasi meja, paket dinner dengan simulasi pembayaran QRIS, permintaan wedding, undangan digital per tamu dengan RSVP dan QR masuk, serta panel admin untuk memantau semuanya. Proyek portofolio.

- `apps/web`: React + Vite + TypeScript
- `supabase/`: skema database, aturan akses (RLS), fungsi RPC, data contoh, jadwal reset demo
- `docs/`: rencana, konten dua bahasa, kredit foto, dan **tutorial setup database**

## Fitur

| Untuk | Fitur |
|---|---|
| Pengunjung | Beranda dua bahasa (ID/EN) dengan animasi scroll, reservasi meja, paket Ume/Take/Matsu dengan layar QRIS simulasi, permintaan wedding |
| Tamu wedding | Undangan pribadi `/w/<slug>?t=<token>`, RSVP (jumlah orang, pantangan, ucapan, persetujuan data), QR masuk |
| Owner & staff | RSVP tamu langsung (ringkasan, rekap dapur, jawaban terbaru), tambah tamu, impor CSV, ubah dan hapus tamu, kirim link via WhatsApp, reservasi per hari, pipeline wedding |
| Usher | Check-in dengan kamera HP (scan QR) atau cari nama, penghitung tamu datang, antrean otomatis saat sinyal hilang |

## Menjalankan secara lokal

```bash
cd apps/web
npm install
npm run dev
```

Tanpa file `.env`, aplikasi berjalan dalam **mode demo**: data contoh disimpan di browser, tidak ada server.

| Halaman | Alamat |
|---|---|
| Beranda + reservasi | `/` |
| Undangan contoh | `/w/rina-dimas?t=demo-tamu-shion` |
| Panel admin | `/admin`, akun demo `owner@shion.demo` atau `usher@shion.demo`, kata sandi `shion-demo` |

Coba buka admin di satu tab dan undangan contoh di tab lain. Setelah tamu mengirim RSVP, daftar di admin ikut berubah tanpa dimuat ulang.

## Menghubungkan database

Ikuti **[docs/SETUP-DATABASE.md](docs/SETUP-DATABASE.md)**: membuat project Supabase, menjalankan migrasi, membuat akun admin, mengisi `.env`, dan deploy ke Vercel.

## Perintah

```bash
npm run dev        # server pengembangan
npm run build      # cek tipe + build produksi ke dist/
npm run typecheck  # cek tipe saja
```

## Catatan

- Animasi scroll beranda memakai CSS scroll-driven animation (Chrome, Edge, Safari 16.2+). Di Firefox halaman tampil lengkap tanpa animasi scroll.
- Pembayaran QRIS hanya simulasi. Tidak ada payment gateway sungguhan.
- Identitas restoran (nama, alamat, kontak) ada di `apps/web/src/config/brand.ts`.

## Kredit

Tampilan dan animasi beranda diadaptasi dari "Florist website template" oleh 8B, lisensi MIT (`apps/web/LICENSE-8B`). Foto berlisensi CC BY 2.0, daftar lengkap di `docs/CREDITS.md`.
