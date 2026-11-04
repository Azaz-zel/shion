// Mode demo: semua data disimpan di localStorage browser ini, tanpa server.
// Perubahan disiarkan ke tab lain lewat BroadcastChannel, jadi admin di satu tab
// langsung melihat RSVP yang dikirim dari tab lain.
import { addDaysISO, checkInquiry, checkReservation, checkRsvp, todayISO } from './validation';
import {
  UserError,
  type AdminUser,
  type Api,
  type CheckInResult,
  type Guest,
  type GuestBrief,
  type InvitationView,
  type Reservation,
  type Wedding,
} from './types';

const KEY = 'shion-demo-v2';
const SESSION_KEY = 'shion-demo-admin';
export const DEMO_ADMIN = { email: 'owner@shion.demo', password: 'shion-demo' };
export const DEMO_USHER = { email: 'usher@shion.demo', password: 'shion-demo' };
export const DEMO_GUEST_TOKEN = 'demo-tamu-shion';

interface Db {
  weddings: Wedding[];
  guests: Guest[];
  reservations: Reservation[];
}

function nextSaturdayAfter(days: number): string {
  const start = addDaysISO(todayISO(), days);
  const d = new Date(start + 'T00:00:00');
  const add = (6 - d.getDay() + 7) % 7;
  return addDaysISO(start, add);
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

function seed(): Db {
  const now = new Date().toISOString();
  const rina: Wedding = {
    id: 'w-rina-dimas', code: 'WED-0427', slug: 'rina-dimas', couple1: 'Rina', couple2: 'Dimas',
    contactName: 'Rina Maharani', phone: '081200000001', eventDate: nextSaturdayAfter(30), session: 'dinner',
    guestEstimate: 60, status: 'confirmed', notes: 'Kaiseki 7 course, satu meja tanpa babi.', createdAt: hoursAgo(24 * 40),
  };
  const laras: Wedding = {
    id: 'w-laras-bima', code: 'WED-0512', slug: 'laras-bima', couple1: 'Laras', couple2: 'Bima',
    contactName: 'Laras Anindita', phone: '081200000002', eventDate: nextSaturdayAfter(90), session: 'lunch',
    guestEstimate: 45, status: 'inquiry', notes: 'Ingin akad kecil di teras taman.', createdAt: hoursAgo(5),
  };
  const g = (id: string, name: string, group: string, max: number, status: Guest['rsvpStatus'], pax: number,
    dietary: Guest['dietary'], note: string, msg: string, at: number | null, table: string, checked = false): Guest => ({
    id, weddingId: rina.id, name, groupLabel: group, maxPax: max, token: `demo-${id}`, rsvpStatus: status, rsvpPax: pax,
    dietary, dietaryNote: note, message: msg, respondedAt: at === null ? null : hoursAgo(at), tableNo: table,
    checkedInAt: checked ? now : null, checkedInPax: checked ? pax : 0,
  });
  const guests: Guest[] = [
    g('budi', 'Budi Santoso', 'Keluarga', 2, 'attending', 2, ['no_pork'], '', 'Selamat untuk kalian berdua.', 70, '1', true),
    g('sari', 'Sari Wulandari', 'Keluarga', 4, 'attending', 3, [], '', '', 52, '1'),
    g('andi', 'Andi Wijaya', 'Teman', 1, 'attending', 1, ['vegetarian'], '', 'Sampai jumpa di Shion!', 30, '4'),
    g('maya', 'Maya Putri', 'Teman', 2, 'declined', 0, [], '', 'Maaf sedang di luar kota, doa terbaik untuk kalian.', 26, ''),
    g('reza', 'Reza Hidayat', 'Kantor', 2, 'pending', 0, [], '', '', null, '6'),
    g('clara', 'Clara Tan', 'Teman', 2, 'attending', 2, [], 'Alergi udang', '', 12, '4'),
    g('yusuf', 'Yusuf Rahman', 'Kantor', 1, 'attending', 1, ['no_pork', 'no_alcohol'], '', '', 9, '6'),
    g('dewi', 'Dewi Lestari', 'Keluarga', 3, 'pending', 0, [], '', '', null, '2'),
    g('kevin', 'Kevin Halim', 'Teman', 1, 'attending', 1, ['no_raw'], '', 'Tidak sabar!', 3, '5'),
    g('nadia', 'Nadia Kusuma', 'Kantor', 2, 'declined', 0, [], '', '', 2, ''),
    { ...g('demo', 'Tamu Demo', 'Demo', 2, 'pending', 0, [], '', '', null, '3'), token: DEMO_GUEST_TOKEN },
  ];
  const t = todayISO();
  const r = (id: string, code: string, type: Reservation['type'], pkg: Reservation['packageCode'], date: string, time: string,
    pax: number, name: string, status: Reservation['status'], pay: Reservation['paymentStatus'], notes: string, at: number): Reservation => ({
    id, code, type, packageCode: pkg, date, time, pax, guestName: name, phone: '0812000000' + id.slice(-2), notes, status,
    paymentStatus: pay, createdAt: hoursAgo(at),
  });
  const open = (iso: string) => (new Date(iso + 'T00:00:00').getDay() === 1 ? addDaysISO(iso, 1) : iso);
  const reservations: Reservation[] = [
    r('r01', 'SHN-4821', 'dinner_package', 'matsu', open(t), '18:00', 2, 'Tamu Contoh Satu', 'confirmed', 'paid_simulated', 'Ulang tahun pernikahan', 30),
    r('r02', 'SHN-4822', 'table', null, open(t), '19:00', 4, 'Tamu Contoh Dua', 'confirmed', 'none', 'Satu kursi bayi', 20),
    r('r03', 'SHN-4823', 'dinner_package', 'take', open(t), '19:30', 3, 'Tamu Contoh Tiga', 'pending', 'pending', 'Tanpa babi', 4),
    r('r04', 'SHN-4824', 'table', null, open(addDaysISO(t, 1)), '12:00', 2, 'Tamu Contoh Empat', 'pending', 'none', '', 2),
    r('r05', 'SHN-4825', 'dinner_package', 'ume', open(addDaysISO(t, 3)), '18:30', 6, 'Tamu Contoh Lima', 'confirmed', 'paid_simulated', 'Alergi kacang', 50),
  ];
  return { weddings: [rina, laras], guests, reservations };
}

function load(): Db {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Db;
  } catch {
    /* penyimpanan diblokir: pakai seed baru di memori */
  }
  const db = seed();
  save(db, false);
  return db;
}

let memory: Db | null = null;
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('shion-demo') : null;
const listeners = new Set<() => void>();

function save(db: Db, notify = true): void {
  memory = db;
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* tetap jalan dari memori */
  }
  if (notify) {
    listeners.forEach((fn) => fn());
    channel?.postMessage('changed');
  }
}

function db(): Db {
  if (!memory) memory = load();
  return memory;
}

channel?.addEventListener('message', () => {
  memory = null;
  listeners.forEach((fn) => fn());
});

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));

function newCode(prefix: string, taken: string[]): string {
  let code = '';
  do code = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
  while (taken.includes(code));
  return code;
}

function view(guest: Guest, wedding: Wedding): InvitationView {
  return {
    wedding: { couple1: wedding.couple1, couple2: wedding.couple2, eventDate: wedding.eventDate, session: wedding.session, slug: wedding.slug },
    guest: {
      name: guest.name, maxPax: guest.maxPax, rsvpStatus: guest.rsvpStatus, rsvpPax: guest.rsvpPax, dietary: guest.dietary,
      dietaryNote: guest.dietaryNote, message: guest.message, token: guest.token, tableNo: guest.tableNo,
    },
  };
}

function brief(g: Guest): GuestBrief {
  return {
    id: g.id, name: g.name, groupLabel: g.groupLabel, maxPax: g.maxPax, rsvpStatus: g.rsvpStatus, rsvpPax: g.rsvpPax,
    dietary: g.dietary, dietaryNote: g.dietaryNote, tableNo: g.tableNo, checkedInAt: g.checkedInAt, checkedInPax: g.checkedInPax,
  };
}

function requireAdmin(roles: AdminUser['role'][] = ['owner', 'staff']): AdminUser {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const user = JSON.parse(raw) as AdminUser;
      if (roles.includes(user.role)) return user;
      throw new UserError('Akun Anda tidak punya akses ke fitur ini.');
    }
  } catch (e) {
    if (e instanceof UserError) throw e;
  }
  throw new UserError('Sesi admin berakhir. Silakan masuk lagi.');
}

export const demoApi: Api = {
  mode: 'demo',

  async createReservation(input) {
    checkReservation(input);
    await wait();
    const d = db();
    const booked = d.reservations
      .filter((x) => x.date === input.date && x.time === input.time && x.status !== 'cancelled')
      .reduce((sum, x) => sum + x.pax, 0);
    if (booked + input.pax > 24) throw new UserError('Jam ini sudah penuh. Coba jam lain.');
    const code = newCode('SHN', d.reservations.map((x) => x.code));
    d.reservations.unshift({
      id: crypto.randomUUID(), code, ...input, phone: input.phone.trim(), guestName: input.guestName.trim(),
      status: 'pending', paymentStatus: input.type === 'dinner_package' ? 'pending' : 'none', createdAt: new Date().toISOString(),
    });
    save(d);
    return { code };
  },

  async createWeddingInquiry(input) {
    checkInquiry(input);
    await wait();
    const d = db();
    const clash = d.weddings.some((w) => w.eventDate === input.eventDate && w.session === input.session && w.status === 'confirmed');
    if (clash) throw new UserError('Tanggal dan sesi ini sudah dipesan. Pilih sesi atau tanggal lain.');
    const code = newCode('WED', d.weddings.map((w) => w.code));
    d.weddings.unshift({
      id: crypto.randomUUID(), code, slug: code.toLowerCase(), couple1: input.contactName.trim(), couple2: '',
      contactName: input.contactName.trim(), phone: input.phone.trim(), eventDate: input.eventDate, session: input.session,
      guestEstimate: input.guestEstimate, status: 'inquiry', notes: input.notes, createdAt: new Date().toISOString(),
    });
    save(d);
    return { code };
  },

  async getInvitation(slug, token) {
    await wait(150);
    const d = db();
    const guest = d.guests.find((g) => g.token === token);
    const wedding = guest && d.weddings.find((w) => w.id === guest.weddingId && w.slug === slug && w.status === 'confirmed');
    return guest && wedding ? view(guest, wedding) : null;
  },

  async submitRsvp(token, input) {
    const d = db();
    const guest = d.guests.find((g) => g.token === token);
    const wedding = guest && d.weddings.find((w) => w.id === guest.weddingId);
    if (!guest || !wedding) throw new UserError('Undangan tidak ditemukan.');
    checkRsvp(input, guest.maxPax);
    await wait();
    guest.rsvpStatus = input.status;
    guest.rsvpPax = input.status === 'attending' ? input.pax : 0;
    guest.dietary = input.status === 'attending' ? input.dietary : [];
    guest.dietaryNote = input.status === 'attending' ? input.dietaryNote.trim() : '';
    guest.message = input.message.trim();
    guest.respondedAt = new Date().toISOString();
    save(d);
    return view(guest, wedding);
  },

  async simulatePayment(code, phone) {
    await wait(400);
    const d = db();
    const r = d.reservations.find((x) => x.code === code && x.phone === phone.trim() && x.type === 'dinner_package' && x.paymentStatus === 'pending');
    if (!r) throw new UserError('Reservasi tidak ditemukan atau sudah dibayar.');
    r.paymentStatus = 'paid_simulated';
    if (r.status === 'pending') r.status = 'confirmed';
    save(d);
  },

  admin: {
    async session() {
      try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        return raw ? (JSON.parse(raw) as AdminUser) : null;
      } catch {
        return null;
      }
    },
    async signIn(email, password) {
      await wait();
      const account = [DEMO_ADMIN, DEMO_USHER].find((a) => a.email === email.trim().toLowerCase() && a.password === password);
      if (!account) throw new UserError('Email atau kata sandi salah.');
      const user: AdminUser = { email: account.email, role: account === DEMO_USHER ? 'usher' : 'owner' };
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } catch {
        /* sesi hanya bertahan selama halaman terbuka */
      }
      return user;
    },
    async signOut() {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        /* abaikan */
      }
    },
    async weddings() {
      requireAdmin(['owner', 'staff', 'usher']);
      await wait(150);
      return [...db().weddings].sort((a, b) => a.eventDate.localeCompare(b.eventDate));
    },
    async guests(weddingId) {
      requireAdmin(['owner', 'staff', 'usher']);
      await wait(150);
      return db().guests.filter((g) => g.weddingId === weddingId);
    },
    async reservations() {
      requireAdmin();
      await wait(150);
      return [...db().reservations].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    },
    async setReservationStatus(id, status) {
      requireAdmin();
      const d = db();
      const r = d.reservations.find((x) => x.id === id);
      if (!r) throw new UserError('Reservasi tidak ditemukan.');
      r.status = status;
      save(d);
    },
    async setWeddingStatus(id, status) {
      requireAdmin();
      const d = db();
      const w = d.weddings.find((x) => x.id === id);
      if (!w) throw new UserError('Wedding tidak ditemukan.');
      if (status === 'confirmed' && d.weddings.some((o) => o.id !== id && o.status === 'confirmed' && o.eventDate === w.eventDate && o.session === w.session)) {
        throw new UserError('Sudah ada wedding terkonfirmasi di tanggal dan sesi yang sama.');
      }
      w.status = status;
      save(d);
    },
    async addGuests(weddingId, rows) {
      requireAdmin();
      const d = db();
      if (!d.weddings.some((w) => w.id === weddingId)) throw new UserError('Wedding tidak ditemukan.');
      rows.forEach((r) => {
        d.guests.push({
          id: crypto.randomUUID(), weddingId, name: r.name.trim(), groupLabel: r.groupLabel.trim(), maxPax: r.maxPax,
          token: crypto.randomUUID().replace(/-/g, ''), rsvpStatus: 'pending', rsvpPax: 0, dietary: [], dietaryNote: '',
          message: '', respondedAt: null, tableNo: r.tableNo.trim(), checkedInAt: null, checkedInPax: 0,
        });
      });
      save(d);
      return rows.length;
    },
    async updateGuest(id, patch) {
      requireAdmin();
      const d = db();
      const g = d.guests.find((x) => x.id === id);
      if (!g) throw new UserError('Tamu tidak ditemukan.');
      if (patch.maxPax !== undefined && patch.maxPax < g.rsvpPax) throw new UserError(`Tamu ini sudah RSVP untuk ${g.rsvpPax} orang.`);
      Object.assign(g, patch);
      save(d);
    },
    async deleteGuest(id) {
      requireAdmin();
      const d = db();
      d.guests = d.guests.filter((x) => x.id !== id);
      save(d);
    },
    async checkIn(weddingId, by): Promise<CheckInResult> {
      requireAdmin(['owner', 'staff', 'usher']);
      await wait(200);
      const d = db();
      const g = by.guestId ? d.guests.find((x) => x.id === by.guestId) : d.guests.find((x) => x.token === by.token);
      if (!g) return { status: 'invalid' };
      if (g.weddingId !== weddingId) return { status: 'other_event' };
      if (g.checkedInAt) return { status: 'already', guest: brief(g) };
      g.checkedInAt = new Date().toISOString();
      g.checkedInPax = Math.max(1, Math.min(by.pax ?? (g.rsvpPax || 1), g.maxPax));
      save(d);
      return { status: 'ok', guest: brief(g) };
    },
    subscribe(onChange) {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
  },
};

/** Menghapus data demo di browser ini dan memulai lagi dari data contoh. */
export function resetDemo(): void {
  save(seed());
}
