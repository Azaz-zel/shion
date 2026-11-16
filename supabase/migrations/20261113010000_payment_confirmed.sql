-- Admin bisa menandai paket dinner sudah dibayar (transfer atau tunai).
-- Nilai 'paid' terpisah dari 'paid_simulated' supaya pembayaran simulasi demo tetap bisa dibedakan.
alter table public.reservations drop constraint if exists reservations_payment_status_check;
alter table public.reservations add constraint reservations_payment_status_check
  check (payment_status in ('none', 'pending', 'paid', 'paid_simulated'));
