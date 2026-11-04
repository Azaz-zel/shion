-- Data contoh Shion. Semua nama fiktif. Baris demo ditandai is_demo = true.
insert into public.dinner_packages (code, name, price_per_pax, courses, min_pax, max_pax) values
  ('ume', 'Ume', 750000, 6, 2, 12),
  ('take', 'Take', 1150000, 8, 2, 12),
  ('matsu', 'Matsu', 1850000, 10, 2, 12)
on conflict (code) do update set name = excluded.name, price_per_pax = excluded.price_per_pax, courses = excluded.courses;

-- Wedding demo: Sabtu terdekat setelah 30 hari dari sekarang, sesi malam.
with d as (
  select (current_date + 30 + ((6 - extract(dow from current_date + 30)::int + 7) % 7))::date as sat
), w as (
  insert into public.weddings (code, slug, couple_name_1, couple_name_2, contact_name, phone, event_date, session,
                               guest_estimate, status, notes, is_demo)
  select 'WED-0427', 'rina-dimas', 'Rina', 'Dimas', 'Rina Maharani', '081200000001', d.sat, 'dinner', 60, 'confirmed',
         'Kaiseki 7 course, satu meja tanpa babi.', true
  from d
  returning id
)
insert into public.guests (wedding_id, name, group_label, max_pax, token, rsvp_status, rsvp_pax, dietary, dietary_note,
                           message, responded_at, consent_at, table_no)
select w.id, g.name, g.grp, g.max_pax, g.token, g.status, g.pax, g.diet, g.note, g.msg,
       case when g.status = 'pending' then null else now() - g.ago end,
       case when g.status = 'pending' then null else now() - g.ago end, g.tbl
from w, (values
  ('Budi Santoso', 'Keluarga', 2, 'demo-budi', 'attending', 2, array['no_pork'], '', 'Selamat untuk kalian berdua.', interval '70 hours', '1'),
  ('Sari Wulandari', 'Keluarga', 4, 'demo-sari', 'attending', 3, array[]::text[], '', '', interval '52 hours', '1'),
  ('Andi Wijaya', 'Teman', 1, 'demo-andi', 'attending', 1, array['vegetarian'], '', 'Sampai jumpa di Shion!', interval '30 hours', '4'),
  ('Maya Putri', 'Teman', 2, 'demo-maya', 'declined', 0, array[]::text[], '', 'Maaf sedang di luar kota.', interval '26 hours', ''),
  ('Reza Hidayat', 'Kantor', 2, 'demo-reza', 'pending', 0, array[]::text[], '', '', interval '0', '6'),
  ('Clara Tan', 'Teman', 2, 'demo-clara', 'attending', 2, array[]::text[], 'Alergi udang', '', interval '12 hours', '4'),
  ('Yusuf Rahman', 'Kantor', 1, 'demo-yusuf', 'attending', 1, array['no_pork', 'no_alcohol'], '', '', interval '9 hours', '6'),
  ('Dewi Lestari', 'Keluarga', 3, 'demo-dewi', 'pending', 0, array[]::text[], '', '', interval '0', '2'),
  ('Kevin Halim', 'Teman', 1, 'demo-kevin', 'attending', 1, array['no_raw'], '', 'Tidak sabar!', interval '3 hours', '5'),
  ('Nadia Kusuma', 'Kantor', 2, 'demo-nadia', 'declined', 0, array[]::text[], '', '', interval '2 hours', ''),
  ('Tamu Demo', 'Demo', 2, 'demo-tamu-shion', 'pending', 0, array[]::text[], '', '', interval '0', '3')
) as g(name, grp, max_pax, token, status, pax, diet, note, msg, ago, tbl);

-- Admin: buat user lewat Supabase Dashboard (Authentication > Users), lalu jalankan:
--   insert into public.profiles (id, role, display_name)
--   select id, 'owner', 'Owner Shion' from auth.users where email = 'email-anda@contoh.com';
