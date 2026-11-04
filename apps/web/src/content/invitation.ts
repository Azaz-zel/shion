import type { DietCode, Lang } from '../lib/types';

// Teks undangan. Cerita dan rangkaian acara per pasangan nantinya disimpan di database;
// untuk sekarang wedding demo "rina-dimas" punya cerita sendiri, wedding lain memakai teks umum.
const id = {
  dear: 'Kepada Yth.',
  invite: 'Dengan penuh syukur, kami mengundang Anda untuk merayakan pernikahan kami.',
  daysLeft: (n: number) => (n > 0 ? `${n} hari lagi` : n === 0 ? 'Hari ini' : 'Acara sudah berlalu'),
  sessionTime: { dinner: '18.30', lunch: '11.30' },
  schedule: 'Rangkaian acara',
  dressT: 'Dress code', dress: 'Formal dengan warna lembut: ungu muda, krem, atau abu-abu.',
  venueT: 'Lokasi', maps: 'Buka di Google Maps', valet: 'Tersedia valet parking.',
  rsvpT: 'Konfirmasi kehadiran', accept: 'Saya akan hadir', decline: 'Maaf, saya tidak bisa hadir',
  paxT: 'Jumlah tamu', max: (n: number) => `maks. ${n}`, less: 'Kurangi tamu', more: 'Tambah tamu',
  dietT: 'Pantangan makanan', noteT: 'Alergi atau catatan lain', msgT: 'Ucapan untuk mempelai', msgPh: 'Tulis ucapan Anda',
  consent: 'Saya setuju nama dan preferensi makanan saya digunakan oleh Shion dan mempelai hanya untuk acara ini. Data dihapus paling lambat 30 hari setelah acara.',
  send: 'Kirim RSVP', sending: 'Mengirim…',
  thanksYes: (name: string) => `Terima kasih, ${name}.`,
  showQr: 'Sampai jumpa di hari bahagia kami. Tunjukkan QR ini saat tiba.',
  qrLabel: (pax: number) => `QR masuk · ${pax} orang`,
  table: (t: string) => `Meja ${t}`,
  tip: 'Simpan screenshot atau tambahkan halaman ini ke layar utama.',
  thanksNo: 'Terima kasih atas kabarnya.', wishes: 'Doa Anda sangat berarti bagi kami.',
  change: 'Ubah jawaban',
  loading: 'Membuka undangan…',
  notFoundT: 'Undangan tidak ditemukan', notFound: 'Periksa kembali link yang dikirim mempelai. Link undangan bersifat pribadi untuk setiap tamu.',
  errorT: 'Undangan belum bisa dibuka', retry: 'Coba lagi',
  footer: 'Undangan digital oleh Shion · Jakarta Selatan',
  demo: 'Mode demo: jawaban hanya tersimpan di browser ini.',
  diets: { no_pork: 'Tanpa babi', no_alcohol: 'Tanpa alkohol', vegetarian: 'Vegetarian', no_raw: 'Tidak makan mentah' } as Record<DietCode, string>,
};

export type InviteCopy = typeof id;

const en: InviteCopy = {
  dear: 'Dear',
  invite: 'With grateful hearts, we invite you to celebrate our wedding.',
  daysLeft: (n: number) => (n > 0 ? `${n} days to go` : n === 0 ? 'Today' : 'This event has passed'),
  sessionTime: { dinner: '18:30', lunch: '11:30' },
  schedule: 'Schedule',
  dressT: 'Dress code', dress: 'Formal, in soft tones: lilac, cream or grey.',
  venueT: 'Venue', maps: 'Open in Google Maps', valet: 'Valet parking is available.',
  rsvpT: 'Will you join us?', accept: 'Joyfully accept', decline: 'Regretfully decline',
  paxT: 'Number of guests', max: (n: number) => `max. ${n}`, less: 'Fewer guests', more: 'More guests',
  dietT: 'Dietary needs', noteT: 'Allergies or other notes', msgT: 'A message for the couple', msgPh: 'Write your message',
  consent: 'I agree that my name and dietary preferences may be used by Shion and the couple for this event only. My data will be deleted no later than 30 days after the event.',
  send: 'Send RSVP', sending: 'Sending…',
  thanksYes: (name: string) => `Thank you, ${name}.`,
  showQr: 'We cannot wait to see you. Show this QR when you arrive.',
  qrLabel: (pax: number) => `Entry QR · ${pax} ${pax > 1 ? 'guests' : 'guest'}`,
  table: (t: string) => `Table ${t}`,
  tip: 'Take a screenshot or add this page to your home screen.',
  thanksNo: 'Thank you for letting us know.', wishes: 'Your wishes mean the world to us.',
  change: 'Change my reply',
  loading: 'Opening your invitation…',
  notFoundT: 'Invitation not found', notFound: 'Please check the link the couple sent you. Each invitation link is personal to one guest.',
  errorT: 'The invitation could not be opened', retry: 'Try again',
  footer: 'Digital invitation by Shion · South Jakarta',
  demo: 'Demo mode: replies are only stored in this browser.',
  diets: { no_pork: 'No pork', no_alcohol: 'No alcohol', vegetarian: 'Vegetarian', no_raw: 'No raw food' },
};

export const inviteCopy: Record<Lang, InviteCopy> = { id, en };

interface CoupleStory {
  story: Record<Lang, string>;
  schedule: Record<Lang, Array<[string, string]>>;
}

const generic: CoupleStory = {
  story: {
    id: 'Kami ingin merayakan awal perjalanan kami bersama orang-orang yang kami sayangi, di meja yang sama, dalam satu malam yang tenang.',
    en: 'We want to celebrate the start of our journey with the people we love, around one table, on one quiet evening.',
  },
  schedule: {
    id: [['18.30', 'Penyambutan tamu'], ['19.30', 'Makan malam kaiseki'], ['22.00', 'Penutup']],
    en: [['18:30', 'Welcome'], ['19:30', 'Kaiseki dinner'], ['22:00', 'Farewell']],
  },
};

const stories: Record<string, CoupleStory> = {
  'rina-dimas': {
    story: {
      id: 'Kami bertemu di kedai ramen kecil di Bandung, sembilan tahun lalu, saat hujan tidak juga berhenti. Kini kami ingin menulis bab berikutnya bersama orang-orang yang kami sayangi.',
      en: 'We met at a small ramen shop in Bandung nine years ago, on an evening when the rain would not stop. Now we want to write the next chapter with the people we love.',
    },
    schedule: {
      id: [['18.30', 'Penyambutan & minuman di Engawa Garden'], ['19.15', 'Pembukaan dan sambutan keluarga'], ['19.30', 'Makan malam kaiseki 7 course'], ['21.00', 'Potong kue & foto bersama'], ['22.00', 'Penutup']],
      en: [['18:30', 'Welcome drinks in the Engawa Garden'], ['19:15', 'Opening and family speeches'], ['19:30', 'Seven-course kaiseki dinner'], ['21:00', 'Cake cutting & group photos'], ['22:00', 'Farewell']],
    },
  },
};

export const coupleStory = (slug: string) => stories[slug] ?? generic;
