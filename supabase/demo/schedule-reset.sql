-- OPSIONAL, hanya untuk project demo portofolio.
-- Menjadwalkan reset data demo setiap 6 jam dengan pg_cron.
-- Aktifkan dulu extension pg_cron: Dashboard > Database > Extensions > pg_cron.
-- PERINGATAN: reset_demo() menghapus SEMUA reservasi dan wedding. Jangan jalankan di project restoran sungguhan.

select cron.schedule('shion-reset-demo', '0 */6 * * *', $$select public.reset_demo()$$);

-- Untuk menghentikan jadwal:
-- select cron.unschedule('shion-reset-demo');
