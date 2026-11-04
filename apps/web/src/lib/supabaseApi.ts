import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { checkInquiry, checkReservation, checkRsvp } from './validation';
import {
  UserError,
  type AdminUser,
  type Api,
  type CheckInResult,
  type Guest,
  type InvitationView,
  type Reservation,
  type Wedding,
} from './types';

type Row = Record<string, unknown>;

// Pesan dari RAISE EXCEPTION di fungsi SQL (errcode P0001) memang ditulis untuk pengguna.
function fail(error: { message: string; code?: string } | null): never {
  if (error?.code === 'P0001') throw new UserError(error.message);
  throw new Error(error?.message ?? 'Permintaan gagal.');
}

const toReservation = (r: Row): Reservation => ({
  id: String(r.id), code: String(r.code), type: r.type as Reservation['type'],
  packageCode: (r.package_code as Reservation['packageCode']) ?? null, date: String(r.date), time: String(r.time),
  pax: Number(r.pax), guestName: String(r.guest_name), phone: String(r.phone), notes: String(r.notes ?? ''),
  status: r.status as Reservation['status'], paymentStatus: r.payment_status as Reservation['paymentStatus'],
  createdAt: String(r.created_at),
});

const toWedding = (r: Row): Wedding => ({
  id: String(r.id), code: String(r.code), slug: String(r.slug), couple1: String(r.couple_name_1),
  couple2: String(r.couple_name_2 ?? ''), contactName: String(r.contact_name), phone: String(r.phone),
  eventDate: String(r.event_date), session: r.session as Wedding['session'], guestEstimate: Number(r.guest_estimate),
  status: r.status as Wedding['status'], notes: String(r.notes ?? ''), createdAt: String(r.created_at),
});

const toGuest = (r: Row): Guest => ({
  id: String(r.id), weddingId: String(r.wedding_id), name: String(r.name), groupLabel: String(r.group_label ?? ''),
  maxPax: Number(r.max_pax), token: String(r.token), rsvpStatus: r.rsvp_status as Guest['rsvpStatus'],
  rsvpPax: Number(r.rsvp_pax), dietary: (r.dietary as Guest['dietary']) ?? [], dietaryNote: String(r.dietary_note ?? ''),
  message: String(r.message ?? ''), respondedAt: (r.responded_at as string | null) ?? null, tableNo: String(r.table_no ?? ''),
  checkedInAt: (r.checked_in_at as string | null) ?? null, checkedInPax: Number(r.checked_in_pax ?? 0),
});

export function makeSupabaseApi(url: string, anonKey: string): Api {
  const sb: SupabaseClient = createClient(url, anonKey);

  async function profile(): Promise<AdminUser | null> {
    const { data: auth } = await sb.auth.getUser();
    if (!auth.user) return null;
    const { data, error } = await sb.from('profiles').select('role').eq('id', auth.user.id).maybeSingle();
    if (error) fail(error);
    if (!data) return null;
    return { email: auth.user.email ?? '', role: data.role as AdminUser['role'] };
  }

  return {
    mode: 'supabase',

    async createReservation(input) {
      checkReservation(input);
      const { data, error } = await sb.rpc('create_reservation', {
        p_type: input.type, p_package: input.packageCode, p_date: input.date, p_time: input.time, p_pax: input.pax,
        p_name: input.guestName, p_phone: input.phone.trim(), p_notes: input.notes,
      });
      if (error) fail(error);
      return { code: String(data) };
    },

    async createWeddingInquiry(input) {
      checkInquiry(input);
      const { data, error } = await sb.rpc('create_wedding_inquiry', {
        p_contact: input.contactName, p_phone: input.phone.trim(), p_date: input.eventDate, p_session: input.session,
        p_estimate: input.guestEstimate, p_notes: input.notes,
      });
      if (error) fail(error);
      return { code: String(data) };
    },

    async getInvitation(slug, token) {
      const { data, error } = await sb.rpc('get_invitation', { p_slug: slug, p_token: token });
      if (error) fail(error);
      return (data as InvitationView | null) ?? null;
    },

    async submitRsvp(token, input) {
      checkRsvp(input, 99);
      const { data, error } = await sb.rpc('submit_rsvp', {
        p_token: token, p_status: input.status, p_pax: input.pax, p_dietary: input.dietary,
        p_note: input.dietaryNote, p_message: input.message, p_consent: input.consent,
      });
      if (error) fail(error);
      return data as InvitationView;
    },

    async simulatePayment(code, phone) {
      const { error } = await sb.rpc('simulate_payment', { p_code: code, p_phone: phone.trim() });
      if (error) fail(error);
    },

    admin: {
      session: profile,
      async signIn(email, password) {
        const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw new UserError('Email atau kata sandi salah.');
        const user = await profile();
        if (!user) {
          await sb.auth.signOut();
          throw new UserError('Akun ini belum punya akses admin. Minta owner menambahkan peran Anda.');
        }
        return user;
      },
      async signOut() {
        await sb.auth.signOut();
      },
      async weddings() {
        const { data, error } = await sb.from('weddings').select('*').order('event_date');
        if (error) fail(error);
        return (data ?? []).map(toWedding);
      },
      async guests(weddingId) {
        const { data, error } = await sb.from('guests').select('*').eq('wedding_id', weddingId).order('name');
        if (error) fail(error);
        return (data ?? []).map(toGuest);
      },
      async reservations() {
        const { data, error } = await sb.from('reservations').select('*').order('date').order('time');
        if (error) fail(error);
        return (data ?? []).map(toReservation);
      },
      async setReservationStatus(id, status) {
        const { error } = await sb.from('reservations').update({ status }).eq('id', id);
        if (error) fail(error);
      },
      async setWeddingStatus(id, status) {
        const { error } = await sb.from('weddings').update({ status }).eq('id', id);
        if (error?.code === '23505') throw new UserError('Sudah ada wedding terkonfirmasi di tanggal dan sesi yang sama.');
        if (error) fail(error);
      },
      async addGuests(weddingId, rows) {
        const { error, count } = await sb.from('guests').insert(
          rows.map((r) => ({ wedding_id: weddingId, name: r.name.trim(), group_label: r.groupLabel.trim(), max_pax: r.maxPax, table_no: r.tableNo.trim() })),
          { count: 'exact' },
        );
        if (error) fail(error);
        return count ?? rows.length;
      },
      async updateGuest(id, patch) {
        const row: Record<string, unknown> = {};
        if (patch.name !== undefined) row.name = patch.name.trim();
        if (patch.groupLabel !== undefined) row.group_label = patch.groupLabel.trim();
        if (patch.maxPax !== undefined) row.max_pax = patch.maxPax;
        if (patch.tableNo !== undefined) row.table_no = patch.tableNo.trim();
        const { error } = await sb.from('guests').update(row).eq('id', id);
        if (error?.code === '23514') throw new UserError('Jumlah maksimal tidak boleh lebih kecil dari jumlah yang sudah RSVP.');
        if (error) fail(error);
      },
      async deleteGuest(id) {
        const { error } = await sb.from('guests').delete().eq('id', id);
        if (error) fail(error);
      },
      async checkIn(weddingId, by) {
        const { data, error } = await sb.rpc('check_in', {
          p_wedding: weddingId, p_token: by.token ?? null, p_guest: by.guestId ?? null, p_pax: by.pax ?? null,
        });
        if (error) fail(error);
        return data as CheckInResult;
      },
      subscribe(onChange) {
        const channel = sb
          .channel('admin-live')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, onChange)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, onChange)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'weddings' }, onChange)
          .subscribe();
        return () => {
          void sb.removeChannel(channel);
        };
      },
    },
  };
}
