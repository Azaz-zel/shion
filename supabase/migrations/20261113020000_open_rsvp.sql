-- Link undangan umum: tamu membuka /w/<slug> tanpa token, lalu menulis nama, grup, dan jumlah orangnya sendiri.
-- Tidak ada login, jadi dibatasi: wedding harus terkonfirmasi dan belum lewat, dan maksimal 500 tamu per wedding.
-- Batas nama, grup, dan jumlah orang sama dengan checkOpenRsvp di aplikasi.
create or replace function public.submit_open_rsvp(
  p_slug text, p_name text, p_group text, p_status text, p_pax integer,
  p_dietary text[], p_note text, p_message text, p_consent boolean
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  w public.weddings;
  g public.guests;
  v_name text := btrim(coalesce(p_name, ''));
  v_attending boolean := coalesce(p_status, '') = 'attending';
begin
  select * into w from public.weddings where slug = p_slug and status = 'confirmed';
  if not found or w.event_date < (now() at time zone 'Asia/Jakarta')::date then
    raise exception 'RSVP untuk acara ini sudah ditutup.' using errcode = 'P0001';
  end if;
  if not coalesce(p_consent, false) then raise exception 'Centang persetujuan data untuk mengirim RSVP.' using errcode = 'P0001'; end if;
  if coalesce(p_status, '') not in ('attending', 'declined') then raise exception 'Pilih hadir atau tidak hadir.' using errcode = 'P0001'; end if;
  if char_length(v_name) < 2 or char_length(v_name) > 80 then raise exception 'Tulis nama Anda, 2 sampai 80 huruf.' using errcode = 'P0001'; end if;
  if v_attending and (p_pax is null or p_pax < 1 or p_pax > 10) then
    raise exception 'Jumlah tamu untuk undangan ini 1 sampai 10 orang.' using errcode = 'P0001';
  end if;
  if (select count(*) from public.guests where wedding_id = w.id) >= 500 then
    raise exception 'Daftar tamu sudah penuh. Hubungi mempelai.' using errcode = 'P0001';
  end if;

  -- max_pax mengikuti jumlah yang ditulis tamu, supaya "kursi maksimal" di admin tetap jujur.
  insert into public.guests (wedding_id, name, group_label, max_pax, rsvp_status, rsvp_pax, dietary, dietary_note, message, responded_at, consent_at)
  values (
    w.id, v_name, left(btrim(coalesce(p_group, '')), 40),
    case when v_attending then p_pax else 1 end,
    p_status,
    case when v_attending then p_pax else 0 end,
    case when v_attending then coalesce(p_dietary, '{}') else '{}' end,
    case when v_attending then left(coalesce(p_note, ''), 200) else '' end,
    left(coalesce(p_message, ''), 500),
    now(), now()
  )
  returning * into g;
  return public.invitation_json(g, w);
end;
$$;

grant execute on function public.submit_open_rsvp(text, text, text, text, integer, text[], text, text, boolean) to anon, authenticated;
