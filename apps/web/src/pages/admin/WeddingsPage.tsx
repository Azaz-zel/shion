import { useState } from 'react';
import { api, errorText } from '../../lib/api';
import { formatDate } from '../../i18n/lang';
import type { Wedding, WeddingStatus } from '../../lib/types';
import { relativeTime, useLive } from './useLive';

const STATUS: Array<[WeddingStatus, string]> = [
  ['inquiry', 'Permintaan baru'], ['consultation', 'Konsultasi'], ['confirmed', 'Terkonfirmasi'], ['completed', 'Selesai'], ['cancelled', 'Dibatalkan'],
];
const ORDER: WeddingStatus[] = ['inquiry', 'consultation', 'confirmed', 'completed', 'cancelled'];

function Item({ w }: { w: Wedding }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const names = w.couple2 ? `${w.couple1} & ${w.couple2}` : w.contactName;
  return (
    <li className="ad-wed">
      <div>
        <h3>{names}</h3>
        <p className="ad-muted ad-small">{w.code} · masuk {relativeTime(w.createdAt)}</p>
      </div>
      <dl className="ad-wed__facts">
        <div><dt>Tanggal</dt><dd>{formatDate(w.eventDate, 'id', { day: 'numeric', month: 'short', year: 'numeric' })} · {w.session === 'dinner' ? 'malam' : 'siang'}</dd></div>
        <div><dt>Tamu</dt><dd className="ad-num">± {w.guestEstimate}</dd></div>
        <div><dt>Kontak</dt><dd>{w.contactName} · {w.phone}</dd></div>
        {w.notes && <div className="ad-wed__wide"><dt>Catatan</dt><dd>{w.notes}</dd></div>}
      </dl>
      <div>
        <label className="sr-only" htmlFor={`wst-${w.id}`}>Status {w.code}</label>
        <select id={`wst-${w.id}`} className={`ad-status ad-status--${w.status}`} value={w.status} disabled={busy}
          onChange={async (e) => {
            setBusy(true);
            setError('');
            try {
              await api.admin.setWeddingStatus(w.id, e.target.value as WeddingStatus);
            } catch (err) {
              setError(errorText(err));
            } finally {
              setBusy(false);
            }
          }}>
          {STATUS.map(([s, label]) => <option key={s} value={s}>{label}</option>)}
        </select>
        {error && <p className="ad-error ad-small" role="alert">{error}</p>}
      </div>
    </li>
  );
}

export default function WeddingsPage() {
  const live = useLive(() => api.admin.weddings(), []);
  const groups = ORDER.map((s) => [s, (live.data ?? []).filter((w) => w.status === s)] as const).filter(([, list]) => list.length > 0);
  return (
    <main className="ad-main">
      <div className="ad-head">
        <div>
          <h1>Wedding</h1>
          <p className="ad-muted">Permintaan dari situs masuk sebagai “Permintaan baru”. Setelah dikonfirmasi, daftar tamunya bisa dipantau di tab RSVP tamu.</p>
        </div>
      </div>
      {live.error && <p className="ad-error" role="alert">{live.error}</p>}
      {live.loading && !live.data ? <p role="status">Memuat wedding…</p> : groups.length === 0 ? (
        <p className="ad-empty">Belum ada permintaan wedding. Permintaan dari form reservasi di situs muncul di sini.</p>
      ) : groups.map(([status, list]) => (
        <section key={status} className="ad-day">
          <h2>{STATUS.find(([s]) => s === status)![1]} <span className="ad-muted">{list.length}</span></h2>
          <ul className="ad-weds">{list.map((w) => <Item key={w.id} w={w} />)}</ul>
        </section>
      ))}
    </main>
  );
}
