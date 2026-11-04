import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { brand } from '../../config/brand';
import { api, errorText } from '../../lib/api';
import { DEMO_ADMIN, resetDemo } from '../../lib/demoApi';
import type { AdminUser } from '../../lib/types';
import RsvpPage from './RsvpPage';
import ReservationsPage from './ReservationsPage';
import WeddingsPage from './WeddingsPage';
import '../../styles/admin.css';

function Login({ onIn }: { onIn: (u: AdminUser) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState({ busy: false, error: '' });
  async function submit(e: FormEvent) {
    e.preventDefault();
    setState({ busy: true, error: '' });
    try {
      onIn(await api.admin.signIn(email, password));
    } catch (err) {
      setState({ busy: false, error: errorText(err) });
    }
  }
  return (
    <main className="ad-login">
      <form className="ad-login__card" onSubmit={submit}>
        <p className="ad-eyebrow">{brand.name} <span lang="ja">{brand.kanji}</span> · Admin</p>
        <h1>Masuk</h1>
        <label className="ad-field"><span>Email</span>
          <input id="ad-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="ad-field"><span>Kata sandi</span>
          <input id="ad-pass" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {state.error && <p className="ad-error" role="alert">{state.error}</p>}
        <button className="ad-btn" type="submit" disabled={state.busy}>{state.busy ? 'Memeriksa…' : 'Masuk'}</button>
        {api.mode === 'demo' && (
          <div className="ad-demo">
            <p>Mode demo. Masuk dengan akun contoh:</p>
            <p><code>{DEMO_ADMIN.email}</code> · <code>{DEMO_ADMIN.password}</code></p>
            <button type="button" className="ad-link" onClick={() => { setEmail(DEMO_ADMIN.email); setPassword(DEMO_ADMIN.password); }}>Isi otomatis</button>
          </div>
        )}
      </form>
    </main>
  );
}

export default function AdminApp() {
  const [user, setUser] = useState<AdminUser | null | undefined>(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = `Admin · ${brand.name}`;
    api.admin.session().then(setUser).catch(() => setUser(null));
  }, []);

  if (user === undefined) return <main className="ad-login"><p role="status">Memuat…</p></main>;
  if (!user) return <Login onIn={(u) => { setUser(u); if (location.pathname === '/admin' || location.pathname === '/admin/') navigate('/admin/rsvp'); }} />;

  return (
    <div className="ad">
      <header className="ad-top">
        <a className="ad-brand" href="/">{brand.name} <span lang="ja">{brand.kanji}</span></a>
        <nav className="ad-tabs" aria-label="Admin">
          <NavLink to="/admin/rsvp">RSVP tamu</NavLink>
          <NavLink to="/admin/reservasi">Reservasi</NavLink>
          <NavLink to="/admin/wedding">Wedding</NavLink>
        </nav>
        <div className="ad-user">
          {api.mode === 'demo' && (
            <button type="button" className="ad-link" onClick={() => { resetDemo(); }}>Reset data demo</button>
          )}
          <span className="ad-muted">{user.email}</span>
          <button type="button" className="ad-link" onClick={async () => { await api.admin.signOut(); setUser(null); }}>Keluar</button>
        </div>
      </header>
      {api.mode === 'demo' && <p className="ad-banner">Mode demo: data contoh tersimpan di browser ini. Buka undangan contoh di tab lain, kirim RSVP, dan lihat daftar di sini ikut berubah.</p>}
      <Routes>
        <Route path="rsvp" element={<RsvpPage />} />
        <Route path="reservasi" element={<ReservationsPage />} />
        <Route path="wedding" element={<WeddingsPage />} />
        <Route path="*" element={<Navigate to="/admin/rsvp" replace />} />
      </Routes>
    </div>
  );
}
