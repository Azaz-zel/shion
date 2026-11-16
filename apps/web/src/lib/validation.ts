import { UserError, type NewGuest, type NewReservation, type NewWeddingInquiry, type OpenRsvpInput, type RsvpInput } from './types';

/** Batas yang sama dipakai fungsi SQL submit_guest_list. */
export function checkGuestList(rows: NewGuest[]): void {
  if (rows.length < 1 || rows.length > 200) throw new UserError('Kirim 1 sampai 200 tamu sekaligus.');
  if (rows.some((r) => r.name.trim().length < 2 || r.name.trim().length > 80)) throw new UserError('Nama tamu 2 sampai 80 huruf.');
}

export const PHONE_RE = /^08[0-9]{8,12}$/;

export function todayISO(): string {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function addDaysISO(base: string, days: number): string {
  const d = new Date(base + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function isMonday(iso: string): boolean {
  return new Date(iso + 'T00:00:00').getDay() === 1;
}

export function checkReservation(r: NewReservation): void {
  if (r.guestName.trim().length < 2) throw new UserError('Isi nama lengkap Anda.');
  if (!PHONE_RE.test(r.phone.trim())) throw new UserError('Masukkan nomor WhatsApp yang valid, misalnya 0812xxxxxxxx.');
  if (!r.date || r.date < todayISO()) throw new UserError('Pilih tanggal mulai hari ini.');
  if (isMonday(r.date)) throw new UserError('Kami tutup setiap Senin. Pilih hari lain.');
  if (r.pax < 1 || r.pax > 12) throw new UserError('Reservasi online untuk 1 sampai 12 orang. Untuk rombongan lebih besar, hubungi kami lewat WhatsApp.');
  if (r.type === 'dinner_package' && !r.packageCode) throw new UserError('Pilih paket Ume, Take, atau Matsu.');
  if (r.type === 'dinner_package' && r.pax < 2) throw new UserError('Paket dinner minimal untuk 2 orang.');
}

export function checkInquiry(w: NewWeddingInquiry): void {
  if (w.contactName.trim().length < 2) throw new UserError('Isi nama kontak.');
  if (!PHONE_RE.test(w.phone.trim())) throw new UserError('Masukkan nomor WhatsApp yang valid, misalnya 0812xxxxxxxx.');
  if (!w.eventDate || w.eventDate < todayISO()) throw new UserError('Pilih tanggal acara mulai hari ini.');
  if (isMonday(w.eventDate)) throw new UserError('Kami tutup setiap Senin. Pilih hari lain.');
  if (w.guestEstimate < 40 || w.guestEstimate > 120) throw new UserError('Buyout wedding untuk 40 sampai 120 tamu.');
}

export const OPEN_RSVP_MAX_PAX = 10;

/** Batas yang sama dipakai fungsi SQL submit_open_rsvp. */
export function checkOpenRsvp(input: OpenRsvpInput): void {
  const name = input.name.trim();
  if (name.length < 2 || name.length > 80) throw new UserError('Tulis nama Anda, 2 sampai 80 huruf.');
  if (input.groupLabel.trim().length > 40) throw new UserError('Nama grup maksimal 40 huruf.');
  checkRsvp(input, OPEN_RSVP_MAX_PAX);
}

export function checkRsvp(input: RsvpInput, maxPax: number): void {
  if (!input.consent) throw new UserError('Centang persetujuan data untuk mengirim RSVP.');
  if (input.status === 'attending' && (input.pax < 1 || input.pax > maxPax)) {
    throw new UserError(`Jumlah tamu untuk undangan ini 1 sampai ${maxPax} orang.`);
  }
}
