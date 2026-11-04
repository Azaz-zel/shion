-- Data awal Shion. Jalankan setelah semua file di supabase/migrations.
insert into public.dinner_packages (code, name, price_per_pax, courses, min_pax, max_pax) values
  ('ume', 'Ume', 750000, 6, 2, 12),
  ('take', 'Take', 1150000, 8, 2, 12),
  ('matsu', 'Matsu', 1850000, 10, 2, 12)
on conflict (code) do update set name = excluded.name, price_per_pax = excluded.price_per_pax, courses = excluded.courses;

-- Data demo (wedding Rina & Dimas, 11 tamu, 3 reservasi). Semua nama fiktif.
-- Lewati baris ini untuk restoran sungguhan.
select public.seed_demo();
