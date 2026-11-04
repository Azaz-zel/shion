# Shion

Situs restoran Jepang (fiktif) dengan reservasi meja, paket dinner, permintaan wedding, undangan digital per tamu dengan RSVP dan QR, serta panel admin untuk memantau semuanya. Proyek portofolio.

- `apps/web`: React + Vite + TypeScript
- `supabase/`: skema database, aturan akses (RLS), fungsi RPC, dan data contoh
- `docs/`: rencana, konten dua bahasa, dan kredit foto

## Menjalankan secara lokal

```bash
cd apps/web
npm install
npm run dev
```

Tanpa file `.env`, aplikasi berjalan dalam **mode demo**: data contoh disimpan di browser, tidak ada server.

| Halaman | Alamat |
|---|---|
| Beranda + form reservasi | `/` |
| Undangan contoh (tamu demo) | `/w/rina-dimas?t=demo-tamu-shion` |
| Panel admin | `/admin` (demo: `owner@shion.demo` / `shion-demo`) |

Coba buka admin di satu tab dan undangan contoh di tab lain. Setelah tamu mengirim RSVP, daftar di admin ikut berubah tanpa perlu dimuat ulang.

## Memakai Supabase

1. Buat project di Supabase.
2. Jalankan `supabase/migrations/20261104000000_init.sql`, lalu `supabase/seed.sql`, di SQL Editor (atau `supabase db push` dengan Supabase CLI).
3. Buat user admin di Authentication > Users, lalu beri peran:
   ```sql
   insert into public.profiles (id, role, display_name)
   select id, 'owner', 'Owner Shion' from auth.users where email = 'email-anda@contoh.com';
   ```
4. Salin `apps/web/.env.example` menjadi `apps/web/.env` dan isi `VITE_SUPABASE_URL` serta `VITE_SUPABASE_ANON_KEY`.

Pengunjung dan tamu tidak punya akses langsung ke tabel. Mereka hanya memanggil fungsi `create_reservation`, `create_wedding_inquiry`, `get_invitation`, dan `submit_rsvp`. Admin membaca tabel lewat RLS sesuai peran (`owner`, `staff`, `usher`) dan menerima pembaruan realtime.

## Deploy

`apps/web` siap di-deploy ke Vercel (root directory `apps/web`). `vercel.json` mengarahkan semua rute ke `index.html`.

## Kredit

Tampilan dan animasi beranda diadaptasi dari "Florist website template" oleh 8B, lisensi MIT (`apps/web/LICENSE-8B`). Foto berlisensi CC BY 2.0, daftar lengkap di `docs/CREDITS.md`.
