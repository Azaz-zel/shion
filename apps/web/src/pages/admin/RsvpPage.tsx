import { useMemo, useState } from 'react';
import { api } from '../../lib/api';
import { formatDate } from '../../i18n/lang';
import { inviteCopy } from '../../content/invitation';
import { todayISO } from '../../lib/validation';
import type { DietCode, Guest, RsvpStatus, Wedding } from '../../lib/types';
import { copyText, relativeTime, useLive } from './useLive';

type Filter = 'all' | RsvpStatus;
const FILTERS: Array<[Filter, string]> = [['all', 'Semua'], ['attending', 'Hadir'], ['declined', 'Tidak hadir'], ['pending', 'Belum menjawab']];
const STATUS_LABEL: Record<RsvpStatus, string> = { attending: 'Hadir', declined: 'Tidak hadir', pending: 'Belum menjawab' };
const DIET = inviteCopy.id.diets;

function inviteUrl(w: Wedding, g: Guest) {
  return `${location.origin}/w/${w.slug}?t=${encodeURIComponent(g.token)}`;
}

function whatsappText(w: Wedding, g: Guest) {
  const date = formatDate(w.eventDate, 'id');
  return `Halo ${g.name}, dengan bahagia kami mengundang Anda ke pernikahan kami, ${w.couple1} & ${w.couple2}, pada ${date} di Shion, Jakarta Selatan. Undangan dan RSVP: ${inviteUrl(w, g)}`;
}

function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle');
  return (
    <button type="button" className="ad-link" onClick={async () => { setState((await copyText(text)) ? 'ok' : 'fail'); setTimeout(() => setState('idle'), 2000); }}>
      {state === 'ok' ? 'Tersalin' : state === 'fail' ? 'Salin manual' : 'Salin link'}
    </button>
  );
}

function Summary({ guests }: { guests: Guest[] }) {
  const by = (s: RsvpStatus) => guests.filter((g) => g.rsvpStatus === s);
  const att = by('attending');
  const dec = by('declined');
  const pen = by('pending');
  const pax = att.reduce((n, g) => n + g.rsvpPax, 0);
  const invitedPax = guests.reduce((n, g) => n + g.maxPax, 0);
  const pct = (n: number) => `${guests.length ? (n / guests.length) * 100 : 0}%`;
  return (
    <section className="ad-summary" aria-label="Ringkasan RSVP">
      <p className="ad-summary__lead">
        <strong>{pax} orang</strong> akan hadir dari {att.length} undangan.{' '}
        <span className="ad-muted">{guests.length - pen.length} dari {guests.length} undangan sudah menjawab · kursi maksimal {invitedPax}</span>
      </p>
      <div className="ad-bar" role="img" aria-label={`Hadir ${att.length}, tidak hadir ${dec.length}, belum menjawab ${pen.length} undangan`}>
        <span className="ad-bar__att" style={{ width: pct(att.length) }} />
        <span className="ad-bar__dec" style={{ width: pct(dec.length) }} />
        <span className="ad-bar__pen" style={{ width: pct(pen.length) }} />
      </div>
      <ul className="ad-legend">
        <li><span className="ad-dot ad-dot--att" />Hadir {att.length}</li>
        <li><span className="ad-dot ad-dot--dec" />Tidak hadir {dec.length}</li>
        <li><span className="ad-dot ad-dot--pen" />Belum menjawab {pen.length}</li>
      </ul>
    </section>
  );
}

function Kitchen({ guests }: { guests: Guest[] }) {
  const att = guests.filter((g) => g.rsvpStatus === 'attending');
  const counts = (Object.keys(DIET) as DietCode[]).map((d) => [d, att.filter((g) => g.dietary.includes(d)).reduce((n, g) => n + g.rsvpPax, 0)] as const);
  const notes = att.filter((g) => g.dietaryNote);
  return (
    <section className="ad-card" aria-labelledby="ad-kitchen">
      <h2 id="ad-kitchen">Untuk dapur</h2>
      <p className="ad-muted ad-small">Dihitung per orang dari undangan yang hadir. Jumlah bisa tumpang tindih.</p>
      <ul className="ad-kv">
        {counts.map(([d, n]) => <li key={d}><span>{DIET[d]}</span><strong>{n}</strong></li>)}
      </ul>
      {notes.length > 0 && (
        <>
          <h3>Catatan khusus</h3>
          <ul className="ad-notes">{notes.map((g) => <li key={g.id}><strong>{g.name}</strong> · {g.dietaryNote}</li>)}</ul>
        </>
      )}
    </section>
  );
}

function Recent({ guests }: { guests: Guest[] }) {
  const recent = guests.filter((g) => g.respondedAt).sort((a, b) => b.respondedAt!.localeCompare(a.respondedAt!)).slice(0, 5);
  return (
    <section className="ad-card" aria-labelledby="ad-recent">
      <h2 id="ad-recent">Jawaban terbaru</h2>
      {recent.length === 0 ? <p className="ad-muted">Belum ada tamu yang menjawab. Kirim link undangan dari daftar tamu.</p> : (
        <ol className="ad-feed">
          {recent.map((g) => (
            <li key={g.id}>
              <p><strong>{g.name}</strong> <span className={`ad-pill ad-pill--${g.rsvpStatus}`}>{STATUS_LABEL[g.rsvpStatus]}{g.rsvpStatus === 'attending' ? ` · ${g.rsvpPax}` : ''}</span></p>
              {g.message && <p className="ad-quote">“{g.message}”</p>}
              <p className="ad-muted ad-small">{relativeTime(g.respondedAt)}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default function RsvpPage() {
  const weddings = useLive(() => api.admin.weddings(), []);
  const eligible = useMemo(() => (weddings.data ?? []).filter((w) => w.status === 'confirmed' || w.status === 'completed'), [weddings.data]);
  const [picked, setPicked] = useState('');
  const wedding = eligible.find((w) => w.id === picked) ?? eligible.find((w) => w.eventDate >= todayISO()) ?? eligible[0];
  const guests = useLive(() => (wedding ? api.admin.guests(wedding.id) : Promise.resolve([] as Guest[])), [wedding?.id]);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (guests.data ?? [])
      .filter((g) => filter === 'all' || g.rsvpStatus === filter)
      .filter((g) => !q || g.name.toLowerCase().includes(q) || g.groupLabel.toLowerCase().includes(q))
      .sort((a, b) => (b.respondedAt ?? '').localeCompare(a.respondedAt ?? '') || a.name.localeCompare(b.name));
  }, [guests.data, filter, query]);

  if (weddings.loading && !weddings.data) return <main className="ad-main"><p role="status">Memuat daftar wedding…</p></main>;
  if (weddings.error && !weddings.data) return <main className="ad-main"><p className="ad-error" role="alert">{weddings.error}</p><button className="ad-btn" type="button" onClick={weddings.reload}>Coba lagi</button></main>;
  if (!wedding) {
    return (
      <main className="ad-main">
        <h1>RSVP tamu</h1>
        <p className="ad-muted">Belum ada wedding terkonfirmasi. Konfirmasi permintaan di tab Wedding, lalu daftar tamunya muncul di sini.</p>
      </main>
    );
  }

  const all = guests.data ?? [];
  const isNew = (g: Guest) => !!g.respondedAt && Date.now() - new Date(g.respondedAt).getTime() < 15 * 60_000;
  const days = Math.round((new Date(wedding.eventDate + 'T00:00:00').getTime() - new Date(todayISO() + 'T00:00:00').getTime()) / 86400000);

  return (
    <main className="ad-main">
      <div className="ad-head">
        <div>
          <h1>RSVP tamu</h1>
          <p className="ad-muted">
            {formatDate(wedding.eventDate, 'id')} · sesi {wedding.session === 'dinner' ? 'malam' : 'siang'} · {days >= 0 ? `${days} hari lagi` : 'sudah lewat'}
          </p>
        </div>
        <label className="ad-field ad-field--inline"><span>Wedding</span>
          <select id="ad-wedding" value={wedding.id} onChange={(e) => setPicked(e.target.value)}>
            {eligible.map((w) => <option key={w.id} value={w.id}>{w.couple1} & {w.couple2} · {w.code}</option>)}
          </select>
        </label>
      </div>
      <p className="ad-live" aria-live="polite">
        <span className="ad-live__dot" aria-hidden="true" />
        Diperbarui otomatis{guests.updatedAt ? ` · terakhir ${guests.updatedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : ''}
      </p>

      {guests.error && <p className="ad-error" role="alert">{guests.error}</p>}
      {guests.loading && !guests.data ? <p role="status">Memuat tamu…</p> : (
        <>
          <Summary guests={all} />
          <div className="ad-grid">
            <section className="ad-guests" aria-labelledby="ad-guests-t">
              <div className="ad-toolbar">
                <h2 id="ad-guests-t">Daftar tamu</h2>
                <div className="ad-chips" role="group" aria-label="Saring">
                  {FILTERS.map(([f, label]) => (
                    <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                      {label} <span className="ad-muted">{f === 'all' ? all.length : all.filter((g) => g.rsvpStatus === f).length}</span>
                    </button>
                  ))}
                </div>
                <label className="ad-search"><span className="sr-only">Cari tamu</span>
                  <input id="ad-search" type="search" placeholder="Cari nama atau grup" value={query} onChange={(e) => setQuery(e.target.value)} />
                </label>
              </div>
              {list.length === 0 ? (
                <p className="ad-empty">{all.length === 0 ? 'Belum ada tamu untuk wedding ini. Tambahkan daftar tamu lewat impor CSV (segera hadir).' : 'Tidak ada tamu yang cocok dengan saringan ini.'}</p>
              ) : (
                <div className="ad-tablewrap">
                  <table className="ad-table">
                    <thead>
                      <tr><th scope="col">Tamu</th><th scope="col">Jawaban</th><th scope="col">Orang</th><th scope="col">Pantangan</th><th scope="col">Ucapan</th><th scope="col">Dijawab</th><th scope="col">Undangan</th></tr>
                    </thead>
                    <tbody>
                      {list.map((g) => (
                        <tr key={g.id} className={isNew(g) ? 'is-new' : ''}>
                          <td><strong>{g.name}</strong>{isNew(g) && <span className="ad-new">Baru</span>}<br /><span className="ad-muted ad-small">{g.groupLabel}{g.tableNo ? ` · meja ${g.tableNo}` : ''}</span></td>
                          <td><span className={`ad-pill ad-pill--${g.rsvpStatus}`}>{STATUS_LABEL[g.rsvpStatus]}</span></td>
                          <td className="ad-num">{g.rsvpStatus === 'attending' ? g.rsvpPax : '–'} <span className="ad-muted">/ {g.maxPax}</span></td>
                          <td>{g.dietary.map((d) => DIET[d]).concat(g.dietaryNote ? [g.dietaryNote] : []).join(', ') || <span className="ad-muted">–</span>}</td>
                          <td className="ad-msg">{g.message || <span className="ad-muted">–</span>}</td>
                          <td className="ad-small">{g.respondedAt ? relativeTime(g.respondedAt) : <span className="ad-muted">belum</span>}</td>
                          <td>
                            <div className="ad-actions">
                              <CopyButton text={inviteUrl(wedding, g)} />
                              <a className="ad-link" href={`https://wa.me/?text=${encodeURIComponent(whatsappText(wedding, g))}`} target="_blank" rel="noreferrer">WhatsApp</a>
                              <a className="ad-link" href={inviteUrl(wedding, g)} target="_blank" rel="noreferrer">Buka</a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
            <aside className="ad-side">
              <Kitchen guests={all} />
              <Recent guests={all} />
            </aside>
          </div>
        </>
      )}
    </main>
  );
}
