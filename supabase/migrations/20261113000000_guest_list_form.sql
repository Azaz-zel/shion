-- Form daftar tamu untuk pelanggan wedding (/tamu/:code).
-- Pelanggan tidak login: dikunci dengan kode wedding + nomor WhatsApp pemesan, sama seperti simulate_payment.
-- Hanya bisa menambah tamu, tidak bisa membaca, mengubah, atau menghapus tamu yang sudah ada.
create or replace function public.submit_guest_list(p_code text, p_phone text, p_rows jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_wedding uuid;
  v_count integer;
begin
  select id into v_wedding from public.weddings
   where code = p_code and phone = p_phone and status = 'confirmed';
  if v_wedding is null then
    raise exception 'Kode wedding dan nomor WhatsApp tidak cocok, atau wedding belum dikonfirmasi.' using errcode = 'P0001';
  end if;
  if jsonb_typeof(p_rows) <> 'array' or jsonb_array_length(p_rows) not between 1 and 200 then
    raise exception 'Kirim 1 sampai 200 tamu sekaligus.' using errcode = 'P0001';
  end if;
  if exists (select 1 from jsonb_array_elements(p_rows) r where length(trim(coalesce(r->>'name', ''))) not between 2 and 80) then
    raise exception 'Nama tamu 2 sampai 80 huruf.' using errcode = 'P0001';
  end if;
  if (select count(*) from public.guests where wedding_id = v_wedding) + jsonb_array_length(p_rows) > 500 then
    raise exception 'Daftar tamu sudah penuh. Hubungi kami lewat WhatsApp.' using errcode = 'P0001';
  end if;

  insert into public.guests (wedding_id, name, group_label, max_pax)
  select v_wedding, trim(r->>'name'), left(trim(coalesce(r->>'group', '')), 40),
         least(greatest(coalesce(nullif(r->>'max_pax', '')::integer, 1), 1), 10)
    from jsonb_array_elements(p_rows) r;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

grant execute on function public.submit_guest_list(text, text, jsonb) to anon, authenticated;
