# Tutorial setup database (Supabase)

Panduan ini menghubungkan aplikasi Shion ke database Supabase sungguhan. Tanpa langkah ini, aplikasi tetap jalan dalam mode demo (data hanya tersimpan di browser).

Waktu yang dibutuhkan: sekitar 20 menit. Semua langkah bisa lewat dashboard Supabase di browser, tanpa install apa pun.

---

## 1. Buat project Supabase

1. Buka https://supabase.com, daftar atau masuk.
2. Klik **New project**.
3. Isi:
   - **Name:** `shion` (bebas).
   - **Database password:** buat password kuat, lalu simpan di password manager. Password ini jarang dipakai, tapi tidak bisa dilihat lagi.
   - **Region:** pilih **Southeast Asia (Singapore)**, paling dekat dengan Indonesia.
4. Klik **Create new project**, tunggu sampai statusnya siap (1 sampai 2 menit).

## 2. Jalankan migrasi database

Migrasi membuat tabel, aturan akses, dan fungsi yang dipakai aplikasi. Jalankan **berurutan**.

1. Di menu kiri, buka **SQL Editor**, lalu klik **New query**.
2. Buka file `supabase/migrations/20261104000000_init.sql` di repo, salin seluruh isinya, tempel ke editor, lalu klik **Run**.
   Hasil yang benar: `Success. No rows returned`.
3. Buat query baru lagi. Salin isi `supabase/migrations/20261104010000_checkin_payment_demo.sql`, tempel, lalu **Run**.
4. Buat query baru lagi. Salin isi `supabase/seed.sql`, tempel, lalu **Run**.
   File ini mengisi tiga paket dinner dan data demo: wedding "Rina & Dimas" dengan 11 tamu dan 3 reservasi contoh.
   **Untuk restoran sungguhan**, hapus baris `select public.seed_demo();` sebelum menjalankannya.

Cek hasilnya di **Table Editor**. Harus ada tabel `profiles`, `dinner_packages`, `reservations`, `weddings`, dan `guests`.

Tes cepat di SQL Editor:

```sql
select public.get_wedding_preview('rina-dimas');
```

Hasil yang benar berisi nama `Rina` dan `Dimas` beserta tanggal acara.

> **Pakai Supabase CLI?** Dari folder repo: `supabase link --project-ref <ref-project>`, lalu `supabase db push`. Setelah itu jalankan isi `supabase/seed.sql` di SQL Editor.

## 3. Buat akun admin

Aplikasi punya tiga peran:
- **owner:** semua fitur.
- **staff:** semua fitur kecuali mengelola paket dinner.
- **usher:** hanya halaman check-in.

1. Buka **Authentication > Users**, klik **Add user > Create new user**.
2. Isi email dan password, centang **Auto Confirm User**, lalu klik **Create user**.
3. Di SQL Editor, beri peran owner ke user itu (ganti emailnya):

   ```sql
   insert into public.profiles (id, role, display_name)
   select id, 'owner', 'Owner Shion' from auth.users where email = 'owner@restoran-anda.com';
   ```

4. Ulangi untuk usher atau staff dengan `'usher'` atau `'staff'`:

   ```sql
   insert into public.profiles (id, role, display_name)
   select id, 'usher', 'Usher pintu utama' from auth.users where email = 'usher@restoran-anda.com';
   ```

User tanpa baris di `profiles` bisa login ke Supabase, tetapi aplikasi menolaknya dengan pesan "Akun ini belum punya akses admin".

## 4. Matikan pendaftaran umum

Supaya orang lain tidak bisa membuat akun sendiri:

1. Buka **Authentication > Sign In / Providers** (di beberapa versi dashboard: **Authentication > Settings**).
2. Matikan **Allow new users to sign up**, lalu simpan.

Akun admin baru tetap bisa dibuat lewat langkah 3.

## 5. Sambungkan aplikasi

1. Buka **Project Settings > API** (di versi baru: **Project Settings > Data API** untuk URL dan **API Keys** untuk kunci).
2. Salin:
   - **Project URL**, contoh: `https://abcdefgh.supabase.co`.
   - **anon public key** (atau **publishable key** di dashboard versi baru).
   Jangan pernah memakai **service_role / secret key** di aplikasi. Kunci itu melewati semua aturan akses.
3. Di repo, salin `apps/web/.env.example` menjadi `apps/web/.env`, lalu isi:

   ```bash
   VITE_SUPABASE_URL=https://abcdefgh.supabase.co
   VITE_SUPABASE_ANON_KEY=isi-anon-key-anda
   ```

4. Jalankan aplikasi:

   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

5. Tes:
   - Buka `/admin`, login dengan akun owner. Banner "Mode demo" tidak muncul lagi.
   - Buka `/w/rina-dimas?t=demo-tamu-shion` di tab lain, kirim RSVP. Daftar tamu di admin harus ikut berubah dalam beberapa detik.
   - Kirim reservasi dari beranda. Reservasinya muncul di tab **Reservasi** admin.

## 6. Pastikan realtime aktif

Migrasi sudah mendaftarkan tabel `guests`, `reservations`, dan `weddings` ke realtime. Untuk mengecek, buka **Database > Publications**, pilih `supabase_realtime`, dan pastikan ketiga tabel itu aktif.

Kalau admin tidak ikut berubah otomatis, aktifkan ketiga tabel di sana. Halaman admin tetap bisa dimuat ulang manual.

## 7. Deploy ke Vercel

1. Masuk ke https://vercel.com, klik **Add New > Project**, lalu import repo GitHub ini.
2. **Root Directory:** `apps/web`. Framework terdeteksi sebagai **Vite**.
3. Di **Environment Variables**, isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` (nilai sama dengan `.env`).
4. Klik **Deploy**.
5. Di Supabase, buka **Authentication > URL Configuration**, lalu isi **Site URL** dengan domain Vercel Anda.

File `middleware.ts` otomatis aktif di Vercel. Link undangan yang dibagikan di WhatsApp akan menampilkan preview nama pasangan dan tanggal. Data tamu tidak pernah ikut di preview.

## 8. (Opsional) Reset otomatis data demo

Hanya untuk project **demo portofolio**. Fungsi ini **menghapus semua reservasi dan wedding**, jadi jangan dipakai di project restoran sungguhan.

1. Buka **Database > Extensions**, aktifkan **pg_cron**.
2. Di SQL Editor, jalankan isi `supabase/demo/schedule-reset.sql`. Data demo akan kembali bersih setiap 6 jam.
3. Untuk reset sekarang juga: `select public.reset_demo();`

## Mengatasi masalah

| Gejala | Penyebab dan solusi |
|---|---|
| Halaman menampilkan banner "Mode demo" padahal `.env` sudah diisi | Server dev belum dimulai ulang. Hentikan `npm run dev`, lalu jalankan lagi. Di Vercel, deploy ulang setelah mengisi environment variables. |
| Login berhasil tapi muncul "Akun ini belum punya akses admin" | User belum punya baris di tabel `profiles`. Jalankan langkah 3 nomor 3. |
| "Email atau kata sandi salah" padahal benar | User belum dikonfirmasi. Buka Authentication > Users, pastikan kolom konfirmasi terisi, atau buat ulang dengan **Auto Confirm User**. |
| Error `relation "public.guests" does not exist` | Migrasi pertama belum dijalankan. Ulangi langkah 2 secara berurutan. |
| Error `function public.seed_demo() does not exist` saat menjalankan seed | Migrasi kedua belum dijalankan. Jalankan file migrasi kedua dulu, baru `seed.sql`. |
| Error `duplicate key value` saat menjalankan seed dua kali | Data demo sudah ada. Pakai `select public.reset_demo();` untuk mengisinya ulang. |
| Admin tidak berubah otomatis saat tamu RSVP | Lihat langkah 6. |
| Kamera tidak terbuka di halaman check-in | Kamera hanya bisa dibuka lewat HTTPS (atau `localhost`). Pakai domain Vercel, lalu izinkan kamera di browser. Usher tetap bisa mencari nama tamu tanpa kamera. |

## Ringkasan keamanan

- Pengunjung dan tamu **tidak bisa membaca tabel**. Mereka hanya memanggil empat fungsi: `create_reservation`, `create_wedding_inquiry`, `get_invitation`, dan `submit_rsvp`, ditambah `simulate_payment` dan `get_wedding_preview`.
- Undangan hanya bisa dibuka dengan token acak milik tamu itu. Token tidak memakai ID database.
- Satu QR hanya bisa dipakai check-in sekali. Ini dijaga dengan update atomik di database.
- Satu tanggal dan sesi hanya boleh punya satu wedding terkonfirmasi. Ini dijaga dengan unique index.
- Admin membaca dan mengubah data sesuai peran lewat Row Level Security.
