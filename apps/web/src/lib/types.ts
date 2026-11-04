export type Lang = 'id' | 'en';

export type ReservationType = 'table' | 'dinner_package';
export type PackageCode = 'ume' | 'take' | 'matsu';
export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';
export type PaymentStatus = 'none' | 'pending' | 'paid_simulated';

export interface Reservation {
  id: string;
  code: string;
  type: ReservationType;
  packageCode: PackageCode | null;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  pax: number;
  guestName: string;
  phone: string;
  notes: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export type WeddingStatus = 'inquiry' | 'consultation' | 'confirmed' | 'completed' | 'cancelled';
export type Session = 'lunch' | 'dinner';

export interface Wedding {
  id: string;
  code: string;
  slug: string;
  couple1: string;
  couple2: string;
  contactName: string;
  phone: string;
  eventDate: string;
  session: Session;
  guestEstimate: number;
  status: WeddingStatus;
  notes: string;
  createdAt: string;
}

export type RsvpStatus = 'pending' | 'attending' | 'declined';
export type DietCode = 'no_pork' | 'no_alcohol' | 'vegetarian' | 'no_raw';

export interface Guest {
  id: string;
  weddingId: string;
  name: string;
  groupLabel: string;
  maxPax: number;
  token: string;
  rsvpStatus: RsvpStatus;
  rsvpPax: number;
  dietary: DietCode[];
  dietaryNote: string;
  message: string;
  respondedAt: string | null;
  tableNo: string;
  checkedInAt: string | null;
}

/** Yang dilihat tamu di halaman undangan: hanya data acara dan data dirinya sendiri. */
export interface InvitationView {
  wedding: Pick<Wedding, 'couple1' | 'couple2' | 'eventDate' | 'session' | 'slug'>;
  guest: Pick<Guest, 'name' | 'maxPax' | 'rsvpStatus' | 'rsvpPax' | 'dietary' | 'dietaryNote' | 'message' | 'token' | 'tableNo'>;
}

export interface NewReservation {
  type: ReservationType;
  packageCode: PackageCode | null;
  date: string;
  time: string;
  pax: number;
  guestName: string;
  phone: string;
  notes: string;
}

export interface NewWeddingInquiry {
  contactName: string;
  phone: string;
  eventDate: string;
  session: Session;
  guestEstimate: number;
  notes: string;
}

export interface RsvpInput {
  status: 'attending' | 'declined';
  pax: number;
  dietary: DietCode[];
  dietaryNote: string;
  message: string;
  consent: boolean;
}

export interface AdminUser {
  email: string;
  role: 'owner' | 'staff' | 'usher';
}

/** Error yang pesannya boleh langsung ditampilkan ke pengguna. */
export class UserError extends Error {}

export interface Api {
  mode: 'demo' | 'supabase';
  createReservation(input: NewReservation): Promise<{ code: string }>;
  createWeddingInquiry(input: NewWeddingInquiry): Promise<{ code: string }>;
  getInvitation(slug: string, token: string): Promise<InvitationView | null>;
  submitRsvp(token: string, input: RsvpInput): Promise<InvitationView>;
  admin: {
    session(): Promise<AdminUser | null>;
    signIn(email: string, password: string): Promise<AdminUser>;
    signOut(): Promise<void>;
    weddings(): Promise<Wedding[]>;
    guests(weddingId: string): Promise<Guest[]>;
    reservations(): Promise<Reservation[]>;
    setReservationStatus(id: string, status: ReservationStatus): Promise<void>;
    setWeddingStatus(id: string, status: WeddingStatus): Promise<void>;
    /** Memanggil `onChange` setiap kali data tamu, reservasi, atau wedding berubah. Mengembalikan fungsi berhenti. */
    subscribe(onChange: () => void): () => void;
  };
}
