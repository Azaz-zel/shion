import type { Lang } from '../lib/types';

const id = {
  skip: 'Langsung ke konten',
  nav: { season: 'Minggu ini', work: 'Hidangan', dusk: 'Malam di Shion', standing: 'Paket dinner', events: 'Wedding', faq: 'Pertanyaan', reserve: 'Reservasi meja', open: 'Buka menu', close: 'Tutup menu', top: 'Shion, kembali ke atas' },
  addressLine: 'Jl. Contoh Raya No. 88, Kebayoran Baru · Selasa sampai Minggu, 11.30 sampai 22.30',
  hero: { tagL: ['Kaiseki & omakase', 'di Jakarta Selatan'], tagR: ['Makan malam,', '18.00 sampai 22.30'], cta: 'Reservasi meja', link: 'Rencanakan wedding', alt: 'Tangan chef menata nigiri uni dan tuna di atas papan kayu' },
  night: { label: 'Tentang Shion', statement: 'Shion adalah bunga aster ungu. Dalam bahasa bunga Jepang, artinya aku tidak akan melupakanmu. Kami memasak supaya malam Anda di sini juga begitu.', close: 'Kebayoran Baru, Jakarta Selatan' },
  season: {
    label: 'Di counter minggu ini', title: 'Yang dikirim laut dan ladang',
    intro: 'Setiap Selasa dan Jumat, ikan tiba dari Jepang dan sayur dari petani di Lembang. Inilah yang ada di counter minggu ini, untuk à la carte atau di dalam paket malam Anda.',
    items: [
      { name: 'Uni Hokkaido', meta: 'Hokkaido, Jepang · dua kali seminggu · Rp 185.000 per gunkan', note: 'Manis dan lembut seperti custard dari laut. Disajikan di atas nasi hangat, tanpa kecap.', alt: 'Sushi gunkan dengan uni oranye di atas nasi' },
      { name: 'Otoro', meta: 'Pasar Toyosu, Tokyo · Rp 420.000 per 4 potong', note: 'Bagian perut tuna yang paling berlemak. Kami diamkan sehari supaya rasanya keluar penuh.', alt: 'Satu nigiri otoro di atas counter gelap' },
      { name: 'Wagyu A5 Kagoshima', meta: 'Kagoshima, Jepang · 80 gram · Rp 680.000', note: 'Dipanggang di atas arang binchotan, diiris tipis, cukup garam laut dan wasabi segar.', alt: 'Irisan wagyu panggang dengan ikan dan sayur di piring keramik' },
      { name: 'Shiitake Lembang', meta: 'Petani di Lembang, Bandung · ada di paket Take dan Matsu', note: 'Dipetik pagi, dibakar sore. Aromanya mengisi seluruh counter sebelum piringnya sampai.', alt: 'Jamur shiitake segar tumbuh di batang kayu' },
      { name: 'Yuzu', meta: 'Kochi, Jepang · untuk ponzu dan sorbet', note: 'Jeruk Jepang yang harum. Kulitnya untuk saus, sarinya untuk penutup yang segar.', alt: 'Buah yuzu kuning dalam mangkuk kaca' },
      { name: 'Ikura & Hotate', meta: 'Hokkaido, Jepang · Rp 165.000 per pasang', note: 'Telur salmon yang pecah di lidah, dengan scallop manis di sampingnya.', alt: 'Sushi ikura, uni, dan scallop berjajar' },
    ],
    more: 'Pesan meja di counter malam ini',
  },
  work: {
    label: 'Dari dapur', title: 'Yang keluar dari counter', link: 'Lihat tiga paket dinner',
    items: [
      { title: 'Otsukuri lima jenis', caption: 'Paket Matsu · musim gugur', alt: 'Sashimi aneka ikan dengan daun shiso' },
      { title: 'Nigiri akami', caption: 'Counter hinoki · à la carte', alt: 'Dua nigiri tuna di atas piring bermotif emas' },
      { title: 'Sebelum tamu datang', caption: 'Setiap kursi disiapkan satu per satu', alt: 'Counter kayu dengan sumpit, handuk putih, dan cangkir teh' },
      { title: 'Tempura musiman', caption: 'Paket Ume · garam matcha', alt: 'Tempura udang dan sayur di atas kertas' },
      { title: 'Wagashi musim semi', caption: 'Penutup paket Take', alt: 'Wagashi merah muda berbentuk bunga di piring keramik' },
      { title: 'Owan', caption: 'Sup dashi dalam mangkuk lacquer', alt: 'Mangkuk lacquer berisi sup dashi bening' },
    ],
  },
  dusk: {
    label: 'Malam di Shion', title: 'Satu malam omakase, dari pukul enam sampai sepuluh',
    intro: 'Paket Matsu disajikan di counter hinoki dalam sepuluh course. Beginilah malam Anda berjalan, satu jam demi satu jam.',
    panels: [
      { name: 'Sakizuke', text: 'Hidangan pembuka musiman tiba bersama teh hangat. Chef memperkenalkan bahan malam ini satu per satu.', alt: 'Piring hassun kecil berisi hidangan pembuka' },
      { name: 'Owan', text: 'Sup dashi bening dalam mangkuk lacquer. Buka tutupnya pelan, aromanya datang lebih dulu.', alt: 'Mangkuk lacquer bertutup di atas nampan anyaman' },
      { name: 'Yakimono', text: 'Ikan dan wagyu di atas arang binchotan, dibalik sekali saja. Di sinilah counter paling ramai.', alt: 'Ikan bakar utuh dengan jeruk nipis' },
      { name: 'Shokuji', text: 'Nasi, sup miso, dan acar. Hidangan hangat yang menutup bagian utama sebelum yang manis.', alt: 'Dua tangan memegang mangkuk berisi sup miso' },
      { name: 'Kanmi', text: 'Manisan musiman dan secangkir matcha. Malamnya selesai, kenangannya belum.', alt: 'Tiga wagashi putih di atas nampan kayu' },
    ],
  },
  standing: {
    label: 'Paket dinner', title: 'Tiga perjalanan rasa',
    intro: 'Ume, Take, dan Matsu mengikuti shō-chiku-bai: plum, bambu, dan pinus, tiga simbol keberuntungan Jepang. Dari pengenalan yang ringan sampai omakase lengkap.',
    cols: ['Paket', 'Isinya', 'Kapan', 'Harga'],
    rows: [
      { code: 'ume', name: 'Ume 梅', what: 'Enam course untuk kunjungan pertama: sashimi tiga jenis, tempura, nasi, dan warabi mochi.', when: 'Makan siang & malam', price: 'Rp 750.000 / orang', cta: 'Pesan Ume' },
      { code: 'take', name: 'Take 竹', what: 'Kaiseki musiman dalam delapan course, dengan gindara saikyo-yaki dan nasi kamameshi.', when: 'Makan malam', price: 'Rp 1.150.000 / orang', cta: 'Pesan Take' },
      { code: 'matsu', name: 'Matsu 松', what: 'Omakase lengkap sepuluh course di counter hinoki, termasuk otoro, uni, dan wagyu A5.', when: 'Pukul 18.00 atau 20.30', price: 'Rp 1.850.000 / orang', cta: 'Pesan Matsu' },
    ],
    foot: 'Paket dibayar di muka saat reservasi, minimal dua orang. Pantangan makanan bisa disesuaikan dengan pemberitahuan 24 jam sebelumnya.',
  },
  events: {
    label: 'Wedding & acara privat', title: 'Seluruh restoran, untuk satu cerita',
    body: 'Resepsi intim, lamaran, dan makan malam keluarga. Ruang ditutup untuk umum, menu kaiseki disusun bersama chef, dan setiap tamu mendapat undangan digital dengan QR untuk masuk.',
    kinds: [
      { name: 'Resepsi wedding', meta: 'mulai Rp 950.000 per orang · 40 sampai 80 tamu' },
      { name: 'Lamaran & makan keluarga', meta: 'Tsuki Private Room · hingga 12 tamu' },
      { name: 'Buyout acara kantor', meta: 'harga setelah konsultasi' },
    ],
    cta: 'Ajukan tanggal',
    alts: ['Meja makan malam dengan lilin dan gelas kristal', 'Counter panjang yang sudah disiapkan untuk tamu', 'Meja resepsi dengan bunga merah dan lilin', 'Tempat lilin bercabang menyala di ruang makan', 'Chef di balik counter kayu melayani tamu', 'Ruang makan Jepang yang redup'],
  },
  faq: {
    label: 'Pertanyaan', title: 'Sebelum Anda datang', intro: 'Pertanyaan lain? Kirim WhatsApp ke restoran. Yang membalas orang, bukan robot.',
    items: [
      { q: 'Apakah Shion halal?', a: 'Dapur kami tidak bersertifikat halal. Beberapa hidangan memakai mirin atau sake, dan satu hidangan mengandung babi. Kami menyiapkan menu tanpa babi dan tanpa alkohol bila diminta saat reservasi.' },
      { q: 'Berapa lama meja ditahan?', a: 'Lima belas menit dari jam reservasi. Kalau terlambat, kabari kami lewat WhatsApp.' },
      { q: 'Bagaimana kalau saya alergi?', a: 'Tulis di kolom catatan saat reservasi. Chef akan menyesuaikan hidangan atau menghubungi Anda lebih dulu.' },
      { q: 'Boleh membawa anak?', a: 'Boleh di ruang makan utama dan ruang privat. Counter hinoki untuk usia 12 tahun ke atas.' },
      { q: 'Berapa minimal tamu untuk wedding?', a: 'Empat puluh tamu untuk buyout penuh. Untuk acara lebih kecil, gunakan Tsuki Private Room, hingga 12 tamu.' },
      { q: 'Bagaimana tamu wedding masuk?', a: 'Tamu membuka undangan digitalnya dan menunjukkan QR ke tim penyambut. Kalau HP tamu mati, kami cukup mencari namanya di daftar.' },
    ],
  },
  contact: {
    label: 'Reservasi', title: 'Pesan meja Anda',
    name: 'Nama', phone: 'Nomor WhatsApp', date: 'Tanggal', time: 'Jam', pax: 'Jumlah tamu', type: 'Jenis reservasi', estimate: 'Perkiraan jumlah tamu', session: 'Sesi', notes: 'Alergi, pantangan, atau catatan',
    types: { table: 'Meja à la carte', ume: 'Paket Ume', take: 'Paket Take', matsu: 'Paket Matsu', wedding: 'Wedding atau acara privat' },
    sessions: { dinner: 'Malam, 18.00 sampai 22.30', lunch: 'Siang, 11.00 sampai 15.00' },
    people: 'orang', submit: 'Kirim reservasi', sending: 'Mengirim…',
    done: (code: string) => `Terima kasih. Kode reservasi Anda ${code}. Kami konfirmasi lewat WhatsApp sebelum pukul 17.00.`,
    doneWedding: (code: string) => `Terima kasih. Kode permintaan Anda ${code}. Event manager kami menghubungi Anda dalam satu hari kerja.`,
    again: 'Buat reservasi lain',
    demo: 'Mode demo: data hanya tersimpan di browser ini.',
    info: { address: 'Alamat', open: 'Buka', whatsapp: 'WhatsApp', email: 'Email', hours: ['Selasa sampai Minggu', '11.30–15.00 & 18.00–22.30'] },
    alt: 'Counter sushi kayu dengan piring, kecap, dan sumpit yang sudah disiapkan',
  },
  footer: {
    restaurant: 'Restoran', events: 'Acara', find: 'Temukan kami', credits: 'Kredit foto', creditsOpen: 'Lihat semua kredit', closed: 'Selasa sampai Minggu · Senin tutup', back: 'Kembali ke atas', reserve: 'Reservasi', weddings: 'Wedding & acara privat',
    creditsText: 'Foto dari Flickr lewat Openverse, lisensi CC BY 2.0: itsmisteryeo, Jun Seita, loustejskal.com, City Foodsters, Wendell Smith, Goat Tree Designs, naotakem, G.A.I.N, kawanet, Ruth and Dave, Nullumayulife, adactio, Swami Stream, rennes_i, CarbonNYC, spinster cardigan.',
    base: 'Restoran fiktif untuk portofolio. Template dasar:',
  },
};

export type HomeCopy = typeof id;

const en: HomeCopy = {
  skip: 'Skip to content',
  nav: { season: 'This week', work: 'Dishes', dusk: 'An evening', standing: 'Dinner courses', events: 'Weddings', faq: 'Questions', reserve: 'Reserve a table', open: 'Open the menu', close: 'Close the menu', top: 'Shion, back to the top' },
  addressLine: 'Jl. Contoh Raya No. 88, Kebayoran Baru · Tuesday to Sunday, 11:30 to 22:30',
  hero: { tagL: ['Kaiseki & omakase', 'in South Jakarta'], tagR: ['Dinner,', '18:00 to 22:30'], cta: 'Reserve a table', link: 'Plan a wedding', alt: 'A chef’s hands placing uni and tuna nigiri on a wooden board' },
  night: { label: 'About Shion', statement: 'Shion is the purple aster. In the Japanese language of flowers it means I will not forget you. We cook so that your evening here stays with you the same way.', close: 'Kebayoran Baru, South Jakarta' },
  season: {
    label: 'At the counter this week', title: 'What the sea and fields sent',
    intro: 'Every Tuesday and Friday, fish arrives from Japan and vegetables from farmers in Lembang. This is what is at the counter this week, à la carte or inside your dinner course.',
    items: [
      { name: 'Hokkaido uni', meta: 'Hokkaido, Japan · twice a week · Rp 185,000 per gunkan', note: 'Sweet and soft, like a custard from the sea. Served on warm rice, no soy sauce.', alt: 'Gunkan sushi topped with orange uni' },
      { name: 'Otoro', meta: 'Toyosu Market, Tokyo · Rp 420,000 for 4 slices', note: 'The fattiest part of the tuna belly. We rest it for a day so the flavour opens fully.', alt: 'A single otoro nigiri on a dark counter' },
      { name: 'Kagoshima A5 wagyu', meta: 'Kagoshima, Japan · 80 grams · Rp 680,000', note: 'Grilled over binchotan charcoal, sliced thin, with sea salt and fresh wasabi.', alt: 'Sliced grilled wagyu with fish and vegetables on a ceramic plate' },
      { name: 'Lembang shiitake', meta: 'Farmers in Lembang, Bandung · in the Take and Matsu courses', note: 'Picked in the morning, grilled in the evening. The aroma reaches the whole counter before the plate does.', alt: 'Fresh shiitake mushrooms growing on a log' },
      { name: 'Yuzu', meta: 'Kochi, Japan · for ponzu and sorbet', note: 'A fragrant Japanese citrus. The zest goes into sauces, the juice into a bright dessert.', alt: 'Yellow yuzu in a glass bowl' },
      { name: 'Ikura & hotate', meta: 'Hokkaido, Japan · Rp 165,000 a pair', note: 'Salmon roe that bursts on the tongue, with a sweet scallop beside it.', alt: 'A row of ikura, uni and scallop sushi' },
    ],
    more: 'Book a counter seat tonight',
  },
  work: {
    label: 'From the kitchen', title: 'What leaves the counter', link: 'See the three dinner courses',
    items: [
      { title: 'Five-kind otsukuri', caption: 'Matsu course · autumn', alt: 'Assorted sashimi with shiso leaves' },
      { title: 'Akami nigiri', caption: 'Hinoki counter · à la carte', alt: 'Two tuna nigiri on a gold-patterned plate' },
      { title: 'Before guests arrive', caption: 'Every seat is set by hand', alt: 'A wooden counter set with chopsticks, a white towel and a tea cup' },
      { title: 'Seasonal tempura', caption: 'Ume course · matcha salt', alt: 'Prawn and vegetable tempura on paper' },
      { title: 'Spring wagashi', caption: 'Dessert of the Take course', alt: 'Pink flower-shaped wagashi on a ceramic plate' },
      { title: 'Owan', caption: 'Dashi soup in a lacquer bowl', alt: 'A lacquer bowl of clear dashi soup' },
    ],
  },
  dusk: {
    label: 'An evening at Shion', title: 'One omakase evening, from six to ten',
    intro: 'The Matsu course is served at the hinoki counter in ten courses. This is how your evening unfolds, hour by hour.',
    panels: [
      { name: 'Sakizuke', text: 'A seasonal opener arrives with warm tea. The chef introduces tonight’s ingredients one by one.', alt: 'A small hassun plate of starters' },
      { name: 'Owan', text: 'Clear dashi in a lacquer bowl. Lift the lid slowly; the aroma comes first.', alt: 'A lidded lacquer bowl on a woven tray' },
      { name: 'Yakimono', text: 'Fish and wagyu over binchotan, turned only once. This is when the counter is busiest.', alt: 'A whole grilled fish with lime' },
      { name: 'Shokuji', text: 'Rice, miso soup and pickles. A warm close to the savoury courses before the sweet.', alt: 'Two hands holding a bowl of miso soup' },
      { name: 'Kanmi', text: 'Seasonal sweets and a cup of matcha. The evening ends; the memory does not.', alt: 'Three white wagashi on a wooden tray' },
    ],
  },
  standing: {
    label: 'Dinner courses', title: 'Three journeys',
    intro: 'Ume, Take and Matsu follow shō-chiku-bai: plum, bamboo and pine, three Japanese symbols of good fortune. From a light introduction to the full omakase.',
    cols: ['Course', 'What comes', 'When', 'Price'],
    rows: [
      { code: 'ume', name: 'Ume 梅', what: 'Six courses for a first visit: three kinds of sashimi, tempura, rice and warabi mochi.', when: 'Lunch & dinner', price: 'Rp 750,000 / person', cta: 'Book Ume' },
      { code: 'take', name: 'Take 竹', what: 'Seasonal kaiseki in eight courses, with gindara saikyo-yaki and kamameshi rice.', when: 'Dinner', price: 'Rp 1,150,000 / person', cta: 'Book Take' },
      { code: 'matsu', name: 'Matsu 松', what: 'The full ten-course omakase at the hinoki counter, with otoro, uni and A5 wagyu.', when: '18:00 or 20:30', price: 'Rp 1,850,000 / person', cta: 'Book Matsu' },
    ],
    foot: 'Courses are prepaid at booking, for two or more. Dietary needs can be accommodated with 24 hours’ notice.',
  },
  events: {
    label: 'Weddings & private events', title: 'The whole restaurant, for one story',
    body: 'Intimate receptions, engagements and family dinners. The restaurant closes to the public, the kaiseki menu is designed with our chef, and every guest receives a digital invitation with a QR for entry.',
    kinds: [
      { name: 'Wedding reception', meta: 'from Rp 950,000 per guest · 40 to 80 guests' },
      { name: 'Engagements & family dinners', meta: 'Tsuki Private Room · up to 12 guests' },
      { name: 'Company buyouts', meta: 'priced after a consultation' },
    ],
    cta: 'Request a date',
    alts: ['A dinner table with candles and crystal glasses', 'A long counter set for guests', 'A reception table with red flowers and candles', 'Lit candelabra in a dining room', 'A chef behind the wooden counter serving guests', 'A dim Japanese dining room'],
  },
  faq: {
    label: 'Questions', title: 'Before you come', intro: 'Anything else? Message the restaurant on WhatsApp. A person answers, not a bot.',
    items: [
      { q: 'Is Shion halal?', a: 'Our kitchen is not halal-certified. Some dishes are cooked with mirin or sake, and one dish contains pork. We prepare pork-free and alcohol-free menus when you ask at booking.' },
      { q: 'How long is my table held?', a: 'Fifteen minutes past your booking time. If you are running late, message us on WhatsApp.' },
      { q: 'What if I have allergies?', a: 'Add them in the notes when you book. Our chef will adjust the dishes or contact you first.' },
      { q: 'Can I bring children?', a: 'Yes, in the main dining room and the private room. The hinoki counter is for ages 12 and up.' },
      { q: 'What is the minimum for a wedding?', a: 'Forty guests for a full buyout. For smaller events, book the Tsuki Private Room, up to 12 guests.' },
      { q: 'How do wedding guests check in?', a: 'Guests open their digital invitation and show the QR to our welcome team. If a phone is off, we simply find the name on the list.' },
    ],
  },
  contact: {
    label: 'Reservations', title: 'Book your table',
    name: 'Name', phone: 'WhatsApp number', date: 'Date', time: 'Time', pax: 'Guests', type: 'Booking type', estimate: 'Estimated guests', session: 'Session', notes: 'Allergies, dietary needs or notes',
    types: { table: 'À la carte table', ume: 'Ume course', take: 'Take course', matsu: 'Matsu course', wedding: 'Wedding or private event' },
    sessions: { dinner: 'Dinner, 18:00 to 22:30', lunch: 'Lunch, 11:00 to 15:00' },
    people: 'guests', submit: 'Send booking', sending: 'Sending…',
    done: (code: string) => `Thank you. Your booking code is ${code}. We will confirm on WhatsApp before 17:00.`,
    doneWedding: (code: string) => `Thank you. Your request code is ${code}. Our event manager will contact you within one business day.`,
    again: 'Make another booking',
    demo: 'Demo mode: data is only stored in this browser.',
    info: { address: 'Address', open: 'Open', whatsapp: 'WhatsApp', email: 'Email', hours: ['Tuesday to Sunday', '11:30–15:00 & 18:00–22:30'] },
    alt: 'A wooden sushi counter set with plates, soy sauce and chopsticks',
  },
  footer: {
    restaurant: 'Restaurant', events: 'Events', find: 'Find us', credits: 'Photo credits', creditsOpen: 'See all credits', closed: 'Tuesday to Sunday · closed Mondays', back: 'Back to the top', reserve: 'Reservations', weddings: 'Weddings & private events',
    creditsText: 'Photos from Flickr via Openverse, licensed CC BY 2.0: itsmisteryeo, Jun Seita, loustejskal.com, City Foodsters, Wendell Smith, Goat Tree Designs, naotakem, G.A.I.N, kawanet, Ruth and Dave, Nullumayulife, adactio, Swami Stream, rennes_i, CarbonNYC, spinster cardigan.',
    base: 'A fictional restaurant for a portfolio. Base template:',
  },
};

export const homeCopy: Record<Lang, HomeCopy> = { id, en };
