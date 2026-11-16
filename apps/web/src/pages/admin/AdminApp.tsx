import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { brand } from '../../config/brand';
import { api, errorText } from '../../lib/api';
import { DEMO_ADMIN, DEMO_USHER, resetDemo } from '../../lib/demoApi';
import type { AdminUser } from '../../lib/types';
import RsvpPage from './RsvpPage';
import ReservationsPage from './ReservationsPage';
import WeddingsPage from './WeddingsPage';
import CheckinPage from './CheckinPage';
import DashboardPage from './DashboardPage';
import '../../styles/admin.css';

// Ikon garis 24px digambar sendiri supaya tidak menambah dependensi.
const ICON = {
  dash: 'M4 4h7v7H4zM13 4h7v4h-7zM13 11h7v9h-7zM4 14h7v6H4z',
  book: 'M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.4M17.5 14a6.5 6.5 0 0 1 4 6',
  scan: 'M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16',
  reset: 'M4 12a8 8 0 1 0 2.6-5.9M4 4v5h5',
  out: 'M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5M15 8l4 4-4 4M19 12H9',
};
const NAV = [
  { to: 'dashboard', label: 'Dashboard', icon: ICON.dash },
  { to: 'reservasi', label: 'Reservasi', icon: ICON.book },
  { to: 'wedding', label: 'Wedding', icon: ICON.heart },
  { to: 'rsvp', label: 'Tamu undangan', icon: ICON.users },
  { to: 'checkin', label: 'Check-in', icon: ICON.scan },
];

function Icon({ d }: { d: string }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
}

function Tip({ children }: { children: ReactNode }) {
  return <span className="ad-rail__tip" aria-hidden="true">{children}</span>;
}

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
  const home = (u: AdminUser) => (u.role === 'usher' ? '/admin/checkin' : '/admin/dashboard');
  if (!user) return <Login onIn={(u) => { setUser(u); if (u.role === 'usher' || location.pathname === '/admin' || location.pathname === '/admin/') navigate(home(u)); }} />;
  const staff = user.role !== 'usher';

  return (
    <div className="ad">
      <header className="ad-rail">
        <a className="ad-rail__brand" href="/" lang="ja" aria-label={`${brand.name}, ke situs`}>{brand.kanji}</a>
        <nav aria-label="Admin">
          {NAV.filter((n) => staff || n.to === 'checkin').map((n) => (
            <NavLink key={n.to} to={`/admin/${n.to}`} aria-label={n.label}><Icon d={n.icon} /><Tip>{n.label}</Tip></NavLink>
          ))}
        </nav>
        <div className="ad-rail__end">
          {api.mode === 'demo' && staff && (
            <button type="button" aria-label="Reset data demo" onClick={() => { resetDemo(); }}><Icon d={ICON.reset} /><Tip>Reset data demo</Tip></button>
          )}
          <button type="button" aria-label={`Keluar (${user.email})`} onClick={async () => { await api.admin.signOut(); setUser(null); }}><Icon d={ICON.out} /><Tip>Keluar · {user.email}</Tip></button>
        </div>
      </header>
      <div className="ad-body">
        {api.mode === 'demo' && staff && <p className="ad-banner">Mode demo: data contoh tersimpan di browser ini. Buka undangan contoh di tab lain, kirim RSVP, dan lihat daftar di sini ikut berubah.</p>}
        <Routes>
          {staff && <Route path="dashboard" element={<DashboardPage email={user.email} />} />}
          {staff && <Route path="rsvp" element={<RsvpPage />} />}
          {staff && <Route path="reservasi" element={<ReservationsPage />} />}
          {staff && <Route path="wedding" element={<WeddingsPage />} />}
          <Route path="checkin" element={<CheckinPage />} />
          <Route path="*" element={<Navigate to={home(user)} replace />} />
        </Routes>
      </div>
    </div>
  );
}
