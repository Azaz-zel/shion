import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, errorText } from '../../lib/api';
import { formatDate } from '../../i18n/lang';
import { addDaysISO, todayISO } from '../../lib/validation';
import type { Reservation } from '../../lib/types';
import { STATUS } from './ReservationsPage';
import { coupleName, guestListChat, reservationChat, useLive, waLink } from './useLive';

const TICKS = 24;
const STATUS_LABEL = Object.fromEntries(STATUS);
const dayDiff = (from: string, to: string) => Math.round((new Date(to + 'T00:00:00').getTime() - new Date(from + 'T00:00:00').getTime()) / 86400000);
const shortDate = (iso: string) => formatDate(iso, 'id', { day: 'numeric', month: 'short' });
const hour = (r: Reservation) => r.time.replace(':', '.');

async function load() {
  const [reservations, weddings] = await Promise.all([api.admin.reservations(), api.admin.weddings()]);
  const confirmed = weddings.filter((w) => w.status === 'confirmed' && w.eventDate >= todayISO());
  const guests = await Promise.all(confirmed.map((w) => api.admin.guests(w.id)));
  return { reservations, weddings, upcoming: confirmed.map((wedding, i) => ({ wedding, guests: guests[i] })) };
}

export default function DashboardPage({ email }: { email: string }) {
  const live = useLive(load, []);
  const [error, setError] = useState('');

  if (!live.data) {
    return (
      <main className="ad-main">
        {live.loading ? <p role="status">Memuat dashboard…</p> : <><p className="ad-error" role="alert">{live.error}</p><button className="ad-btn" type="button" onClick={live.reload}>Coba lagi</button></>}
      </main>
    );
  }

  const { reservations, weddings, upcoming } = live.data;
  const today = todayISO();
  const active = reservations.filter((r) => r.status !== 'cancelled' && r.status !== 'no_show');
  const todays = active.filter((r) => r.date === today);
  const todayPax = todays.reduce((n, r) => n + r.pax, 0);
  const pending = reservations.filter((r) => r.date >= today && r.status === 'pending');
  const unpaid = active.filter((r) => r.date >= today && r.paymentStatus === 'pending' && r.status !== 'pending');
  const inquiries = weddings.filter((w) => w.status === 'inquiry');
  const noGuests = upcoming.filter((u) => u.guests.length === 0);
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = addDaysISO(today, i);
    return { date, pax: active.filter((r) => r.date === date).reduce((n, r) => n + r.pax, 0), closed: new Date(date + 'T00:00:00').getDay() === 1 };
  });
  const peak = Math.max(1, ...week.map((d) => d.pax));
  const next = upcoming[0];
  const answered = next ? next.guests.filter((g) => g.rsvpStatus !== 'pending').length : 0;
  const todoCount = pending.length + unpaid.length + inquiries.length + noGuests.length;

  async function run(action: () => Promise<void>) {
    setError('');
    try {
      await action();
    } catch (err) {
      setError(errorText(err));
    }
  }

  return (
    <main className="ad-main">
      <section className="ad-hero">
        <div>
          <h1>Hari ini <em>{todays.length} reservasi</em>, {todayPax} tamu</h1>
          <p className="ad-muted">
            {pending.length > 0 ? `${pending.length} reservasi menunggu konfirmasi.` : 'Semua reservasi sudah dikonfirmasi.'}
            {next && ` Wedding berikutnya ${dayDiff(today, next.wedding.eventDate)} hari lagi.`}
          </p>
          <p className="ad-muted ad-small">{formatDate(today, 'id')} · {email}</p>
        </div>
        <Link className="ad-pillbtn" to="/admin/reservasi">Buka reservasi</Link>
      </section>
      {(error || live.error) && <p className="ad-error" role="alert">{error || live.error}</p>}

      <div className="ad-dash">
        <div className="ad-dash__col">
          <ul className="ad-stats">
            <li><Link className="ad-stat" to="/admin/reservasi"><span>Reservasi hari ini</span><strong className="ad-num">{todays.length}</strong></Link></li>
            <li><Link className="ad-stat" to="/admin/reservasi"><span>Tamu hari ini</span><strong className="ad-num">{todayPax}</strong></Link></li>
            <li><Link className={`ad-stat${pending.length ? ' ad-stat--attn' : ''}`} to="/admin/reservasi"><span>Menunggu konfirmasi</span><strong className="ad-num">{pending.length}</strong></Link></li>
            <li><Link className="ad-stat" to="/admin/wedding"><span>Wedding mendatang</span><strong className="ad-num">{upcoming.length}</strong></Link></li>
          </ul>

          <section className="ad-card" aria-labelledby="ad-week-t">
            <h2 id="ad-week-t">7 hari ke depan</h2>
            <p className="ad-muted ad-small">Jumlah tamu dari reservasi yang tidak dibatalkan. Untuk menyiapkan staf dan bahan.</p>
            <ol className="ad-week">
              {week.map((d) => (
                <li key={d.date} className={d.date === today ? 'is-today' : ''}>
                  <span className="ad-num">{d.closed ? 'tutup' : d.pax}</span>
                  <span className="ad-week__bar" aria-hidden="true"><span style={{ height: `${(d.pax / peak) * 100}%` }} /></span>
                  <span className="ad-small">{formatDate(d.date, 'id', { weekday: 'short' })} {Number(d.date.slice(8))}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="ad-card" aria-labelledby="ad-today-t">
            <h2 id="ad-today-t">Agenda hari ini</h2>
            {todays.length === 0 ? <p className="ad-muted">Belum ada reservasi untuk hari ini.</p> : (
              <ul className="ad-rows">
                {todays.map((r) => (
                  <li key={r.id}>
                    <strong className="ad-num">{hour(r)}</strong>
                    <p>{r.guestName} · {r.pax} orang{r.notes && <span className="ad-muted"> · {r.notes}</span>}</p>
                    <span className={`ad-pill ad-pill--${r.status}`}>{STATUS_LABEL[r.status]}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="ad-dash__col">
          <section className="ad-todosec" aria-labelledby="ad-todo-t">
            <h2 id="ad-todo-t">Perlu tindakan{todoCount > 0 && <span className="ad-new">{todoCount}</span>}</h2>
            {todoCount === 0 ? <p className="ad-muted">Tidak ada yang menunggu. Semua sudah ditangani.</p> : (
              <ul className="ad-todo">
                {pending.slice(0, 5).map((r) => (
                  <li key={r.id}>
                    <p className="ad-tag">Reservasi</p>
                    <p><strong>{r.guestName}</strong> menunggu konfirmasi</p>
                    <p className="ad-muted ad-small">{shortDate(r.date)} · {hour(r)} · {r.pax} orang · {r.code}</p>
                    <div className="ad-actions">
                      <button type="button" className="ad-link ad-link--primary" aria-label={`Konfirmasi ${r.guestName}`} onClick={() => run(() => api.admin.setReservationStatus(r.id, 'confirmed'))}>Konfirmasi</button>
                      <a className="ad-link" aria-label={`WhatsApp ${r.guestName}`} href={reservationChat(r)} target="_blank" rel="noreferrer">WhatsApp</a>
                    </div>
                  </li>
                ))}
                {pending.length > 5 && <li><Link className="ad-link" to="/admin/reservasi">{pending.length - 5} reservasi lain menunggu</Link></li>}
                {unpaid.map((r) => (
                  <li key={r.id}>
                    <p className="ad-tag">Pembayaran</p>
                    <p><strong>{r.guestName}</strong> belum membayar paket dinner</p>
                    <p className="ad-muted ad-small">{shortDate(r.date)} · {hour(r)} · {r.code}</p>
                    <div className="ad-actions">
                      <button type="button" className="ad-link ad-link--primary" aria-label={`Tandai lunas ${r.guestName}`} onClick={() => run(() => api.admin.confirmPayment(r.id))}>Tandai lunas</button>
                      <a className="ad-link" aria-label={`WhatsApp ${r.guestName}`} href={reservationChat(r)} target="_blank" rel="noreferrer">WhatsApp</a></div>
                  </li>
                ))}
                {inquiries.map((w) => (
                  <li key={w.id}>
                    <p className="ad-tag">Wedding</p>
                    <p><strong>{w.contactName}</strong> meminta wedding</p>
                    <p className="ad-muted ad-small">{shortDate(w.eventDate)} · ± {w.guestEstimate} tamu · {w.code}</p>
                    <div className="ad-actions">
                      <Link className="ad-link ad-link--primary" aria-label={`Tinjau wedding ${w.contactName}`} to="/admin/wedding">Tinjau</Link>
                      <a className="ad-link" aria-label={`WhatsApp ${w.contactName}`} href={waLink(w.phone, `Halo ${w.contactName}, terima kasih atas permintaan wedding ${w.code}.`)} target="_blank" rel="noreferrer">WhatsApp</a>
                    </div>
                  </li>
                ))}
                {noGuests.map(({ wedding: w }) => (
                  <li key={w.id}>
                    <p className="ad-tag">Daftar tamu</p>
                    <p>Belum ada tamu untuk <strong>{coupleName(w)}</strong></p>
                    <p className="ad-muted ad-small">{shortDate(w.eventDate)} · {dayDiff(today, w.eventDate)} hari lagi</p>
                    <div className="ad-actions">
                      <a className="ad-link ad-link--primary" aria-label={`Kirim link undangan ke ${w.contactName}`} href={guestListChat(w)} target="_blank" rel="noreferrer">Kirim link undangan</a>
                      <Link className="ad-link" to="/admin/rsvp">Buka daftar tamu</Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="ad-card" aria-labelledby="ad-next-t">
            <h2 id="ad-next-t">Wedding berikutnya</h2>
            {!next ? <p className="ad-muted">Belum ada wedding terkonfirmasi.</p> : (
              <>
                <p><strong>{coupleName(next.wedding)}</strong><br /><span className="ad-muted ad-small">{formatDate(next.wedding.eventDate, 'id')} · sesi {next.wedding.session === 'dinner' ? 'malam' : 'siang'}</span></p>
                <div className="ad-ticks" role="img" aria-label={`${answered} dari ${next.guests.length} undangan sudah menjawab`}>
                  {Array.from({ length: TICKS }, (_, i) => <span key={i} className={next.guests.length > 0 && i < Math.round((answered / next.guests.length) * TICKS) ? 'on' : ''} />)}
                </div>
                <ul className="ad-kv">
                  <li><span>Sudah menjawab</span><strong>{answered} / {next.guests.length}</strong></li>
                  <li><span>Orang yang hadir</span><strong>{next.guests.filter((g) => g.rsvpStatus === 'attending').reduce((n, g) => n + g.rsvpPax, 0)}</strong></li>
                  <li><span>Sudah check-in</span><strong>{next.guests.reduce((n, g) => n + g.checkedInPax, 0)}</strong></li>
                </ul>
                <Link className="ad-link" to="/admin/rsvp">Buka tamu undangan</Link>
              </>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}
