# Shion — Rencana Proyek

Web restoran Jepang premium (restoran dummy **Shion**) dengan reservasi meja, paket dinner, dan reservasi wedding lengkap dengan undangan digital, RSVP tamu, serta QR check-in.

Status: rencana disetujui, belum ada kode. Dokumen ini jadi acuan selama 3 minggu pengerjaan.

---

## 1. Tujuan dan ukuran sukses

**Tujuan utama:** proyek portofolio yang terasa premium, dan siap diadaptasi untuk satu restoran nyata kalau ada pembeli.

**Sukses berarti** pengunjung portofolio (calon klien atau recruiter) bisa melakukan semua ini sendiri dalam beberapa menit, tanpa dipandu:

1. Membuka web Shion dan langsung merasakan kesan premium.
2. Reservasi meja biasa dan mendapat kode konfirmasi.
3. Memesan paket dinner (Ume / Take / Matsu) dengan simulasi pembayaran.
4. Mengajukan inquiry wedding.
5. Membuka undangan contoh, mengisi RSVP, dan melihat QR muncul.
6. Masuk sebagai owner atau usher lewat satu klik, melihat data tadi masuk, dan scan QR dari HP.

## 2. Scope

### Masuk scope

- Situs publik: beranda, cerita, menu, paket dinner, halaman Private Events & Weddings, galeri, lokasi dan kontak.
- Bahasa Indonesia dan Inggris dengan tombol ganti bahasa.
- Satu form reservasi untuk meja biasa dan paket dinner (dibedakan dengan field `type`).
- Simulasi pembayaran bergaya QRIS untuk paket dinner.
- Inquiry wedding, lalu pipeline status di admin.
- Undangan digital per tamu, RSVP, dan QR check-in untuk wedding yang sudah dikonfirmasi.
- Admin dashboard dengan role `owner`, `staff`, `usher`.
- Mode demo: data contoh, tombol "Lihat sebagai…", banner demo, reset data otomatis.

### Di luar scope

- Payment gateway nyata.
- Multi-tenant / SaaS.
- WhatsApp blast otomatis (cukup tombol "Bagikan ke WhatsApp" dengan link siap kirim).
- Seating chart drag-and-drop (cukup isi nomor meja).
- Aplikasi mobile native.
- Pesan antar / delivery dan pemesanan makanan online.
- Backend terpisah (NestJS dibatalkan, lihat bagian 3).

## 3. Keputusan arsitektur

| Keputusan | Pilihan | Alasan |
|---|---|---|
| Frontend | React + Vite + TypeScript (SPA) | Sesuai preferensi, build cepat |
| Backend | Supabase saja (Postgres, Auth, RLS, RPC, Edge Functions, Realtime, Storage) | Satu backend untuk developer solo. Tanpa cold start server gratisan. Hemat sekitar 4 hari boilerplate |
| NestJS | Tidak dipakai | Hasil review council. Bisa ditambahkan nanti kalau pembeli butuh integrasi khusus |
| Hosting frontend | Vercel (atau Netlify) | Gratis, CDN, mendukung serverless function untuk OG preview |
| Akses tamu | Tanpa login, lewat token undangan | Tamu wedding tidak boleh dipaksa membuat akun |
| Branding | File `config/brand.ts` + tabel `settings` | Nama, warna, logo, kontak mudah diganti untuk pembeli |

### Library frontend

- Routing: `react-router-dom`
- Data: `@supabase/supabase-js`, `@tanstack/react-query`
- Form: `react-hook-form` + `zod`
- Styling: Tailwind CSS, `shadcn/ui` untuk admin
- Motion: `framer-motion`
- i18n: `react-i18next`
- QR: `qrcode.react` (tampil), `@zxing/browser` atau `html5-qrcode` (scan). Kalau web club sudah punya scanner yang jalan, pakai ulang itu.

### Struktur repo

```
shion/
  apps/web/                # React + Vite
    src/
      app/                 # router, providers
      config/brand.ts      # branding yang bisa diganti
      features/
        public/            # beranda, menu, paket, wedding page
        reservation/       # form reservasi + status
        invitation/        # undangan tamu + RSVP + QR
        admin/             # dashboard, reservasi, wedding, menu
        checkin/           # scanner usher + counter live
        demo/              # banner, "Lihat sebagai…"
      i18n/{id,en}.json
      lib/supabase.ts
  supabase/
    migrations/            # skema, RLS, RPC
    seed.sql               # data demo
    functions/
      og-invitation/       # OG image/meta untuk link undangan
      reset-demo/          # dipanggil terjadwal
  docs/
    PLAN.md
    CONTENT.md             # konten ID/EN, menu, harga
```

## 4. Model data

Teks yang bilingual disimpan sebagai `jsonb` dengan bentuk `{ "id": "...", "en": "..." }`.

- **profiles**: `id` (ref `auth.users`), `role` (`owner` | `staff` | `usher`), `display_name`, `is_demo`.
- **settings**: satu baris: jam buka, kapasitas per slot, durasi slot, kontak, alamat, koordinat peta, kebijakan no-show.
- **menu_categories**: `id`, `name` (jsonb), `sort`.
- **menu_items**: `id`, `category_id`, `name`, `description` (jsonb), `price`, `image_url`, flag `contains_pork`, `contains_alcohol`, `contains_raw`, `vegetarian`, `spicy`, `available`, `sort`.
- **dinner_packages**: `id`, `code` (`ume` | `take` | `matsu`), `name`, `tagline`, `courses` (jsonb list), `price_per_pax`, `min_pax`, `max_pax`, `active`.
- **reservations**: `id`, `code` (contoh `SHN-4821`), `type` (`table` | `dinner_package`), `package_id` (nullable), `date`, `time`, `pax`, `guest_name`, `phone`, `email`, `dietary_notes`, `notes`, `status` (`pending` | `confirmed` | `seated` | `completed` | `cancelled` | `no_show`), `payment_status` (`none` | `pending` | `paid_simulated`), `created_at`, `is_demo`.
- **weddings**: `id`, `code`, `couple_name_1`, `couple_name_2`, `contact_name`, `phone`, `email`, `event_date`, `session` (`lunch` | `dinner`), `guest_estimate`, `status` (`inquiry` | `consultation` | `confirmed` | `completed` | `cancelled`), `slug`, `invitation` (jsonb: judul, cerita, jadwal acara, dress code, foto, tema), `created_at`, `is_demo`.
  - Partial unique index pada `(event_date, session)` untuk status `confirmed`. Ini mencegah double booking di level DB.
- **guests**: `id`, `wedding_id`, `name`, `phone`, `group_label` (keluarga / teman / kantor), `max_pax`, `token` (acak, minimal 128 bit, base64url), `rsvp_status` (`pending` | `attending` | `declined`), `rsvp_pax`, `dietary`, `message`, `responded_at`, `table_no`, `checked_in_at`, `checked_in_by`, `checked_in_pax`, `consent_at`.

### Akses dan keamanan (RLS + RPC)

- Pengunjung publik **tidak** punya akses langsung ke tabel. Mereka hanya memanggil RPC `security definer`:
  - `create_reservation(payload)`: validasi input di SQL, cek kapasitas slot, buat `code`.
  - `get_reservation(code, phone)`: cek status reservasi.
  - `simulate_payment(code)`: ubah `payment_status` menjadi `paid_simulated`.
  - `create_wedding_inquiry(payload)`.
  - `get_invitation(slug, token)`: hanya mengembalikan data undangan dan data tamu pemilik token.
  - `submit_rsvp(token, status, pax, dietary, message, consent)`: `pax` tidak boleh melebihi `max_pax`.
- Staff dan owner memakai Supabase Auth. RLS mengizinkan baca/tulis sesuai role.
- Usher hanya bisa membaca daftar tamu wedding dan memanggil `check_in(token, pax)`:
  - Update atomik `where checked_in_at is null`. Scan kedua mengembalikan "sudah check-in pukul HH:MM".
- QR berisi token tamu. Token tidak pernah memakai ID database. Validasi selalu di server.
- Rate limit sederhana pada RPC publik (per IP lewat Edge Function, atau batas per nomor HP per hari).

## 5. Alur utama

### 5.1 Reservasi meja / paket dinner

1. Pengunjung pilih jenis: meja biasa atau paket dinner.
2. Kalau paket: pilih Ume / Take / Matsu. Setiap kartu menampilkan harga per orang, jumlah course, dan deskripsi satu baris.
3. Isi tanggal, jam, jumlah orang, nama, HP, email, catatan diet.
4. Sistem cek kapasitas slot, lalu buat kode `SHN-XXXX`.
5. Paket dinner: layar simulasi QRIS, klik "Saya sudah bayar (demo)", status menjadi `paid_simulated`.
6. Halaman konfirmasi menampilkan kode, ringkasan, tombol tambah ke kalender, dan tombol WhatsApp ke restoran.

### 5.2 Wedding

1. Halaman Private Events & Weddings: cerita, kapasitas buyout, contoh menu, foto, FAQ.
2. Form inquiry: nama pasangan, tanggal, sesi, perkiraan tamu, kontak.
3. Admin memindahkan status: `inquiry` → `consultation` → `confirmed`.
4. Setelah `confirmed`: admin mengisi konten undangan dan daftar tamu (manual atau import CSV).
5. Setiap tamu dapat link pribadi `/w/{slug}?t={token}`. Ada tombol "Salin link" dan "Bagikan ke WhatsApp" dengan teks siap kirim.
6. Tamu membuka undangan, lalu mengisi RSVP (hadir / tidak, jumlah orang, diet, ucapan, persetujuan data).
7. Kalau hadir, QR muncul di bagian bawah undangan.
8. Hari H: usher scan QR. Layar menampilkan nama, jumlah pax, nomor meja, catatan diet. Fallback: cari nama, lalu tap "Check-in".
9. Owner melihat counter "hadir / RSVP" secara live (Supabase Realtime).
10. Admin melihat rekap diet untuk dapur (berapa vegetarian, tanpa babi, tanpa alkohol, alergi).

### 5.3 Mode demo

- Halaman `/demo` dengan tiga tombol: **Lihat sebagai tamu**, **Lihat sebagai usher**, **Lihat sebagai owner**. Tombol login otomatis ke akun demo.
- Wedding contoh **"Rina & Dimas"** sudah tersedia, dengan tamu di setiap status: belum RSVP, hadir, tidak hadir, sudah check-in.
- QR contoh bisa di-scan dari layar laptop memakai HP.
- Banner "Mode demo — tidak ada transaksi nyata" tampil di semua halaman.
- Akun demo tidak bisa upload file dan tidak bisa menghapus data master (menu, paket).
- `pg_cron` menjalankan fungsi reset setiap 6 jam: hapus baris `is_demo`, lalu jalankan ulang seed.

## 6. Halaman (routes)

**Publik**
- `/` beranda
- `/menu`
- `/dinner` paket Ume / Take / Matsu
- `/weddings` Private Events & Weddings
- `/reservasi` form reservasi
- `/reservasi/:code` status reservasi
- `/galeri`
- `/kontak`
- `/demo`

**Undangan**
- `/w/:slug?t=:token`

**Admin** (`/admin/*`, butuh login)
- `/admin` ringkasan hari ini
- `/admin/reservasi` daftar + filter tanggal/status
- `/admin/wedding` pipeline
- `/admin/wedding/:id` detail, tamu, import CSV, link undangan, rekap diet
- `/admin/checkin/:weddingId` scanner usher + counter live
- `/admin/menu`, `/admin/paket`, `/admin/pengaturan`

## 7. Identitas visual

- **Prinsip *ma* (間):** whitespace lega, satu ide per layar, konten tidak padat.
- **Palet:**
  - sumi `#1A1A1A` (teks, latar gelap)
  - washi `#F5F1E8` (latar utama)
  - shu `#B7282E` (aksen saja, misalnya CTA dan detail kecil)
  - emas `#B8975A` (garis tipis, ornamen)
  - indigo `#264653` (sekunder)
- **Font:** Shippori Mincho untuk heading, Cormorant Garamond untuk Latin dekoratif, Inter untuk UI admin dan teks kecil.
- **Motif:** pattern seigaiha dan asanoha dengan opacity rendah, tekstur kertas washi, aksen teks vertikal.
- **Motion:** fade dan slide pelan (300–600 ms), transisi seperti noren dibuka saat ganti halaman, parallax halus di hero. Hormati `prefers-reduced-motion`.
- **Hindari:** hujan kelopak sakura, kanji dekoratif yang tidak dipahami, warna merah berlebihan.
- **Undangan tamu** menjadi layar paling dipoles di seluruh proyek, karena layar ini dibagikan ke banyak orang.

### Foto

- Ambil dari situs foto berlisensi bebas seperti Unsplash dan Pexels.
- Catat sumber dan nama fotografer di `docs/CREDITS.md`.
- Jangan ambil foto dari Google Images atau Instagram restoran lain, karena hak ciptanya milik orang lain.
- Kurasi sekitar 20 foto dengan tone serupa: gelap, hangat, banyak kayu dan cahaya lembut. Konsistensi lebih penting dari jumlah.
- Konversi ke AVIF/WebP, beberapa ukuran (`srcset`).

## 8. Kebutuhan non-fungsional

- **Performa:** LCP kurang dari 2,5 detik di Android kelas menengah dengan 4G. Gambar hero dimuat lebih dulu, gambar lain lazy-load. Font di-subset.
- **Mobile first:** semua alur publik dan undangan dites di lebar 360 px.
- **Aksesibilitas:** kontras warna AA, fokus keyboard terlihat, label form jelas.
- **OG preview WhatsApp:** crawler WhatsApp tidak menjalankan JavaScript. Route `/w/*` dilayani serverless function yang menyisipkan meta `og:title`, `og:description`, `og:image` (nama pasangan dan tanggal).
- **Usher di sinyal jelek:** daftar tamu di-cache di perangkat saat halaman check-in dibuka. Check-in yang gagal disimpan di antrean, lalu dikirim ulang saat online.
- **Data pribadi (UU PDP):** checkbox persetujuan di RSVP, teks singkat tentang penggunaan data, data tamu wedding bisa dihapus admin setelah acara.
- **Info makanan:** tandai menu yang mengandung babi, alkohol (termasuk mirin/sake), dan makanan mentah.

## 9. Jadwal 3 minggu

**Hari 0 (sebelum coding)**
- Tulis `docs/CONTENT.md`: cerita Shion, menu dan harga, tiga paket dinner, teks halaman wedding, FAQ, semuanya ID dan EN.
- Kurasi foto dan isi `docs/CREDITS.md`.

**Minggu 1: fondasi dan wedding**
- H1: scaffold Vite + Tailwind, project Supabase, migrasi skema, seed awal.
- H2: deploy shell ke Vercel, design tokens, layout dasar, i18n jalan.
- H3: Auth + role, RLS, shell admin.
- H4: form inquiry wedding + pipeline status di admin.
- H5: CRUD tamu, import CSV, generate token dan link undangan.
- H6: halaman undangan + RPC RSVP.
- H7: QR + scanner usher (porting dari web club) + RPC `check_in` + counter live.

**Minggu 2: situs publik dan reservasi**
- H8: beranda (hero, cerita).
- H9: halaman menu.
- H10: halaman paket dinner.
- H11: form reservasi gabungan, cek kapasitas, halaman kode konfirmasi, simulasi QRIS.
- H12: admin reservasi (daftar, filter, ubah status).
- H13: halaman Private Events & Weddings + galeri.
- H14: mode demo: seed "Rina & Dimas", tombol "Lihat sebagai…", banner, cron reset.

**H15: feature freeze.** Setelah ini tidak ada fitur baru.

**Minggu 3: polish dan presentasi**
- H15–H17: motion, tipografi, responsif, polish undangan.
- H18: OG preview undangan, optimasi gambar dan performa.
- H19: QA di HP Android, aksesibilitas, cache offline usher.
- H20: README, studi kasus (keputusan dan alasan), video walkthrough 90 detik.
- H21: cadangan.

**Kalau terlambat, potong urutan ini:** lightbox galeri → role `staff` (cukup owner + usher) → bahasa Inggris di admin (publik tetap dua bahasa) → antrean offline usher (cukup fallback cari nama).

## 10. Kriteria selesai

- [ ] Kelima alur demo di bagian 1 bisa dijalankan pengunjung baru tanpa bantuan.
- [ ] Double booking wedding di tanggal + sesi yang sama ditolak oleh DB.
- [ ] Satu QR hanya bisa dipakai check-in sekali.
- [ ] Token undangan yang salah tidak menampilkan data apa pun.
- [ ] Ganti bahasa ID/EN bekerja di semua halaman publik dan undangan.
- [ ] Link undangan yang dibagikan ke WhatsApp menampilkan preview dengan nama pasangan.
- [ ] Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 90 di beranda dan undangan.
- [ ] Data demo kembali bersih setelah reset terjadwal.
- [ ] Mengganti `config/brand.ts` mengubah nama, logo, dan warna tanpa menyentuh komponen.

## 11. Risiko

| Risiko | Mitigasi |
|---|---|
| Polish visual terpotong karena fitur molor | Feature freeze H15, daftar potong di bagian 9 |
| Foto terlihat generik | Kurasi ketat satu tone, lebih sedikit foto tapi konsisten |
| Demo dirusak pengunjung | Akun demo dibatasi, reset tiap 6 jam |
| Free tier Supabase bisa di-pause kalau lama tidak aktif | Buka demo secara berkala dan cek sebelum mengirim portofolio |
| Kamera tidak bisa dibuka di beberapa browser | Fallback cari nama; scanner butuh HTTPS |
| Wedding dianggap fitur tempelan | Halaman Private Events & Weddings menjelaskan konsep buyout restoran |
