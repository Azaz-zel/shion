import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { brand } from '../config/brand';
import { api, errorText } from '../lib/api';
import { parseGuestCsv } from '../lib/csv';
import '../styles/admin.css';

/** Halaman pelanggan wedding: mengisi daftar tamu sendiri setelah reservasinya dikonfirmasi. */
export default function GuestList() {
  const { code = '' } = useParams();
  const [phone, setPhone] = useState('');
  const [text, setText] = useState('');
  const [state, setState] = useState({ busy: false, error: '', ok: '' });
  const parsed = useMemo(() => parseGuestCsv(text), [text]);
  useEffect(() => { document.title = `Daftar tamu ${code.toUpperCase()} · ${brand.name}`; }, [code]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (parsed.rows.length === 0) return setState({ busy: false, error: 'Tulis minimal satu nama tamu.', ok: '' });
    setState({ busy: true, error: '', ok: '' });
    try {
      const n = await api.submitGuestList(code, phone, parsed.rows);
      setText('');
      setState({ busy: false, error: '', ok: `${n} tamu terkirim. Tim ${brand.name} akan menyiapkan undangannya. Anda bisa menambah tamu lagi kapan saja.` });
    } catch (err) {
      setState({ busy: false, error: errorText(err), ok: '' });
    }
  }

  return (
    <main className="ad-login">
      <form className="ad-login__card ad-login__card--wide" onSubmit={submit}>
        <p className="ad-eyebrow">{brand.name} <span lang="ja">{brand.kanji}</span> · Wedding {code.toUpperCase()}</p>
        <h1>Daftar tamu</h1>
        <p className="ad-muted">Tulis tamu undangan Anda di sini. Kalau belum sempat, tim kami akan menghubungi Anda lewat WhatsApp.</p>
        <label className="ad-field"><span>Nomor WhatsApp pemesan</span>
          <input id="gl-phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="0812xxxxxxxx" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="ad-field"><span>Tamu, satu per baris</span>
          <textarea id="gl-rows" rows={8} placeholder={'Budi Santoso, Keluarga, 2\nSari Wulandari, Teman, 1'} value={text} onChange={(e) => setText(e.target.value)} />
        </label>
        <p className="ad-muted ad-small">Format: <code>nama, grup, jumlah orang</code>. Hanya nama yang wajib, jumlah orang 1 sampai 10.</p>
        {text.trim() && (
          <p className="ad-small" aria-live="polite">
            <strong>{parsed.rows.length} tamu siap dikirim.</strong>
            {parsed.skipped.length > 0 && <span className="ad-attn"> {parsed.skipped.length} baris dilewati: {parsed.skipped.slice(0, 3).map((s) => `baris ${s.line} (${s.reason})`).join(', ')}{parsed.skipped.length > 3 ? ', …' : ''}.</span>}
          </p>
        )}
        {state.error && <p className="ad-error" role="alert">{state.error}</p>}
        {state.ok && <p className="ad-ok" role="status">{state.ok}</p>}
        <button className="ad-btn" type="submit" disabled={state.busy}>{state.busy ? 'Mengirim…' : `Kirim ${parsed.rows.length || ''} tamu`}</button>
        {api.mode === 'demo' && <p className="ad-demo">Mode demo: wedding contoh WED-0427 memakai nomor 081200000001.</p>}
      </form>
    </main>
  );
}
