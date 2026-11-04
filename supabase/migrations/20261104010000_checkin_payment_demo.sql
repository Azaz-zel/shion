-- Shion: check-in tamu, simulasi pembayaran, preview undangan, dan data demo.

alter table public.guests
  add column checked_in_pax integer not null default 0 check (checked_in_pax >= 0),
  add column checked_in_by uuid references auth.users (id) on delete set null;

-- Check-in tamu oleh usher/staff/owner -------------------------------------------------
-- Bisa lewat token (hasil scan QR) atau id tamu (cari nama). Update atomik:
-- hanya baris yang belum check-in yang berubah, jadi satu QR tidak bisa dipakai dua kali.
create or replace function public.check_in(p_wedding uuid, p_token text, p_guest uuid, p_pax integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  g public.guests;
  updated public.guests;
begin
  if not public.has_role(array['owner', 'staff', 'usher']) then
    raise exception 'Hanya usher atau staff yang bisa melakukan check-in.' using errcode = 'P0001';
  end if;

  if p_guest is not null then
    select * into g from public.guests where id = p_guest;
  else
    select * into g from public.guests where token = p_token;
  end if;
  if not found then return jsonb_build_object('status', 'invalid'); end if;
  if g.wedding_id <> p_wedding then return jsonb_build_object('status', 'other_event'); end if;

  update public.guests set
    checked_in_at = now(),
    checked_in_pax = greatest(1, least(coalesce(p_pax, nullif(g.rsvp_pax, 0), 1), g.max_pax)),
    checked_in_by = auth.uid()
  where id = g.id and checked_in_at is null
  returning * into updated;

  if updated.id is null then
    return jsonb_build_object('status', 'already', 'guest', public.guest_brief(g));
  end if;
  return jsonb_build_object('status', 'ok', 'guest', public.guest_brief(updated));
end;
$$;

create or replace function public.guest_brief(g public.guests)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object('id', g.id, 'name', g.name, 'groupLabel', g.group_label, 'maxPax', g.max_pax,
    'rsvpStatus', g.rsvp_status, 'rsvpPax', g.rsvp_pax, 'dietary', to_jsonb(g.dietary), 'dietaryNote', g.dietary_note,
    'tableNo', g.table_no, 'checkedInAt', g.checked_in_at, 'checkedInPax', g.checked_in_pax);
$$;

-- Simulasi pembayaran QRIS untuk paket dinner (mode portofolio, tidak ada uang yang ditarik) -------
create or replace function public.simulate_payment(p_code text, p_phone text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.reservations
     set payment_status = 'paid_simulated', status = case when status = 'pending' then 'confirmed' else status end
   where code = p_code and phone = p_phone and type = 'dinner_package' and payment_status = 'pending';
  if not found then raise exception 'Reservasi tidak ditemukan atau sudah dibayar.' using errcode = 'P0001'; end if;
  return true;
end;
$$;

-- Preview link undangan (Open Graph): hanya nama pasangan dan tanggal, tanpa data tamu ----------
create or replace function public.get_wedding_preview(p_slug text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object('couple1', couple_name_1, 'couple2', couple_name_2, 'eventDate', event_date, 'session', session)
  from public.weddings where slug = p_slug and status = 'confirmed';
$$;

-- Data demo ---------------------------------------------------------------------------------
-- seed_demo() mengisi wedding "Rina & Dimas" beserta tamunya dan beberapa reservasi contoh.
create or replace function public.seed_demo()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  sat date := current_date + 30 + ((6 - extract(dow from current_date + 30)::int + 7) % 7);
  w_id uuid;
  open_day date := current_date + case when extract(isodow from current_date) = 1 then 1 else 0 end;
begin
  insert into public.weddings (code, slug, couple_name_1, couple_name_2, contact_name, phone, event_date, session,
                               guest_estimate, status, notes, is_demo)
  values ('WED-0427', 'rina-dimas', 'Rina', 'Dimas', 'Rina Maharani', '081200000001', sat, 'dinner', 60, 'confirmed',
          'Kaiseki 7 course, satu meja tanpa babi.', true)
  returning id into w_id;

  insert into public.weddings (code, slug, couple_name_1, couple_name_2, contact_name, phone, event_date, session,
                               guest_estimate, status, notes, is_demo)
  values ('WED-0512', 'wed-0512', 'Laras', 'Bima', 'Laras Anindita', '081200000002', sat + 63, 'lunch', 45, 'inquiry',
          'Ingin akad kecil di teras taman.', true);

  insert into public.guests (wedding_id, name, group_label, max_pax, token, rsvp_status, rsvp_pax, dietary, dietary_note,
                             message, responded_at, consent_at, table_no)
  select w_id, g.name, g.grp, g.max_pax, g.token, g.status, g.pax, g.diet, g.note, g.msg,
         case when g.status = 'pending' then null else now() - g.ago end,
         case when g.status = 'pending' then null else now() - g.ago end, g.tbl
  from (values
    ('Budi Santoso', 'Keluarga', 2, 'demo-budi', 'attending', 2, array['no_pork'], '', 'Selamat untuk kalian berdua.', interval '70 hours', '1'),
    ('Sari Wulandari', 'Keluarga', 4, 'demo-sari', 'attending', 3, array[]::text[], '', '', interval '52 hours', '1'),
    ('Andi Wijaya', 'Teman', 1, 'demo-andi', 'attending', 1, array['vegetarian'], '', 'Sampai jumpa di Shion!', interval '30 hours', '4'),
    ('Maya Putri', 'Teman', 2, 'demo-maya', 'declined', 0, array[]::text[], '', 'Maaf sedang di luar kota, doa terbaik untuk kalian.', interval '26 hours', ''),
    ('Reza Hidayat', 'Kantor', 2, 'demo-reza', 'pending', 0, array[]::text[], '', '', interval '0', '6'),
    ('Clara Tan', 'Teman', 2, 'demo-clara', 'attending', 2, array[]::text[], 'Alergi udang', '', interval '12 hours', '4'),
    ('Yusuf Rahman', 'Kantor', 1, 'demo-yusuf', 'attending', 1, array['no_pork', 'no_alcohol'], '', '', interval '9 hours', '6'),
    ('Dewi Lestari', 'Keluarga', 3, 'demo-dewi', 'pending', 0, array[]::text[], '', '', interval '0', '2'),
    ('Kevin Halim', 'Teman', 1, 'demo-kevin', 'attending', 1, array['no_raw'], '', 'Tidak sabar!', interval '3 hours', '5'),
    ('Nadia Kusuma', 'Kantor', 2, 'demo-nadia', 'declined', 0, array[]::text[], '', '', interval '2 hours', ''),
    ('Tamu Demo', 'Demo', 2, 'demo-tamu-shion', 'pending', 0, array[]::text[], '', '', interval '0', '3')
  ) as g(name, grp, max_pax, token, status, pax, diet, note, msg, ago, tbl);

  update public.guests set checked_in_at = now() - interval '1 hour', checked_in_pax = 2 where token = 'demo-budi';

  insert into public.reservations (code, type, package_code, date, time, pax, guest_name, phone, notes, status, payment_status, is_demo)
  values
    ('SHN-4821', 'dinner_package', 'matsu', open_day, '18:00', 2, 'Tamu Contoh Satu', '081200000001', 'Ulang tahun pernikahan', 'confirmed', 'paid_simulated', true),
    ('SHN-4822', 'table', null, open_day, '19:00', 4, 'Tamu Contoh Dua', '081200000002', 'Satu kursi bayi', 'confirmed', 'none', true),
    ('SHN-4823', 'dinner_package', 'take', open_day, '19:30', 3, 'Tamu Contoh Tiga', '081200000003', 'Tanpa babi', 'pending', 'pending', true);
end;
$$;

-- reset_demo() MENGHAPUS SEMUA reservasi dan wedding, lalu mengisi ulang data demo.
-- Hanya untuk project demo portofolio. Jangan dijadwalkan di project restoran sungguhan.
create or replace function public.reset_demo()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.reservations where true;
  delete from public.weddings where true;
  perform public.seed_demo();
end;
$$;

revoke all on function public.guest_brief(public.guests) from public, anon, authenticated;
revoke all on function public.seed_demo() from public, anon, authenticated;
revoke all on function public.reset_demo() from public, anon, authenticated;
revoke all on function public.check_in(uuid, text, uuid, integer) from public, anon;
grant execute on function public.check_in(uuid, text, uuid, integer) to authenticated;
grant execute on function public.simulate_payment(text, text) to anon, authenticated;
grant execute on function public.get_wedding_preview(text) to anon, authenticated;
