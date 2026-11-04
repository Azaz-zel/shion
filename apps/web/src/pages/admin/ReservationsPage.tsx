import { useMemo, useState } from 'react';
import { api, errorText } from '../../lib/api';
import { formatDate } from '../../i18n/lang';
import { todayISO } from '../../lib/validation';
import type { Reservation, ReservationStatus } from '../../lib/types';
import { relativeTime, useLive } from './useLive';

const STATUS: Array<[ReservationStatus, string]> = [
  ['pending', 'Menunggu'], ['confirmed', 'Terkonfirmasi'], ['seated', 'Sedang bersantap'],
  ['completed', 'Selesai'], ['cancelled', 'Dibatalkan'], ['no_show', 'Tidak datang'],
];
const PKG: Record<string, string> = { ume: 'Paket Ume', take: 'Paket Take', matsu: 'Paket Matsu' };
const PAY: Record<Reservation['paymentStatus'], string> = { none: '', pending: 'belum bayar', paid_simulated: 'lunas (demo)' };

function Row({ r }: { r: Reservation }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return (
    <tr>
      <td className="ad-num">{r.time.replace(':', '.')}</td>
      <td><strong>{r.guestName}</strong><br /><span className="ad-muted ad-small">{r.code} · {r.phone}</span></td>
      <td>{r.type === 'table' ? 'Meja à la carte' : PKG[r.packageCode ?? '']}{PAY[r.paymentStatus] && <><br /><span className="ad-muted ad-small">{PAY[r.paymentStatus]}</span></>}</td>
      <td className="ad-num">{r.pax}</td>
      <td className="ad-msg">{r.notes || <span className="ad-muted">–</span>}</td>
      <td>
        <label className="sr-only" htmlFor={`st-${r.id}`}>Status {r.code}</label>
        <select id={`st-${r.id}`} className={`ad-status ad-status--${r.status}`} value={r.status} disabled={busy}
          onChange={async (e) => {
            setBusy(true);
            setError('');
            try {
              await api.admin.setReservationStatus(r.id, e.target.value as ReservationStatus);
            } catch (err) {
              setError(errorText(err));
            } finally {
              setBusy(false);
            }
          }}>
          {STATUS.map(([s, label]) => <option key={s} value={s}>{label}</option>)}
        </select>
        {error && <p className="ad-error ad-small" role="alert">{error}</p>}
      </td>
      <td className="ad-small ad-muted">{relativeTime(r.createdAt)}</td>
    </tr>
  );
}

export default function ReservationsPage() {
  const live = useLive(() => api.admin.reservations(), []);
  const [show, setShow] = useState<'upcoming' | 'past'>('upcoming');
  const today = todayISO();
  const groups = useMemo(() => {
    const list = (live.data ?? []).filter((r) => (show === 'upcoming' ? r.date >= today : r.date < today));
    if (show === 'past') list.reverse();
    const map = new Map<string, Reservation[]>();
    list.forEach((r) => map.set(r.date, [...(map.get(r.date) ?? []), r]));
    return [...map.entries()];
  }, [live.data, show, today]);

  const todays = (live.data ?? []).filter((r) => r.date === today && r.status !== 'cancelled');
  const pending = (live.data ?? []).filter((r) => r.date >= today && r.status === 'pending');

  return (
    <main className="ad-main">
      <div className="ad-head">
        <div>
          <h1>Reservasi</h1>
          <p className="ad-muted">Meja à la carte dan paket dinner. Ubah status langsung dari daftar.</p>
        </div>
        <div className="ad-chips" role="group" aria-label="Periode">
          <button type="button" aria-pressed={show === 'upcoming'} onClick={() => setShow('upcoming')}>Hari ini & mendatang</button>
          <button type="button" aria-pressed={show === 'past'} onClick={() => setShow('past')}>Sudah lewat</button>
        </div>
      </div>
      {live.data && (
        <p className="ad-summary__lead">
          <strong>Hari ini {todays.length} reservasi, {todays.reduce((n, r) => n + r.pax, 0)} orang.</strong>{' '}
          {pending.length > 0 ? <span className="ad-attn">{pending.length} menunggu konfirmasi.</span> : <span className="ad-muted">Tidak ada yang menunggu konfirmasi.</span>}
        </p>
      )}
      {live.error && <p className="ad-error" role="alert">{live.error}</p>}
      {live.loading && !live.data ? <p role="status">Memuat reservasi…</p> : groups.length === 0 ? (
        <p className="ad-empty">{show === 'upcoming' ? 'Belum ada reservasi untuk hari ini dan seterusnya. Reservasi dari situs muncul di sini secara otomatis.' : 'Belum ada reservasi yang sudah lewat.'}</p>
      ) : groups.map(([date, rows]) => (
        <section key={date} className="ad-day" aria-label={formatDate(date, 'id')}>
          <h2>{date === today ? 'Hari ini · ' : ''}{formatDate(date, 'id')} <span className="ad-muted">{rows.length} reservasi · {rows.filter((r) => r.status !== 'cancelled').reduce((n, r) => n + r.pax, 0)} orang</span></h2>
          <div className="ad-tablewrap">
            <table className="ad-table">
              <thead><tr><th scope="col">Jam</th><th scope="col">Pemesan</th><th scope="col">Jenis</th><th scope="col">Orang</th><th scope="col">Catatan</th><th scope="col">Status</th><th scope="col">Masuk</th></tr></thead>
              <tbody>{rows.map((r) => <Row key={r.id} r={r} />)}</tbody>
            </table>
          </div>
        </section>
      ))}
    </main>
  );
}
