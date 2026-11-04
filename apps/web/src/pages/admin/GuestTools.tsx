import { useMemo, useState, type FormEvent } from 'react';
import { api, errorText } from '../../lib/api';
import { parseGuestCsv } from '../../lib/csv';
import type { Guest } from '../../lib/types';

const SAMPLE = 'nama,grup,maks_orang,meja\nBudi Santoso,Keluarga,2,1\n"Halim, Kevin",Teman,1,5';

/** Tambah satu tamu atau impor banyak tamu dari CSV untuk wedding yang dipilih. */
export function GuestTools({ weddingId }: { weddingId: string }) {
  const [mode, setMode] = useState<'closed' | 'one' | 'csv'>('closed');
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [maxPax, setMaxPax] = useState(1);
  const [table, setTable] = useState('');
  const [csv, setCsv] = useState('');
  const [state, setState] = useState({ busy: false, error: '', ok: '' });
  const parsed = useMemo(() => parseGuestCsv(csv), [csv]);

  async function addOne(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setState({ busy: false, error: 'Isi nama tamu.', ok: '' });
    setState({ busy: true, error: '', ok: '' });
    try {
      await api.admin.addGuests(weddingId, [{ name, groupLabel: group, maxPax, tableNo: table }]);
      setState({ busy: false, error: '', ok: `${name.trim()} ditambahkan. Link undangannya ada di daftar tamu.` });
      setName('');
      setTable('');
    } catch (err) {
      setState({ busy: false, error: errorText(err), ok: '' });
    }
  }

  async function importCsv() {
    if (parsed.rows.length === 0) return;
    setState({ busy: true, error: '', ok: '' });
    try {
      const n = await api.admin.addGuests(weddingId, parsed.rows);
      setState({ busy: false, error: '', ok: `${n} tamu diimpor.` });
      setCsv('');
    } catch (err) {
      setState({ busy: false, error: errorText(err), ok: '' });
    }
  }

  return (
    <section className="ad-tools" aria-label="Tambah tamu">
      <div className="ad-chips" role="group" aria-label="Tambah tamu">
        <button type="button" aria-pressed={mode === 'one'} onClick={() => setMode(mode === 'one' ? 'closed' : 'one')}>Tambah tamu</button>
        <button type="button" aria-pressed={mode === 'csv'} onClick={() => setMode(mode === 'csv' ? 'closed' : 'csv')}>Impor CSV</button>
      </div>
      {mode === 'one' && (
        <form className="ad-tools__form" onSubmit={addOne}>
          <label className="ad-field"><span>Nama</span><input id="gt-name" value={name} onChange={(e) => setName(e.target.value)} required /></label>
          <label className="ad-field"><span>Grup</span><input id="gt-group" value={group} placeholder="Keluarga, Teman, Kantor" onChange={(e) => setGroup(e.target.value)} /></label>
          <label className="ad-field"><span>Maks orang</span>
            <select id="gt-max" value={maxPax} onChange={(e) => setMaxPax(Number(e.target.value))}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label className="ad-field"><span>Meja</span><input id="gt-table" value={table} onChange={(e) => setTable(e.target.value)} /></label>
          <button className="ad-btn" type="submit" disabled={state.busy}>Simpan tamu</button>
        </form>
      )}
      {mode === 'csv' && (
        <div className="ad-tools__csv">
          <p className="ad-muted ad-small">Satu tamu per baris: <code>nama,grup,maks_orang,meja</code>. Hanya nama yang wajib. Bisa ditempel dari Excel atau Google Sheets (simpan sebagai CSV).</p>
          <label className="ad-field"><span>File CSV</span>
            <input id="gt-file" type="file" accept=".csv,text/csv,text/plain" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setCsv(await f.text()); }} />
          </label>
          <label className="ad-field"><span>Atau tempel di sini</span>
            <textarea id="gt-csv" rows={6} placeholder={SAMPLE} value={csv} onChange={(e) => setCsv(e.target.value)} />
          </label>
          {csv.trim() && (
            <p className="ad-small">
              <strong>{parsed.rows.length} tamu siap diimpor.</strong>
              {parsed.skipped.length > 0 && <span className="ad-attn"> {parsed.skipped.length} baris dilewati: {parsed.skipped.slice(0, 3).map((s) => `baris ${s.line} (${s.reason})`).join(', ')}{parsed.skipped.length > 3 ? ', …' : ''}.</span>}
            </p>
          )}
          <button className="ad-btn" type="button" disabled={state.busy || parsed.rows.length === 0} onClick={importCsv}>Impor {parsed.rows.length || ''} tamu</button>
        </div>
      )}
      {state.error && <p className="ad-error" role="alert">{state.error}</p>}
      {state.ok && <p className="ad-ok" role="status">{state.ok}</p>}
    </section>
  );
}

/** Ubah maks orang, meja, dan grup, atau hapus tamu. Penghapusan butuh konfirmasi di halaman. */
export function GuestRowEdit({ guest, onClose }: { guest: Guest; onClose: () => void }) {
  const [maxPax, setMaxPax] = useState(guest.maxPax);
  const [table, setTable] = useState(guest.tableNo);
  const [group, setGroup] = useState(guest.groupLabel);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [state, setState] = useState({ busy: false, error: '' });
  const act = async (fn: () => Promise<void>) => {
    setState({ busy: true, error: '' });
    try {
      await fn();
      onClose();
    } catch (err) {
      setState({ busy: false, error: errorText(err) });
    }
  };
  return (
    <div className="ad-rowedit">
      <label className="ad-field"><span>Maks orang</span>
        <select id={`ge-max-${guest.id}`} value={maxPax} onChange={(e) => setMaxPax(Number(e.target.value))}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
      <label className="ad-field"><span>Meja</span><input id={`ge-table-${guest.id}`} value={table} onChange={(e) => setTable(e.target.value)} /></label>
      <label className="ad-field"><span>Grup</span><input id={`ge-group-${guest.id}`} value={group} onChange={(e) => setGroup(e.target.value)} /></label>
      <div className="ad-rowedit__actions">
        <button type="button" className="ad-btn" disabled={state.busy} onClick={() => act(() => api.admin.updateGuest(guest.id, { maxPax, tableNo: table, groupLabel: group }))}>Simpan</button>
        <button type="button" className="ad-link" onClick={onClose}>Batal</button>
        {confirmDelete ? (
          <span className="ad-confirm">Hapus {guest.name}? Link undangannya ikut tidak berlaku.
            <button type="button" className="ad-link ad-link--danger" disabled={state.busy} onClick={() => act(() => api.admin.deleteGuest(guest.id))}>Ya, hapus</button>
            <button type="button" className="ad-link" onClick={() => setConfirmDelete(false)}>Tidak</button>
          </span>
        ) : (
          <button type="button" className="ad-link ad-link--danger" onClick={() => setConfirmDelete(true)}>Hapus tamu</button>
        )}
      </div>
      {state.error && <p className="ad-error" role="alert">{state.error}</p>}
    </div>
  );
}
