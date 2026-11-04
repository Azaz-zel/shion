-- Shion: skema awal
-- Tabel: profiles, dinner_packages, reservations, weddings, guests.
-- Pengunjung publik dan tamu undangan TIDAK punya akses langsung ke tabel;
-- mereka hanya memanggil fungsi RPC security definer di bawah.

create extension if not exists pgcrypto;

-- Peran admin -----------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'staff', 'usher')),
  display_name text not null default '',
  created_at timestamptz not null default now()
);

create or replace function public.has_role(roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = any (roles));
$$;

-- Paket dinner ------------------------------------------------------------------
create table public.dinner_packages (
  code text primary key check (code in ('ume', 'take', 'matsu')),
  name text not null,
  price_per_pax integer not null check (price_per_pax > 0),
  courses integer not null check (courses > 0),
  min_pax integer not null default 2,
  max_pax integer not null default 12,
  active boolean not null default true
);

-- Reservasi meja & paket dinner -------------------------------------------------
create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text not null check (type in ('table', 'dinner_package')),
  package_code text references public.dinner_packages (code),
  date date not null,
  time text not null check (time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  pax integer not null check (pax between 1 and 12),
  guest_name text not null,
  phone text not null,
  notes text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show')),
  payment_status text not null default 'none' check (payment_status in ('none', 'pending', 'paid_simulated')),
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  check ((type = 'dinner_package') = (package_code is not null))
);
create index reservations_date_idx on public.reservations (date, time);

-- Wedding -------------------------------------------------------------------------
create table public.weddings (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  couple_name_1 text not null,
  couple_name_2 text not null default '',
  contact_name text not null,
  phone text not null,
  event_date date not null,
  session text not null check (session in ('lunch', 'dinner')),
  guest_estimate integer not null check (guest_estimate between 1 and 200),
  status text not null default 'inquiry'
    check (status in ('inquiry', 'consultation', 'confirmed', 'completed', 'cancelled')),
  notes text not null default '',
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
-- Satu tanggal + sesi hanya boleh punya satu wedding terkonfirmasi.
create unique index weddings_one_confirmed_per_slot
  on public.weddings (event_date, session) where status = 'confirmed';

-- Tamu undangan ---------------------------------------------------------------------
create table public.guests (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  name text not null,
  phone text not null default '',
  group_label text not null default '',
  max_pax integer not null default 1 check (max_pax between 1 and 10),
  -- Token acak 24 byte (base64url), dipakai di link undangan dan QR. Tidak pernah memakai id.
  token text not null unique
    default translate(encode(gen_random_bytes(24), 'base64'), '+/=', '-_'),
  rsvp_status text not null default 'pending' check (rsvp_status in ('pending', 'attending', 'declined')),
  rsvp_pax integer not null default 0 check (rsvp_pax >= 0),
  dietary text[] not null default '{}'
    check (dietary <@ array['no_pork', 'no_alcohol', 'vegetarian', 'no_raw']),
  dietary_note text not null default '',
  message text not null default '',
  responded_at timestamptz,
  consent_at timestamptz,
  table_no text not null default '',
  checked_in_at timestamptz,
  created_at timestamptz not null default now(),
  check (rsvp_pax <= max_pax)
);
create index guests_wedding_idx on public.guests (wedding_id);

-- Akses (RLS) ----------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.dinner_packages enable row level security;
alter table public.reservations enable row level security;
alter table public.weddings enable row level security;
alter table public.guests enable row level security;

create policy "profil sendiri" on public.profiles for select using (id = auth.uid());

create policy "paket aktif terbaca publik" on public.dinner_packages for select using (active);
create policy "owner kelola paket" on public.dinner_packages for all
  using (public.has_role(array['owner'])) with check (public.has_role(array['owner']));

create policy "staff baca reservasi" on public.reservations for select using (public.has_role(array['owner', 'staff']));
create policy "staff ubah reservasi" on public.reservations for update
  using (public.has_role(array['owner', 'staff'])) with check (public.has_role(array['owner', 'staff']));

create policy "staff & usher baca wedding" on public.weddings for select using (public.has_role(array['owner', 'staff', 'usher']));
create policy "staff ubah wedding" on public.weddings for update
  using (public.has_role(array['owner', 'staff'])) with check (public.has_role(array['owner', 'staff']));
create policy "staff tambah wedding" on public.weddings for insert with check (public.has_role(array['owner', 'staff']));

create policy "staff & usher baca tamu" on public.guests for select using (public.has_role(array['owner', 'staff', 'usher']));
create policy "staff kelola tamu" on public.guests for all
  using (public.has_role(array['owner', 'staff'])) with check (public.has_role(array['owner', 'staff']));

-- RPC publik -------------------------------------------------------------------------
create or replace function public.new_code(prefix text)
returns text
language plpgsql
as $$
declare
  candidate text;
begin
  loop
    candidate := prefix || '-' || (1000 + floor(random() * 9000))::int;
    exit when not exists (select 1 from public.reservations where code = candidate)
          and not exists (select 1 from public.weddings where code = candidate);
  end loop;
  return candidate;
end;
$$;

create or replace function public.create_reservation(
  p_type text, p_package text, p_date date, p_time text, p_pax integer,
  p_name text, p_phone text, p_notes text
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  booked integer;
  pkg public.dinner_packages;
  v_code text;
begin
  if length(trim(p_name)) < 2 then raise exception 'Isi nama lengkap Anda.' using errcode = 'P0001'; end if;
  if p_phone !~ '^08[0-9]{8,12}$' then raise exception 'Masukkan nomor WhatsApp yang valid, misalnya 0812xxxxxxxx.' using errcode = 'P0001'; end if;
  if p_date < (now() at time zone 'Asia/Jakarta')::date then raise exception 'Pilih tanggal mulai hari ini.' using errcode = 'P0001'; end if;
  if extract(isodow from p_date) = 1 then raise exception 'Kami tutup setiap Senin. Pilih hari lain.' using errcode = 'P0001'; end if;
  if p_type = 'dinner_package' then
    select * into pkg from public.dinner_packages where code = p_package and active;
    if not found then raise exception 'Pilih paket Ume, Take, atau Matsu.' using errcode = 'P0001'; end if;
    if p_pax < pkg.min_pax or p_pax > pkg.max_pax then
      raise exception 'Paket ini untuk % sampai % orang.', pkg.min_pax, pkg.max_pax using errcode = 'P0001';
    end if;
  elsif p_type <> 'table' then
    raise exception 'Jenis reservasi tidak dikenal.' using errcode = 'P0001';
  end if;

  -- Kapasitas sederhana: 24 kursi per jam. Kunci baris di jam yang sama supaya tidak terjadi overbooking bersamaan.
  perform pg_advisory_xact_lock(hashtext(p_date::text || p_time));
  select coalesce(sum(pax), 0) into booked from public.reservations
   where date = p_date and time = p_time and status not in ('cancelled', 'no_show');
  if booked + p_pax > 24 then raise exception 'Jam ini sudah penuh. Coba jam lain.' using errcode = 'P0001'; end if;

  v_code := public.new_code('SHN');
  insert into public.reservations (code, type, package_code, date, time, pax, guest_name, phone, notes, payment_status)
  values (v_code, p_type, case when p_type = 'dinner_package' then p_package end, p_date, p_time, p_pax,
          trim(p_name), p_phone, coalesce(p_notes, ''), case when p_type = 'dinner_package' then 'pending' else 'none' end);
  return v_code;
end;
$$;

create or replace function public.create_wedding_inquiry(
  p_contact text, p_phone text, p_date date, p_session text, p_estimate integer, p_notes text
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
begin
  if length(trim(p_contact)) < 2 then raise exception 'Isi nama kontak.' using errcode = 'P0001'; end if;
  if p_phone !~ '^08[0-9]{8,12}$' then raise exception 'Masukkan nomor WhatsApp yang valid, misalnya 0812xxxxxxxx.' using errcode = 'P0001'; end if;
  if p_date < (now() at time zone 'Asia/Jakarta')::date then raise exception 'Pilih tanggal acara mulai hari ini.' using errcode = 'P0001'; end if;
  if extract(isodow from p_date) = 1 then raise exception 'Kami tutup setiap Senin. Pilih hari lain.' using errcode = 'P0001'; end if;
  if p_estimate not between 40 and 120 then raise exception 'Buyout wedding untuk 40 sampai 120 tamu.' using errcode = 'P0001'; end if;
  if exists (select 1 from public.weddings where event_date = p_date and session = p_session and status = 'confirmed') then
    raise exception 'Tanggal dan sesi ini sudah dipesan. Pilih sesi atau tanggal lain.' using errcode = 'P0001';
  end if;
  v_code := public.new_code('WED');
  insert into public.weddings (code, slug, couple_name_1, contact_name, phone, event_date, session, guest_estimate, notes)
  values (v_code, lower(v_code), trim(p_contact), trim(p_contact), p_phone, p_date, p_session, p_estimate, coalesce(p_notes, ''));
  return v_code;
end;
$$;

-- Data undangan untuk satu tamu: hanya data acara dan data tamu pemilik token.
create or replace function public.invitation_json(g public.guests, w public.weddings)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'wedding', jsonb_build_object('couple1', w.couple_name_1, 'couple2', w.couple_name_2,
      'eventDate', w.event_date, 'session', w.session, 'slug', w.slug),
    'guest', jsonb_build_object('name', g.name, 'maxPax', g.max_pax, 'rsvpStatus', g.rsvp_status,
      'rsvpPax', g.rsvp_pax, 'dietary', to_jsonb(g.dietary), 'dietaryNote', g.dietary_note,
      'message', g.message, 'token', g.token, 'tableNo', g.table_no)
  );
$$;

create or replace function public.get_invitation(p_slug text, p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  g public.guests;
  w public.weddings;
begin
  select * into g from public.guests where token = p_token;
  if not found then return null; end if;
  select * into w from public.weddings where id = g.wedding_id and slug = p_slug and status = 'confirmed';
  if not found then return null; end if;
  return public.invitation_json(g, w);
end;
$$;

create or replace function public.submit_rsvp(
  p_token text, p_status text, p_pax integer, p_dietary text[], p_note text, p_message text, p_consent boolean
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  g public.guests;
  w public.weddings;
begin
  select * into g from public.guests where token = p_token for update;
  if not found then raise exception 'Undangan tidak ditemukan.' using errcode = 'P0001'; end if;
  select * into w from public.weddings where id = g.wedding_id;
  if w.status <> 'confirmed' or w.event_date < (now() at time zone 'Asia/Jakarta')::date then
    raise exception 'RSVP untuk acara ini sudah ditutup.' using errcode = 'P0001';
  end if;
  if not coalesce(p_consent, false) then raise exception 'Centang persetujuan data untuk mengirim RSVP.' using errcode = 'P0001'; end if;
  if p_status not in ('attending', 'declined') then raise exception 'Pilih hadir atau tidak hadir.' using errcode = 'P0001'; end if;
  if p_status = 'attending' and (p_pax < 1 or p_pax > g.max_pax) then
    raise exception 'Jumlah tamu untuk undangan ini 1 sampai % orang.', g.max_pax using errcode = 'P0001';
  end if;

  update public.guests set
    rsvp_status = p_status,
    rsvp_pax = case when p_status = 'attending' then p_pax else 0 end,
    dietary = case when p_status = 'attending' then coalesce(p_dietary, '{}') else '{}' end,
    dietary_note = case when p_status = 'attending' then left(coalesce(p_note, ''), 200) else '' end,
    message = left(coalesce(p_message, ''), 500),
    responded_at = now(),
    consent_at = now()
  where id = g.id
  returning * into g;
  return public.invitation_json(g, w);
end;
$$;

revoke all on function public.new_code(text) from public;
revoke all on function public.invitation_json(public.guests, public.weddings) from public;
grant execute on function public.create_reservation(text, text, date, text, integer, text, text, text) to anon, authenticated;
grant execute on function public.create_wedding_inquiry(text, text, date, text, integer, text) to anon, authenticated;
grant execute on function public.get_invitation(text, text) to anon, authenticated;
grant execute on function public.submit_rsvp(text, text, integer, text[], text, text, boolean) to anon, authenticated;

-- Realtime untuk panel admin
alter publication supabase_realtime add table public.guests, public.reservations, public.weddings;
