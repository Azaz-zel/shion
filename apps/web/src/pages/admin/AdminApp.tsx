import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { brand } from '../../config/brand';
import { api, errorText } from '../../lib/api';
import { DEMO_ADMIN, DEMO_USHER, resetDemo } from '../../lib/demoApi';
import type { AdminUser } from '../../lib/types';
import RsvpPage from './RsvpPage';
import ReservationsPage from './ReservationsPage';
import WeddingsPage from './WeddingsPage';
import CheckinPage from './CheckinPage';
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
            <p>Mode demo. Masuk dengan akun contoh (kata sandi <code>{DEMO_ADMIN.password}</code>):</p>
            <p><button type="button" className="ad-link" onClick={() => { setEmail(DEMO_ADMIN.email); setPassword(DEMO_ADMIN.password); }}>Owner: {DEMO_ADMIN.email}</button></p>
            <p><button type="button" className="ad-link" onClick={() => { setEmail(DEMO_USHER.email); setPassword(DEMO_USHER.password); }}>Usher: {DEMO_USHER.email}</button></p>
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
  const home = (u: AdminUser) => (u.role === 'usher' ? '/admin/checkin' : '/admin/rsvp');
  if (!user) return <Login onIn={(u) => { setUser(u); if (u.role === 'usher' || location.pathname === '/admin' || location.pathname === '/admin/') navigate(home(u)); }} />;
  const staff = user.role !== 'usher';

  return (
    <div className="ad">
      <header className="ad-top">
        <a className="ad-brand" href="/">{brand.name} <span lang="ja">{brand.kanji}</span></a>
        <nav className="ad-tabs" aria-label="Admin">
          {staff && <NavLink to="/admin/rsvp">RSVP tamu</NavLink>}
          {staff && <NavLink to="/admin/reservasi">Reservasi</NavLink>}
          {staff && <NavLink to="/admin/wedding">Wedding</NavLink>}
          <NavLink to="/admin/checkin">Check-in</NavLink>
        </nav>
        <div className="ad-user">
          {api.mode === 'demo' && staff && (
            <button type="button" className="ad-link" onClick={() => { resetDemo(); }}>Reset data demo</button>
          )}
          <span className="ad-muted">{user.email}</span>
          <button type="button" className="ad-link" onClick={async () => { await api.admin.signOut(); setUser(null); }}>Keluar</button>
        </div>
      </header>
      {api.mode === 'demo' && staff && <p className="ad-banner">Mode demo: data contoh tersimpan di browser ini. Buka undangan contoh di tab lain, kirim RSVP, dan lihat daftar di sini ikut berubah.</p>}
      <Routes>
        {staff && <Route path="rsvp" element={<RsvpPage />} />}
        {staff && <Route path="reservasi" element={<ReservationsPage />} />}
        {staff && <Route path="wedding" element={<WeddingsPage />} />}
        <Route path="checkin" element={<CheckinPage />} />
        <Route path="*" element={<Navigate to={home(user)} replace />} />
      </Routes>
    </div>
  );
}
