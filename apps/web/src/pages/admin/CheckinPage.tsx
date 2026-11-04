import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { api, errorText } from '../../lib/api';
import { inviteCopy } from '../../content/invitation';
import { todayISO } from '../../lib/validation';
import { UserError, type CheckInResult, type Guest } from '../../lib/types';
import { useLive } from './useLive';

const DIET = inviteCopy.id.diets;
const QUEUE_KEY = 'shion-checkin-queue';

interface Queued { weddingId: string; token?: string; guestId?: string; label: string; at: string }

function readQueue(): Queued[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]') as Queued[];
  } catch {
    return [];
  }
}
function writeQueue(q: Queued[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
  } catch {
    /* tanpa penyimpanan, antrean hanya di memori */
  }
}

/** Isi QR undangan: "SHION:<token>". Link undangan (…?t=<token>) juga diterima. */
export function tokenFromQr(text: string): string | null {
  if (text.startsWith('SHION:')) return text.slice(6).trim() || null;
  try {
    return new URL(text).searchParams.get('t');
  } catch {
    return null;
  }
}

function Scanner({ onToken, paused }: { onToken: (token: string | null) => void; paused: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<'off' | 'starting' | 'on' | 'denied' | 'unsupported'>('off');
  const stream = useRef<MediaStream | null>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const stop = useCallback(() => {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    setState('off');
  }, []);

  useEffect(() => stop, [stop]);

  useEffect(() => {
    if (state !== 'on') return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const v = video.current;
      if (!v || !ctx || pausedRef.current || now - last < 180 || v.readyState < 2) return;
      last = now;
      const w = 480;
      const h = Math.round((v.videoHeight / v.videoWidth) * w) || 480;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(v, 0, 0, w, h);
      const code = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'dontInvert' });
      if (code?.data) onToken(tokenFromQr(code.data));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state, onToken]);

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia) return setState('unsupported');
    setState('starting');
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      if (video.current) {
        video.current.srcObject = stream.current;
        await video.current.play();
      }
      setState('on');
    } catch {
      setState('denied');
    }
  }

  return (
    <div className="ck-scan">
      <div className="ck-scan__view">
        <video ref={video} muted playsInline aria-label="Kamera untuk memindai QR" hidden={state !== 'on' && state !== 'starting'} />
        {state === 'on' && <div className="ck-scan__frame" aria-hidden="true" />}
        {state !== 'on' && state !== 'starting' && (
          <p className="ck-scan__msg">
            {state === 'denied' ? 'Akses kamera ditolak. Izinkan kamera di pengaturan browser, atau cari nama tamu di bawah.'
              : state === 'unsupported' ? 'Browser ini tidak bisa membuka kamera. Cari nama tamu di bawah.'
              : 'Arahkan kamera ke QR di undangan tamu.'}
          </p>
        )}
      </div>
      {state === 'on' ? (
        <button type="button" className="ck-btn ck-btn--ghost" onClick={stop}>Matikan kamera</button>
      ) : (
        <button type="button" className="ck-btn" onClick={start} disabled={state === 'starting'}>{state === 'starting' ? 'Membuka kamera…' : 'Pindai QR'}</button>
      )}
    </div>
  );
}

type Shown = { kind: 'result'; r: CheckInResult } | { kind: 'queued'; label: string } | { kind: 'error'; message: string } | null;

function ResultCard({ shown }: { shown: Shown }) {
  if (!shown) return <p className="ck-muted">Belum ada scan. Hasil scan muncul di sini.</p>;
  if (shown.kind === 'queued') return <div className="ck-card ck-card--warn" role="status"><h2>Tersimpan di perangkat</h2><p>Check-in {shown.label} dikirim otomatis begitu koneksi kembali.</p></div>;
  if (shown.kind === 'error') return <div className="ck-card ck-card--bad" role="alert"><h2>Gagal</h2><p>{shown.message}</p></div>;
  const r = shown.r;
  if (r.status === 'invalid') return <div className="ck-card ck-card--bad" role="alert"><h2>QR tidak dikenali</h2><p>QR ini bukan undangan Shion yang valid. Cari nama tamu secara manual di bawah.</p></div>;
  if (r.status === 'other_event') return <div className="ck-card ck-card--bad" role="alert"><h2>Undangan acara lain</h2><p>QR ini milik tamu wedding lain. Periksa tanggal di undangan tamu.</p></div>;
  const g = r.guest;
  const diet = g.dietary.map((d) => DIET[d]).concat(g.dietaryNote ? [g.dietaryNote] : []).join(', ');
  if (r.status === 'already') {
    return (
      <div className="ck-card ck-card--warn" role="alert">
        <h2>{g.name} sudah check-in</h2>
        <p>Tercatat pukul {new Date(g.checkedInAt!).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} untuk {g.checkedInPax} orang. QR tidak bisa dipakai dua kali.</p>
      </div>
    );
  }
  return (
    <div className="ck-card ck-card--ok" role="status">
      <p className="ck-muted">Selamat datang</p>
      <h2>{g.name}</h2>
      <dl>
        <div><dt>Tamu</dt><dd>{g.checkedInPax} orang</dd></div>
        <div><dt>Meja</dt><dd>{g.tableNo || 'belum diatur'}{g.groupLabel ? ` · ${g.groupLabel}` : ''}</dd></div>
        <div><dt>Diet</dt><dd>{diet || 'tidak ada catatan'}</dd></div>
        {g.rsvpStatus !== 'attending' && <div><dt>RSVP</dt><dd className="ck-attn">{g.rsvpStatus === 'pending' ? 'Belum RSVP' : 'Sebelumnya menjawab tidak hadir'}</dd></div>}
      </dl>
    </div>
  );
}

export default function CheckinPage() {
  const weddings = useLive(() => api.admin.weddings(), []);
  const today = todayISO();
  const options = useMemo(() => (weddings.data ?? []).filter((w) => w.status === 'confirmed'), [weddings.data]);
  const [picked, setPicked] = useState('');
  const wedding = options.find((w) => w.id === picked) ?? options.find((w) => w.eventDate >= today) ?? options[0];
  const cacheKey = wedding ? `shion-checkin-cache-${wedding.id}` : '';
  const guests = useLive(() => (wedding ? api.admin.guests(wedding.id) : Promise.resolve([] as Guest[])), [wedding?.id]);
  const [cached, setCached] = useState<Guest[]>([]);
  const [shown, setShown] = useState<Shown>(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [queue, setQueue] = useState<Queued[]>(readQueue);
  const lastScan = useRef({ token: '', at: 0 });

  // Simpan daftar tamu di perangkat supaya pencarian nama tetap jalan saat sinyal hilang.
  useEffect(() => {
    if (!cacheKey) return;
    if (guests.data) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(guests.data));
      } catch {
        /* abaikan */
      }
    } else {
      try {
        setCached(JSON.parse(localStorage.getItem(cacheKey) ?? '[]') as Guest[]);
      } catch {
        setCached([]);
      }
    }
  }, [guests.data, cacheKey]);

  const list = guests.data ?? cached;

  const flush = useCallback(async () => {
    const q = readQueue();
    if (q.length === 0) return;
    const rest: Queued[] = [];
    for (const item of q) {
      try {
        await api.admin.checkIn(item.weddingId, { token: item.token, guestId: item.guestId });
      } catch (e) {
        if (!(e instanceof UserError)) rest.push(item);
      }
    }
    writeQueue(rest);
    setQueue(rest);
  }, []);

  useEffect(() => {
    void flush();
    window.addEventListener('online', flush);
    const id = window.setInterval(flush, 20_000);
    return () => {
      window.removeEventListener('online', flush);
      window.clearInterval(id);
    };
  }, [flush]);

  const run = useCallback(async (by: { token?: string; guestId?: string }, label: string) => {
    if (!wedding) return;
    setBusy(true);
    try {
      const r = await api.admin.checkIn(wedding.id, by);
      setShown({ kind: 'result', r });
      if (r.status === 'ok') navigator.vibrate?.(80);
    } catch (e) {
      if (e instanceof UserError) setShown({ kind: 'error', message: e.message });
      else {
        const q = [...readQueue(), { weddingId: wedding.id, ...by, label, at: new Date().toISOString() }];
        writeQueue(q);
        setQueue(q);
        setShown({ kind: 'queued', label });
      }
    } finally {
      setBusy(false);
    }
  }, [wedding]);

  const onToken = useCallback((token: string | null) => {
    const now = Date.now();
    const key = token ?? 'invalid';
    if (lastScan.current.token === key && now - lastScan.current.at < 4000) return;
    lastScan.current = { token: key, at: now };
    if (!token) return setShown({ kind: 'result', r: { status: 'invalid' } });
    void run({ token }, 'tamu');
  }, [run]);

  if (weddings.loading && !weddings.data) return <main className="ck"><p role="status">Memuat…</p></main>;
  if (weddings.error && !weddings.data) return <main className="ck"><p className="ck-card ck-card--bad" role="alert">{weddings.error}</p></main>;
  if (!wedding) return <main className="ck"><h1>Check-in</h1><p className="ck-muted">Belum ada wedding terkonfirmasi.</p></main>;

  const attending = list.filter((g) => g.rsvpStatus === 'attending');
  const expected = attending.reduce((n, g) => n + g.rsvpPax, 0);
  const arrived = list.reduce((n, g) => n + (g.checkedInAt ? g.checkedInPax : 0), 0);
  const q = query.trim().toLowerCase();
  const matches = q ? list.filter((g) => g.name.toLowerCase().includes(q)).slice(0, 8) : [];

  return (
    <main className="ck">
      <div className="ck-head">
        <div>
          <h1>{wedding.couple1} &amp; {wedding.couple2}</h1>
          <p className="ck-muted">{wedding.eventDate === today ? 'Hari ini' : new Date(wedding.eventDate + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} · {wedding.code}</p>
        </div>
        {options.length > 1 && (
          <label className="ck-field"><span className="sr-only">Pilih wedding</span>
            <select id="ck-wedding" value={wedding.id} onChange={(e) => { setPicked(e.target.value); setShown(null); }}>
              {options.map((w) => <option key={w.id} value={w.id}>{w.couple1} & {w.couple2}</option>)}
            </select>
          </label>
        )}
      </div>

      <section className="ck-count" aria-live="polite">
        <p><strong>{arrived}</strong> dari {expected} tamu sudah datang</p>
        <div className="ck-bar" aria-hidden="true"><span style={{ width: `${expected ? Math.min(100, (arrived / expected) * 100) : 0}%` }} /></div>
        {!guests.data && cached.length > 0 && <p className="ck-attn">Offline: memakai daftar tamu yang tersimpan di perangkat.</p>}
        {queue.length > 0 && <p className="ck-attn">{queue.length} check-in menunggu dikirim.</p>}
      </section>

      <Scanner onToken={onToken} paused={busy} />
      <section className="ck-result" aria-label="Hasil check-in"><ResultCard shown={shown} /></section>

      <section className="ck-search">
        <label htmlFor="ck-q">HP tamu mati? Cari nama</label>
        <input id="ck-q" type="search" placeholder="Ketik nama tamu" value={query} onChange={(e) => setQuery(e.target.value)} />
        {q && (
          <ul>
            {matches.length === 0 && <li className="ck-muted">Tidak ada tamu dengan nama itu. Periksa ejaan atau hubungi koordinator.</li>}
            {matches.map((g) => (
              <li key={g.id}>
                <span>
                  <strong>{g.name}</strong>
                  <span className="ck-muted"> {g.rsvpStatus === 'attending' ? `${g.rsvpPax} orang` : g.rsvpStatus === 'pending' ? 'belum RSVP' : 'tidak hadir'}{g.tableNo ? ` · meja ${g.tableNo}` : ''}</span>
                </span>
                <button type="button" className="ck-btn ck-btn--small" disabled={!!g.checkedInAt || busy} onClick={() => void run({ guestId: g.id }, g.name)}>
                  {g.checkedInAt ? 'Sudah masuk' : 'Check-in'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      {guests.error && guests.data === null && cached.length === 0 && <p className="ck-card ck-card--bad" role="alert">{errorText(new Error())}</p>}
    </main>
  );
}
