# Shion — Konten Situs (ID / EN)

Sumber konten untuk semua halaman Shion. Teks di sini menjadi isi `i18n/{id,en}.json` dan seed database.

- Shion adalah restoran **fiktif** untuk portofolio. Alamat, nomor telepon, dan email di bawah adalah placeholder.
- Harga dalam Rupiah, sudah termasuk pajak dan service (ditulis sebagai "nett").
- Setiap teks punya versi Indonesia (ID) dan Inggris (EN).

---

## 1. Identitas

| | ID | EN |
|---|---|---|
| Nama | Shion | Shion |
| Kanji | 紫苑 | 紫苑 |
| Tagline | Santapan Jepang, dikenang selamanya. | Japanese dining, remembered. |
| Tagline pendek | Kaiseki & Omakase | Kaiseki & Omakase |
| Deskripsi meta (SEO) | Shion adalah restoran Jepang di Jakarta Selatan untuk kaiseki, omakase, dan perayaan pernikahan yang intim. | Shion is a Japanese restaurant in South Jakarta for kaiseki, omakase, and intimate wedding celebrations. |

**Kontak (placeholder)**
- Alamat: Jl. Contoh Raya No. 88, Kebayoran Baru, Jakarta Selatan 12190
- Telepon / WhatsApp: +62 812 0000 0000
- Email: hello@shion.example
- Instagram: @shion.example

**Jam buka**

| | ID | EN |
|---|---|---|
| Makan siang | Selasa–Minggu, 11.30–15.00 | Tuesday–Sunday, 11:30–15:00 |
| Makan malam | Selasa–Minggu, 18.00–22.30 | Tuesday–Sunday, 18:00–22:30 |
| Tutup | Senin | Closed on Mondays |
| Pesanan terakhir | 30 menit sebelum tutup | Last order 30 minutes before closing |

---

## 2. Beranda

### Hero
- **ID:** Setiap hidangan, sebuah kenangan.
  *Sub:* Kaiseki musiman dan omakase di jantung Jakarta Selatan.
- **EN:** Every course, a memory.
  *Sub:* Seasonal kaiseki and omakase in the heart of South Jakarta.
- **CTA utama:** Reservasi Meja / Reserve a Table
- **CTA kedua:** Lihat Paket Dinner / View Dinner Courses

### Blok cerita singkat
- **ID:** Shion (紫苑) adalah nama bunga aster ungu. Dalam bahasa bunga Jepang, ia berarti *"aku tidak akan melupakanmu."* Kami memasak dengan niat yang sama: menyajikan malam yang terus diingat.
- **EN:** Shion (紫苑) is the Japanese name for the purple aster. In the Japanese language of flowers, it means *"I will not forget you."* We cook with the same intention: to serve an evening that stays with you.
- **Link:** Cerita kami / Our story

### Tiga pilar
1. **Musim / Seasonality**
   - ID: Menu berganti mengikuti musim. Ikan dikirim dari Jepang dua kali seminggu, sayur dari petani di Lembang.
   - EN: The menu follows the seasons. Fish arrives from Japan twice a week, vegetables from farmers in Lembang.
2. **Ketelitian / Craft**
   - ID: Setiap hidangan disiapkan di depan Anda oleh chef di meja hinoki.
   - EN: Every course is prepared in front of you by our chefs at the hinoki counter.
3. **Ruang / Space**
   - ID: Interior kayu, kertas washi, dan cahaya lembut. Tenang, tanpa terburu-buru.
   - EN: Wood, washi paper, and soft light. Calm, never rushed.

### Blok paket dinner
- **ID:** Tiga perjalanan rasa. Ume, Take, dan Matsu: dari pengenalan yang ringan hingga omakase lengkap.
- **EN:** Three journeys. Ume, Take, and Matsu: from a light introduction to a full omakase.
- **CTA:** Pilih Paket / Choose a Course

### Blok wedding
- **ID:** Rayakan hari Anda di Shion. Buyout restoran untuk resepsi intim hingga 80 tamu duduk, lengkap dengan undangan digital dan check-in tamu.
- **EN:** Celebrate your day at Shion. A full restaurant buyout for intimate receptions of up to 80 seated guests, complete with digital invitations and guest check-in.
- **CTA:** Rencanakan Pernikahan / Plan Your Wedding

### Penutup
- **ID:** Kami menantikan Anda. *Omachi shite orimasu.*
- **EN:** We look forward to welcoming you. *Omachi shite orimasu.*

---

## 3. Cerita (halaman Tentang)

**Judul:** Tentang Shion / About Shion

**ID**

Shion dibuka di Kebayoran Baru dengan satu ide sederhana: makan malam Jepang yang tenang, jujur, dan mengikuti musim.

Nama kami diambil dari bunga aster ungu, 紫苑. Di Jepang, bunga ini melambangkan kenangan, *kimi wo wasurenai*, "aku tidak akan melupakanmu." Kami ingin setiap tamu pulang membawa satu momen yang terus diingat. Bisa rasa pertama otoro, aroma dashi yang baru diseduh, atau tawa keluarga di malam pernikahan.

Dapur kami dipimpin oleh Chef Kenji Arata, yang belajar kaiseki selama dua belas tahun di Kyoto sebelum pindah ke Jakarta. Ia memadukan teknik tradisional dengan bahan terbaik dari Jepang dan Nusantara, dari uni Hokkaido sampai jamur dari lereng Lembang.

Ruang makan kami dirancang dengan prinsip *ma* (間), ruang kosong yang memberi napas. Meja counter dari kayu hinoki untuk 12 tamu, ruang makan utama, satu ruang privat, dan teras taman kecil.

**EN**

Shion opened in Kebayoran Baru with one simple idea: a Japanese dinner that is calm, honest, and true to the season.

Our name comes from the purple aster, 紫苑. In Japan, the flower stands for remembrance, *kimi wo wasurenai*, "I will not forget you." We want every guest to leave with one moment that stays with them. It might be the first taste of otoro, the scent of freshly drawn dashi, or a family's laughter on a wedding night.

Our kitchen is led by Chef Kenji Arata, who trained in kaiseki for twelve years in Kyoto before moving to Jakarta. He pairs traditional technique with the finest ingredients from Japan and the Indonesian archipelago, from Hokkaido uni to mushrooms grown on the slopes of Lembang.

The dining room is designed around *ma* (間), the space between things that lets a room breathe. A twelve-seat hinoki counter, the main dining room, one private room, and a small garden terrace.

> Chef Kenji Arata adalah tokoh fiktif.

---

## 4. Ruang

| Kode | Nama | Kapasitas | ID | EN |
|---|---|---|---|---|
| `counter` | Hinoki Counter | 12 duduk | Kursi di depan chef. Paling cocok untuk omakase. | Seats facing the chef. Best for omakase. |
| `hana` | Hana Dining Room | 48 duduk | Ruang makan utama dengan jendela ke taman. | The main dining room, overlooking the garden. |
| `tsuki` | Tsuki Private Room | 12 duduk | Ruang privat tatami modern dengan kursi. Cocok untuk lamaran dan acara keluarga. | A modern tatami-style private room with chairs. Ideal for engagements and family dinners. |
| `engawa` | Engawa Garden Terrace | 30 duduk / 50 berdiri | Teras kayu dengan taman batu dan lentera. | A wooden terrace with a stone garden and lanterns. |

**Buyout penuh (wedding):** hingga 80 tamu duduk atau 120 tamu berdiri (Hana + Engawa + Counter).

---

## 5. Menu à la carte

Keterangan label:
- 🐟 **Mentah** / Raw
- 🍶 **Alkohol** (termasuk mirin atau sake dalam masakan) / Contains alcohol (including mirin or sake in cooking)
- 🐖 **Babi** / Pork
- 🌿 **Vegetarian**
- 🌶 **Pedas** / Spicy

> Di data, label disimpan sebagai flag `contains_raw`, `contains_alcohol`, `contains_pork`, `vegetarian`, `spicy`. Ikon di atas hanya untuk dokumen ini; di UI gunakan ikon garis yang konsisten.

### 5.1 Zensai — Pembuka / Starters

| Nama | ID | EN | Harga | Label |
|---|---|---|---|---|
| Goma Dofu | Tahu wijen lembut dengan saus dashi dan wasabi segar. | Silky sesame tofu with dashi sauce and fresh wasabi. | 85.000 | 🌿 |
| Edamame Yuzu Shio | Edamame hangat dengan garam yuzu. | Warm edamame with yuzu salt. | 55.000 | 🌿 |
| Hotate Carpaccio | Kerang scallop Hokkaido, ponzu, minyak shiso. | Hokkaido scallop, ponzu, shiso oil. | 165.000 | 🐟 🍶 |
| Tamago Dashimaki | Telur gulung dashi, disajikan hangat. | Rolled dashi omelette, served warm. | 70.000 | 🍶 |

### 5.2 Sashimi

| Nama | ID | EN | Harga | Label |
|---|---|---|---|---|
| Sake Sashimi | Salmon Norwegia, 5 potong. | Norwegian salmon, 5 slices. | 145.000 | 🐟 |
| Hamachi Sashimi | Ekor kuning Jepang, 5 potong. | Japanese yellowtail, 5 slices. | 195.000 | 🐟 |
| Otoro Sashimi | Perut tuna berlemak tinggi, 4 potong. | Fatty tuna belly, 4 slices. | 420.000 | 🐟 |
| Moriawase Shion | Pilihan chef, 5 jenis ikan, 15 potong. | Chef's selection, 5 kinds of fish, 15 slices. | 485.000 | 🐟 |

### 5.3 Sushi

| Nama | ID | EN | Harga | Label |
|---|---|---|---|---|
| Nigiri Set Ume | 8 nigiri pilihan chef. | 8 pieces of chef's nigiri. | 285.000 | 🐟 |
| Nigiri Set Matsu | 12 nigiri termasuk otoro dan uni. | 12 pieces including otoro and uni. | 595.000 | 🐟 |
| Negitoro Maki | Gulungan tuna cincang dan daun bawang. | Minced tuna and scallion roll. | 135.000 | 🐟 |
| Yasai Maki | Gulungan sayur musiman, acar, alpukat. | Seasonal vegetables, pickles, and avocado roll. | 85.000 | 🌿 |

### 5.4 Yakimono — Panggang / Grilled

| Nama | ID | EN | Harga | Label |
|---|---|---|---|---|
| Gindara Saikyo-yaki | Ikan cod hitam dimarinasi miso putih Kyoto. | Black cod marinated in Kyoto white miso. | 325.000 | 🍶 |
| Wagyu Sumibi-yaki | Wagyu A5 Kagoshima, 80 g, dipanggang arang binchotan. | Kagoshima A5 wagyu, 80 g, grilled over binchotan charcoal. | 680.000 | |
| Tori Teriyaki | Paha ayam kampung, saus teriyaki buatan sendiri. | Free-range chicken thigh with house teriyaki. | 145.000 | 🍶 |
| Nasu Dengaku | Terong panggang dengan miso manis. | Grilled eggplant with sweet miso glaze. | 75.000 | 🌿 🍶 |

### 5.5 Agemono & Nimono — Goreng & Rebus / Fried & Simmered

| Nama | ID | EN | Harga | Label |
|---|---|---|---|---|
| Ebi Tempura | Udang tiger, 4 ekor, garam matcha. | Tiger prawns, 4 pieces, matcha salt. | 165.000 | |
| Yasai Tempura | Sayur musiman, 6 potong. | Seasonal vegetables, 6 pieces. | 95.000 | 🌿 |
| Buta Kakuni | Perut babi rebus pelan 8 jam dengan shoyu dan sake. | Pork belly braised for 8 hours in shoyu and sake. | 185.000 | 🐖 🍶 |
| Agedashi Dofu | Tahu goreng dalam kuah dashi hangat. | Fried tofu in warm dashi broth. | 75.000 | 🍶 |

### 5.6 Gohan & Men — Nasi & Mi / Rice & Noodles

| Nama | ID | EN | Harga | Label |
|---|---|---|---|---|
| Unagi Don | Belut panggang di atas nasi, saus tare. | Grilled eel over rice with tare sauce. | 245.000 | 🍶 |
| Kaisen Don | Nasi dengan sashimi pilihan chef. | Rice bowl with chef's selection of sashimi. | 265.000 | 🐟 |
| Kitsune Udon | Udon dalam kuah dashi dengan tahu manis. | Udon in dashi broth with sweet fried tofu. | 95.000 | 🌿 |
| Spicy Tantan Udon | Udon kuah wijen pedas dengan ayam cincang. | Udon in spicy sesame broth with minced chicken. | 115.000 | 🌶 |

> Kitsune Udon vegetarian hanya jika memakai dashi kombu-shiitake. Pastikan versi ini yang disajikan, atau hapus label 🌿.

### 5.7 Kanmi — Pencuci Mulut / Desserts

| Nama | ID | EN | Harga | Label |
|---|---|---|---|---|
| Matcha Tiramisu | Lapisan mascarpone dan matcha Uji. | Mascarpone layered with Uji matcha. | 85.000 | 🍶 |
| Warabi Mochi | Mochi pakis dengan kinako dan kuromitsu. | Bracken mochi with kinako and black sugar syrup. | 65.000 | 🌿 |
| Yuzu Sorbet | Sorbet yuzu segar. | Fresh yuzu sorbet. | 55.000 | 🌿 |

### 5.8 Minuman / Drinks

| Nama | ID | EN | Harga | Label |
|---|---|---|---|---|
| Sencha Hangat | Teh hijau Shizuoka. | Shizuoka green tea. | 35.000 | 🌿 |
| Hojicha Latte | Teh panggang dengan susu. | Roasted green tea with milk. | 55.000 | 🌿 |
| Yuzu Soda | Yuzu, madu, soda. | Yuzu, honey, soda. | 55.000 | 🌿 |
| Sake Junmai Ginjo (gelas) | Pilihan sommelier, 120 ml. | Sommelier's selection, 120 ml. | 165.000 | 🍶 |
| Umeshu (gelas) | Likuer plum Jepang. | Japanese plum liqueur. | 115.000 | 🍶 |

### Catatan menu (tampil di bawah halaman menu)
- **ID:** Beberapa hidangan memakai mirin atau sake dalam proses memasak. Satu hidangan mengandung babi dan ditandai jelas. Dapur kami tidak bersertifikat halal. Beri tahu kami soal alergi atau pantangan saat reservasi, dan chef akan menyesuaikan.
- **EN:** Some dishes are cooked with mirin or sake. One dish contains pork and is clearly marked. Our kitchen is not halal-certified. Let us know about allergies or dietary needs when you book, and our chef will adjust.

---

## 6. Paket Dinner

**Judul halaman:** Paket Dinner / Dinner Courses
**Intro**
- **ID:** Tiga paket mengikuti *shō-chiku-bai* (松竹梅), pinus, bambu, dan plum: tiga simbol keberuntungan dalam budaya Jepang. Semua paket memakai bahan musiman dan disajikan berurutan.
- **EN:** Our three courses follow *shō-chiku-bai* (松竹梅), pine, bamboo, and plum: three symbols of good fortune in Japanese culture. Every course uses seasonal ingredients and is served in sequence.

### Ume 梅 — Plum
- **Harga:** Rp 750.000 / orang (nett)
- **Jumlah course:** 6
- **Minimal:** 2 orang · **Maksimal:** 12 orang
- **Satu baris (ID):** Perkenalan yang ringan untuk pertama kali ke Shion.
- **Satu baris (EN):** A light introduction for your first visit to Shion.
- **Course:**
  1. Sakizuke — Goma dofu / Sesame tofu
  2. Sashimi — 3 jenis ikan / 3 kinds of fish
  3. Yakimono — Tori teriyaki / Grilled chicken teriyaki
  4. Agemono — Yasai & ebi tempura / Vegetable and prawn tempura
  5. Shokuji — Nasi, miso shiru, tsukemono / Rice, miso soup, pickles
  6. Kanmi — Warabi mochi
- **Tersedia:** makan siang dan makan malam / lunch and dinner

### Take 竹 — Bamboo
- **Harga:** Rp 1.150.000 / orang (nett)
- **Jumlah course:** 8
- **Minimal:** 2 orang · **Maksimal:** 12 orang
- **Satu baris (ID):** Kaiseki musiman yang paling sering dipilih.
- **Satu baris (EN):** Our most loved seasonal kaiseki.
- **Course:**
  1. Sakizuke — Hidangan pembuka musiman / Seasonal amuse-bouche
  2. Owan — Sup bening dashi / Clear dashi soup
  3. Otsukuri — Sashimi 4 jenis / 4 kinds of sashimi
  4. Hassun — Piring musiman / Seasonal platter
  5. Yakimono — Gindara saikyo-yaki
  6. Agemono — Tempura musiman / Seasonal tempura
  7. Shokuji — Nasi kamameshi / Clay-pot rice
  8. Kanmi — Matcha tiramisu
- **Tersedia:** makan malam / dinner only

### Matsu 松 — Pine
- **Harga:** Rp 1.850.000 / orang (nett)
- **Jumlah course:** 10
- **Minimal:** 2 orang · **Maksimal:** 12 orang (Hinoki Counter)
- **Satu baris (ID):** Omakase lengkap di counter, langsung dari tangan chef.
- **Satu baris (EN):** The full omakase at the counter, straight from the chef's hands.
- **Course:**
  1. Sakizuke — Hidangan pembuka musiman / Seasonal amuse-bouche
  2. Owan — Sup dashi dengan hamaguri / Dashi soup with clams
  3. Otsukuri — Sashimi 5 jenis termasuk otoro / 5 kinds of sashimi including otoro
  4. Hassun — Piring musiman / Seasonal platter
  5. Nigiri I — 4 nigiri
  6. Yakimono — Wagyu A5 sumibi-yaki
  7. Nigiri II — 4 nigiri termasuk uni / 4 nigiri including uni
  8. Agemono — Tempura musiman / Seasonal tempura
  9. Shokuji — Akadashi dan tamago / Red miso soup and tamago
  10. Kanmi — Hidangan penutup musiman / Seasonal dessert
- **Tersedia:** makan malam, dua seating: 18.00 dan 20.30 / dinner, two seatings: 18:00 and 20:30

### Tambahan / Add-ons
| ID | EN | Harga |
|---|---|---|
| Pairing sake 3 gelas | 3-glass sake pairing | Rp 395.000 / orang |
| Pairing non-alkohol (teh & yuzu) | Non-alcoholic pairing (tea & yuzu) | Rp 225.000 / orang |
| Kue perayaan kecil | Small celebration cake | Rp 250.000 |

### Catatan paket
- **ID:** Paket dinner membutuhkan pembayaran di muka saat reservasi. Menu bisa berubah sesuai musim. Pantangan makanan bisa disesuaikan bila diberi tahu minimal 24 jam sebelumnya.
- **EN:** Dinner courses require prepayment at booking. Courses may change with the season. Dietary needs can be accommodated with at least 24 hours' notice.

---

## 7. Private Events & Weddings

**Judul halaman:** Pernikahan & Acara Privat / Weddings & Private Events

### Hero
- **ID:** Hari yang ingin Anda kenang, di tempat yang mengingatnya.
  *Sub:* Resepsi intim di Shion, untuk 40 hingga 80 tamu duduk.
- **EN:** The day you want to remember, in a place made for remembering.
  *Sub:* Intimate receptions at Shion, for 40 to 80 seated guests.
- **CTA:** Ajukan Tanggal / Request a Date

### Kenapa Shion
1. **Seluruh restoran untuk Anda / The whole restaurant is yours**
   - ID: Buyout penuh: ruang makan, counter, dan teras taman hanya untuk tamu Anda.
   - EN: A full buyout: dining room, counter, and garden terrace, reserved for your guests.
2. **Menu kaiseki pernikahan / Wedding kaiseki**
   - ID: Menu disusun bersama chef saat sesi tasting, termasuk pilihan tanpa babi dan tanpa alkohol.
   - EN: Your menu is designed with our chef during a tasting session, with pork-free and alcohol-free options.
3. **Undangan digital & check-in / Digital invitations & check-in**
   - ID: Setiap tamu mendapat undangan pribadi dengan RSVP. Saat hari H, tamu cukup menunjukkan QR di undangannya.
   - EN: Every guest receives a personal invitation with RSVP. On the day, guests simply show the QR in their invitation.
4. **Satu koordinator / One coordinator**
   - ID: Satu event manager mendampingi Anda dari konsultasi pertama sampai tamu terakhir pulang.
   - EN: One event manager is with you from the first consultation until the last guest leaves.

### Kapasitas & sesi
| | ID | EN |
|---|---|---|
| Duduk | 40–80 tamu | 40–80 guests |
| Berdiri (cocktail) | hingga 120 tamu | up to 120 guests |
| Sesi siang | 11.00–15.00 | 11:00–15:00 |
| Sesi malam | 18.00–22.30 | 18:00–22:30 |
| Hari | Selasa–Minggu | Tuesday–Sunday |

### Harga mulai
- **ID:** Mulai Rp 950.000 / orang (nett), minimal 40 tamu. Sudah termasuk buyout ruang, menu kaiseki 7 course, minuman non-alkohol, dekorasi meja dasar, dan undangan digital.
- **EN:** From Rp 950,000 per guest (nett), minimum 40 guests. Includes the venue buyout, a 7-course kaiseki menu, non-alcoholic drinks, basic table styling, and digital invitations.

### Alur (tampil sebagai 4 langkah)
1. **Ajukan tanggal / Request a date** — ID: Isi formulir singkat. Kami membalas dalam 1 hari kerja. EN: Fill in a short form. We reply within one business day.
2. **Konsultasi & tasting / Consultation & tasting** — ID: Bertemu event manager dan mencicipi menu bersama chef. EN: Meet your event manager and taste the menu with our chef.
3. **Konfirmasi / Confirmation** — ID: Tanggal dikunci setelah DP 30%. EN: Your date is secured with a 30% deposit.
4. **Undangan & hari H / Invitations & the day** — ID: Kirim undangan digital, pantau RSVP, dan biarkan tim kami menyambut tamu. EN: Send digital invitations, track RSVPs, and let our team welcome your guests.

### Form inquiry (label)
| Field | ID | EN |
|---|---|---|
| `couple_name_1` | Nama mempelai 1 | Partner 1 name |
| `couple_name_2` | Nama mempelai 2 | Partner 2 name |
| `contact_name` | Nama kontak | Contact name |
| `phone` | Nomor WhatsApp | WhatsApp number |
| `email` | Email | Email |
| `event_date` | Tanggal acara | Event date |
| `session` | Sesi | Session |
| `guest_estimate` | Perkiraan jumlah tamu | Estimated guests |
| `notes` | Ceritakan acara impian Anda | Tell us about your day |
| Tombol | Kirim Permintaan | Send Request |
| Sukses | Terima kasih. Event manager kami akan menghubungi Anda dalam 1 hari kerja. Kode permintaan Anda: **{code}** | Thank you. Our event manager will contact you within one business day. Your request code: **{code}** |
| Tanggal penuh | Tanggal dan sesi ini sudah dipesan. Silakan pilih sesi atau tanggal lain. | This date and session is already booked. Please choose another session or date. |

---

## 8. FAQ

### Reservasi / Reservations
1. **ID:** Berapa lama meja ditahan? — Meja kami tahan 15 menit dari jam reservasi.
   **EN:** How long is my table held? — We hold your table for 15 minutes past your booking time.
2. **ID:** Apakah ada dress code? — Smart casual. Mohon tidak memakai parfum yang kuat agar tidak mengganggu aroma hidangan.
   **EN:** Is there a dress code? — Smart casual. Please avoid strong fragrances so they don't overpower the food.
3. **ID:** Bisa membawa anak? — Bisa untuk ruang makan utama dan ruang privat. Hinoki Counter untuk usia 12 tahun ke atas.
   **EN:** Can I bring children? — Yes, in the main dining room and private room. The Hinoki Counter is for ages 12 and up.
4. **ID:** Apakah Shion halal? — Dapur kami tidak bersertifikat halal. Kami menyediakan menu tanpa babi dan tanpa alkohol bila diminta saat reservasi.
   **EN:** Is Shion halal? — Our kitchen is not halal-certified. We can prepare pork-free and alcohol-free menus when requested at booking.
5. **ID:** Bagaimana jika saya alergi? — Tulis di kolom catatan diet. Chef akan menyesuaikan hidangan atau menghubungi Anda.
   **EN:** What if I have allergies? — Note them in the dietary field. Our chef will adjust the dishes or contact you.
6. **ID:** Parkir? — Tersedia valet parking di depan restoran.
   **EN:** Parking? — Valet parking is available at the entrance.

### Wedding
1. **ID:** Berapa minimal tamu? — 40 tamu untuk buyout penuh. Untuk acara lebih kecil, gunakan Tsuki Private Room (hingga 12 tamu).
   **EN:** What is the minimum? — 40 guests for a full buyout. For smaller events, book the Tsuki Private Room (up to 12 guests).
2. **ID:** Bisa membawa vendor sendiri? — Bisa untuk dekorasi, fotografi, dan musik. Makanan dan minuman disediakan oleh Shion.
   **EN:** Can I bring my own vendors? — Yes, for décor, photography, and music. All food and drinks are provided by Shion.
3. **ID:** Bagaimana tamu masuk saat hari H? — Tamu membuka undangan digitalnya dan menunjukkan QR ke tim penyambut. Jika HP tamu mati, kami cukup mencari namanya di daftar.
   **EN:** How do guests check in? — Guests open their digital invitation and show the QR to our welcome team. If a guest's phone is off, we simply find their name on the list.
4. **ID:** Kapan jumlah tamu final? — Paling lambat 7 hari sebelum acara.
   **EN:** When is the final guest count due? — No later than 7 days before the event.
5. **ID:** Bisa akad atau pemberkatan di Shion? — Bisa untuk acara kecil di Engawa Garden Terrace, hingga 50 tamu.
   **EN:** Can we hold the ceremony at Shion? — Yes, for small ceremonies on the Engawa Garden Terrace, up to 50 guests.

---

## 9. Kebijakan

### No-show & pembatalan / No-show & cancellation
- **Meja biasa — ID:** Tidak ada biaya. Mohon kabari kami jika batal, agar meja bisa diberikan ke tamu lain.
  **EN:** No charge. Please let us know if you cancel so we can offer the table to another guest.
- **Paket dinner — ID:** Pembatalan lebih dari 48 jam sebelumnya: refund penuh. Kurang dari 48 jam atau tidak datang: pembayaran tidak dapat dikembalikan.
  **EN:** Cancel more than 48 hours ahead: full refund. Within 48 hours or no-show: payment is non-refundable.
- **Wedding — ID:** DP 30% tidak dapat dikembalikan, tetapi dapat dipindahkan ke tanggal lain satu kali dalam 6 bulan.
  **EN:** The 30% deposit is non-refundable, but can be moved to another date once within 6 months.

### Persetujuan data (RSVP) / Data consent
- **ID (checkbox):** Saya setuju nama, nomor HP, dan preferensi makanan saya digunakan oleh Shion dan mempelai hanya untuk keperluan acara ini. Data akan dihapus paling lambat 30 hari setelah acara.
- **EN (checkbox):** I agree that my name, phone number, and dietary preferences may be used by Shion and the couple for this event only. My data will be deleted no later than 30 days after the event.

### Pemberitahuan privasi singkat (footer)
- **ID:** Kami hanya menyimpan data yang dibutuhkan untuk reservasi dan acara Anda, dan tidak membagikannya ke pihak lain.
- **EN:** We only keep the data needed for your booking or event, and we never share it with third parties.

---

## 10. Reservasi (alur & teks UI)

### Halaman reservasi
- **Judul:** Reservasi / Reservations
- **Sub ID:** Pilih cara Anda ingin bersantap malam ini.
- **Sub EN:** Choose how you would like to dine with us.

**Pilihan jenis**
| Kode | ID | EN |
|---|---|---|
| `table` | Meja à la carte — Pesan langsung dari menu di tempat. | À la carte table — Order from the menu on the night. |
| `dinner_package` | Paket dinner — Ume, Take, atau Matsu. Dibayar di muka. | Dinner course — Ume, Take, or Matsu. Prepaid. |
| (link) | Merencanakan pernikahan? Lihat Weddings. | Planning a wedding? See Weddings. |

**Label form**
| Field | ID | EN |
|---|---|---|
| `date` | Tanggal | Date |
| `time` | Jam | Time |
| `pax` | Jumlah tamu | Guests |
| `package_id` | Paket | Course |
| `guest_name` | Nama lengkap | Full name |
| `phone` | Nomor WhatsApp | WhatsApp number |
| `email` | Email | Email |
| `dietary_notes` | Alergi atau pantangan makanan | Allergies or dietary needs |
| `notes` | Catatan (ulang tahun, kursi bayi, dll.) | Notes (birthday, high chair, etc.) |
| Tombol | Konfirmasi Reservasi | Confirm Reservation |

**Validasi**
| Kasus | ID | EN |
|---|---|---|
| Wajib diisi | Wajib diisi. | This field is required. |
| HP tidak valid | Masukkan nomor WhatsApp yang valid, misalnya 0812xxxxxxxx. | Enter a valid WhatsApp number, e.g. 0812xxxxxxxx. |
| Slot penuh | Jam ini sudah penuh. Coba jam lain di bawah ini. | This time is fully booked. Try one of the times below. |
| Pax di luar batas | Paket ini untuk {min}–{max} orang. | This course is for {min}–{max} guests. |
| Tanggal lalu | Pilih tanggal mulai hari ini. | Please choose today or a later date. |
| Hari Senin | Kami tutup setiap Senin. | We are closed on Mondays. |

### Simulasi pembayaran (paket dinner)
- **Judul:** Pembayaran / Payment
- **ID:** Pindai QRIS di bawah dengan aplikasi bank atau e-wallet Anda. Total: **Rp {total}**. Bayar dalam **15:00** menit.
- **EN:** Scan the QRIS below with your banking or e-wallet app. Total: **Rp {total}**. Pay within **15:00** minutes.
- **Label demo (wajib tampil):** Mode demo — QRIS ini tidak nyata dan tidak ada uang yang ditarik. / Demo mode — this QRIS is not real and no money is charged.
- **Tombol:** Saya sudah bayar (demo) / I've paid (demo)
- **Waktu habis:** Waktu pembayaran habis. Reservasi dibatalkan otomatis. / Payment time expired. Your reservation was cancelled.

### Konfirmasi
- **Judul ID:** Sampai jumpa di Shion.
- **Judul EN:** See you at Shion.
- **Isi ID:** Reservasi Anda tercatat. Simpan kode ini: **{code}**. Kami juga mengirim ringkasan ke email Anda.
- **Isi EN:** Your reservation is confirmed. Keep this code: **{code}**. We have also emailed you a summary.
- **Tombol:** Tambah ke Kalender / Add to Calendar · Hubungi via WhatsApp / Contact via WhatsApp · Lihat Status / View Status

### Cek status
- **ID:** Masukkan kode reservasi dan nomor WhatsApp Anda.
- **EN:** Enter your reservation code and WhatsApp number.

### Nama status
| Kode | ID | EN |
|---|---|---|
| `pending` | Menunggu | Pending |
| `confirmed` | Terkonfirmasi | Confirmed |
| `seated` | Sedang bersantap | Seated |
| `completed` | Selesai | Completed |
| `cancelled` | Dibatalkan | Cancelled |
| `no_show` | Tidak datang | No-show |
| `paid_simulated` | Lunas (demo) | Paid (demo) |

### Status wedding
| Kode | ID | EN |
|---|---|---|
| `inquiry` | Permintaan baru | New inquiry |
| `consultation` | Konsultasi | Consultation |
| `confirmed` | Terkonfirmasi | Confirmed |
| `completed` | Selesai | Completed |
| `cancelled` | Dibatalkan | Cancelled |

---

## 11. Undangan Digital (contoh demo)

Data seed untuk wedding demo. Tanggal acara di seed dibuat relatif: **hari ini + 30 hari**, jatuh di hari Sabtu terdekat, sesi malam. Dengan begitu demo tidak pernah kedaluwarsa.

- **Mempelai:** Rina Maharani & Dimas Pratama
- **Slug:** `rina-dimas`
- **Kode:** `WED-0427`
- **Sesi:** Malam, 18.30–22.00
- **Tamu diperkirakan:** 60

### Teks undangan

**Pembuka**
- **ID:** Dengan penuh syukur, kami mengundang Bapak/Ibu/Saudara/i **{guest_name}** untuk merayakan pernikahan kami.
- **EN:** With grateful hearts, we invite **{guest_name}** to celebrate our wedding.

**Nama**
- Rina & Dimas
- 紫苑 — *kimi wo wasurenai*

**Cerita singkat**
- **ID:** Kami bertemu di sebuah kedai ramen kecil di Bandung, sembilan tahun lalu, saat hujan tidak juga berhenti. Sejak hari itu, setiap makan malam terasa seperti awal cerita yang baru. Kini kami ingin menulis bab berikutnya bersama orang-orang yang kami sayangi.
- **EN:** We met at a small ramen shop in Bandung nine years ago, on an evening when the rain wouldn't stop. Since then, every dinner together has felt like the start of a new story. Now we want to write the next chapter with the people we love.

**Rangkaian acara / Schedule**
| Jam | ID | EN |
|---|---|---|
| 18.30 | Penyambutan tamu & minuman di Engawa Garden | Welcome drinks at the Engawa Garden |
| 19.15 | Pembukaan dan sambutan keluarga | Opening and family speeches |
| 19.30 | Makan malam kaiseki 7 course | Seven-course kaiseki dinner |
| 21.00 | Potong kue & foto bersama | Cake cutting & group photos |
| 22.00 | Penutup | Farewell |

**Dress code**
- **ID:** Formal dengan nuansa warna lembut: ungu muda, krem, atau abu-abu.
- **EN:** Formal, in soft tones: lilac, cream, or grey.

**Lokasi**
- Shion, Jl. Contoh Raya No. 88, Kebayoran Baru, Jakarta Selatan
- **Tombol:** Buka di Google Maps / Open in Google Maps
- **Catatan ID:** Tersedia valet parking.
- **Catatan EN:** Valet parking is available.

**Hadiah**
- **ID:** Kehadiran Anda adalah hadiah terbesar bagi kami.
- **EN:** Your presence is the greatest gift to us.

**Countdown:** {days} hari lagi / {days} days to go

### RSVP
| Elemen | ID | EN |
|---|---|---|
| Judul | Konfirmasi Kehadiran | Will you join us? |
| Batas waktu | Mohon konfirmasi sebelum {rsvp_deadline}. | Please reply by {rsvp_deadline}. |
| Hadir | Saya akan hadir | Joyfully accept |
| Tidak hadir | Maaf, saya tidak bisa hadir | Regretfully decline |
| Jumlah | Jumlah tamu (maks. {max_pax}) | Number of guests (max. {max_pax}) |
| Diet | Pantangan makanan | Dietary needs |
| Pilihan diet | Tanpa babi · Tanpa alkohol · Vegetarian · Tidak makan mentah · Alergi (tulis) | No pork · No alcohol · Vegetarian · No raw food · Allergy (please specify) |
| Ucapan | Ucapan untuk mempelai | A message for the couple |
| Tombol | Kirim RSVP | Send RSVP |
| Sukses hadir | Terima kasih, {guest_name}. Sampai jumpa di hari bahagia kami. Tunjukkan QR di bawah ini saat tiba. | Thank you, {guest_name}. We can't wait to see you. Show the QR below when you arrive. |
| Sukses tidak hadir | Terima kasih atas kabarnya, {guest_name}. Doa Anda sangat berarti bagi kami. | Thank you for letting us know, {guest_name}. Your wishes mean the world to us. |
| Ubah | Ubah jawaban | Change my reply |
| Link tidak valid | Undangan tidak ditemukan. Periksa kembali link dari mempelai. | Invitation not found. Please check the link the couple sent you. |

### QR
- **Label ID:** QR Masuk — tunjukkan ke tim penyambut. Berlaku untuk {pax} orang.
- **Label EN:** Entry QR — show this to our welcome team. Valid for {pax} guests.
- **Tips ID:** Simpan screenshot atau tambahkan halaman ini ke layar utama.
- **Tips EN:** Take a screenshot or add this page to your home screen.

### Pesan WhatsApp (tombol "Bagikan ke WhatsApp" di admin)
- **ID:**
  > Halo {guest_name}, dengan bahagia kami mengundang Anda ke pernikahan kami, Rina & Dimas, pada {event_date} di Shion, Jakarta Selatan. Undangan dan RSVP: {link}
  > Mohon konfirmasi sebelum {rsvp_deadline}. Terima kasih 🙏
- **EN:**
  > Hi {guest_name}, we are delighted to invite you to our wedding, Rina & Dimas, on {event_date} at Shion, South Jakarta. Invitation and RSVP: {link}
  > Please reply by {rsvp_deadline}. Thank you 🙏

### Open Graph (preview link)
- **og:title:** Rina & Dimas — {event_date}
- **og:description ID:** Anda diundang ke pernikahan kami di Shion, Jakarta Selatan.
- **og:description EN:** You're invited to our wedding at Shion, South Jakarta.
- **og:image:** gambar 1200×630, nama pasangan dan tanggal di atas latar washi dengan motif seigaiha.

### Tamu demo (seed)
| Nama | Grup | Maks pax | RSVP | Pax | Diet | Meja | Check-in |
|---|---|---|---|---|---|---|---|
| Budi Santoso | Keluarga | 2 | hadir | 2 | Tanpa babi | 1 | sudah |
| Sari Wulandari | Keluarga | 4 | hadir | 3 | — | 1 | belum |
| Andi Wijaya | Teman | 1 | hadir | 1 | Vegetarian | 4 | belum |
| Maya Putri | Teman | 2 | tidak hadir | 0 | — | — | — |
| Reza Hidayat | Kantor | 2 | belum | — | — | 6 | — |
| Clara Tan | Teman | 2 | hadir | 2 | Alergi udang | 4 | sudah |
| Yusuf Rahman | Kantor | 1 | hadir | 1 | Tanpa babi, tanpa alkohol | 6 | belum |
| Dewi Lestari | Keluarga | 3 | belum | — | — | 2 | — |
| Kevin Halim | Teman | 1 | hadir | 1 | Tidak makan mentah | 5 | belum |
| Nadia Kusuma | Kantor | 2 | tidak hadir | 0 | — | — | — |
| **Tamu Demo (Anda)** | Demo | 2 | belum | — | — | 3 | — |

> "Tamu Demo (Anda)" adalah undangan yang dibuka lewat tombol **Lihat sebagai tamu**. Statusnya kembali ke "belum" setiap reset.

Semua nama tamu di atas fiktif.

---

## 12. Admin (teks UI)

### Navigasi
| Kode | ID | EN |
|---|---|---|
| overview | Ringkasan | Overview |
| reservations | Reservasi | Reservations |
| weddings | Wedding | Weddings |
| checkin | Check-in | Check-in |
| menu | Menu | Menu |
| packages | Paket | Courses |
| settings | Pengaturan | Settings |
| logout | Keluar | Sign out |

### Ringkasan (kartu)
| ID | EN |
|---|---|
| Reservasi hari ini | Today's reservations |
| Tamu hari ini | Guests today |
| Menunggu konfirmasi | Awaiting confirmation |
| Inquiry wedding baru | New wedding inquiries |
| Wedding bulan ini | Weddings this month |

### Detail wedding
| ID | EN |
|---|---|
| Daftar tamu | Guest list |
| Tambah tamu | Add guest |
| Impor CSV | Import CSV |
| Salin link | Copy link |
| Bagikan ke WhatsApp | Share to WhatsApp |
| Rekap RSVP | RSVP summary |
| Rekap diet untuk dapur | Kitchen dietary summary |
| Edit undangan | Edit invitation |
| Pratinjau undangan | Preview invitation |
| Hapus data tamu setelah acara | Delete guest data after the event |

**Format CSV impor:** `name,phone,group_label,max_pax,table_no`

### Check-in (usher)
| Elemen | ID | EN |
|---|---|---|
| Judul | Check-in Tamu | Guest Check-in |
| Counter | {checked_in} dari {attending} tamu telah hadir | {checked_in} of {attending} guests have arrived |
| Tombol scan | Pindai QR | Scan QR |
| Cari | Cari nama tamu | Search guest name |
| Berhasil | Selamat datang, {guest_name}. {pax} orang · Meja {table_no} | Welcome, {guest_name}. {pax} guests · Table {table_no} |
| Diet | Catatan diet: {dietary} | Dietary note: {dietary} |
| Sudah check-in | Sudah check-in pukul {time}. | Already checked in at {time}. |
| QR tidak valid | QR tidak dikenali untuk acara ini. | This QR is not valid for this event. |
| Belum RSVP | Tamu belum RSVP. Check-in tetap? | Guest hasn't RSVP'd. Check in anyway? |
| Offline | Offline — check-in disimpan dan akan dikirim saat online. | Offline — check-ins are saved and will sync when you're back online. |
| Izin kamera | Izinkan akses kamera untuk memindai QR. | Allow camera access to scan QR codes. |

---

## 13. Mode Demo

### Banner (semua halaman)
- **ID:** Mode demo — data contoh, tidak ada transaksi nyata. Data direset setiap 6 jam.
- **EN:** Demo mode — sample data, no real transactions. Data resets every 6 hours.

### Halaman `/demo`
- **Judul ID:** Coba Shion dari tiga sisi.
- **Judul EN:** Try Shion from three sides.
- **Intro ID:** Wedding contoh Rina & Dimas sudah siap. Pilih peran, lalu jelajahi.
- **Intro EN:** The sample wedding of Rina & Dimas is ready. Pick a role and explore.

| Tombol | ID | EN |
|---|---|---|
| Lihat sebagai tamu | Buka undangan pribadi, isi RSVP, dan dapatkan QR. | Open a personal invitation, RSVP, and get your QR. |
| Lihat sebagai usher | Pindai QR tamu dari HP dan lihat counter kehadiran. | Scan guest QRs from your phone and watch arrivals. |
| Lihat sebagai owner | Kelola reservasi, wedding, menu, dan rekap dapur. | Manage reservations, weddings, menu, and kitchen summaries. |

- **Tip ID:** Buka "usher" di HP dan "tamu" di laptop, lalu pindai QR dari layar laptop.
- **Tip EN:** Open "usher" on your phone and "guest" on your laptop, then scan the QR from the laptop screen.

### Batasan akun demo (pesan)
- **ID:** Fitur ini dinonaktifkan di mode demo.
- **EN:** This feature is disabled in demo mode.

---

## 14. Teks Umum UI

### Navigasi publik
| Kode | ID | EN |
|---|---|---|
| home | Beranda | Home |
| menu | Menu | Menu |
| courses | Paket Dinner | Dinner Courses |
| weddings | Wedding | Weddings |
| gallery | Galeri | Gallery |
| about | Tentang | About |
| contact | Kontak | Contact |
| reserve | Reservasi | Reserve |
| lang | ID / EN | ID / EN |

### Umum
| ID | EN |
|---|---|
| Lihat selengkapnya | Learn more |
| Kembali | Back |
| Simpan | Save |
| Batal | Cancel |
| Hapus | Delete |
| Memuat… | Loading… |
| Terjadi kesalahan. Silakan coba lagi. | Something went wrong. Please try again. |
| Tidak ada koneksi internet. | You're offline. |
| Halaman tidak ditemukan. | Page not found. |
| Kembali ke beranda | Back to home |
| per orang | per person |
| orang | guests |
| course | courses |

### Footer
- **ID:** © {year} Shion. Restoran fiktif untuk keperluan portofolio.
- **EN:** © {year} Shion. A fictional restaurant created for a portfolio project.

---

## 15. Daftar Foto (shot list)

Foto diambil dari situs berlisensi bebas (Unsplash, Pexels). Setiap foto yang dipakai dicatat di `docs/CREDITS.md`.

**Arah visual:** gelap dan hangat, kayu, cahaya lembut dari samping, banyak ruang kosong, warna tidak jenuh. Hindari foto terang benderang, latar putih studio, dan foto dengan logo restoran lain.

| No | Kebutuhan | Dipakai di | Kata kunci pencarian |
|---|---|---|---|
| 1 | Hero: chef menata nigiri di counter kayu, close-up tangan | Beranda | `sushi chef hands`, `omakase counter` |
| 2 | Interior ruang makan Jepang, cahaya redup | Beranda, Tentang | `japanese restaurant interior dark`, `minimal japanese dining room` |
| 3 | Counter hinoki dari samping | Ruang | `wooden sushi counter` |
| 4 | Ruang privat bergaya tatami | Ruang | `japanese private dining room` |
| 5 | Taman batu / lentera malam | Ruang, Wedding | `japanese garden lantern night` |
| 6 | Sashimi di piring keramik | Menu, Paket | `sashimi plate ceramic` |
| 7 | Nigiri berjajar | Menu, Paket Matsu | `nigiri sushi dark background` |
| 8 | Wagyu di atas arang | Menu, Paket Matsu | `wagyu charcoal grill` |
| 9 | Tempura | Menu | `tempura japanese` |
| 10 | Mangkuk sup dashi / owan | Paket Take | `japanese soup bowl lacquer` |
| 11 | Hassun / piring musiman | Paket Take | `kaiseki seasonal plate` |
| 12 | Dessert matcha | Menu | `matcha dessert` |
| 13 | Sake dituang | Menu, Add-on | `sake pouring` |
| 14 | Teh hijau di cangkir | Menu | `japanese tea cup` |
| 15 | Bunga aster ungu (identitas Shion) | Tentang, Undangan | `purple aster flower` |
| 16 | Meja panjang dihias untuk acara | Wedding | `wedding long table candles intimate` |
| 17 | Pasangan bersulang (tidak menghadap kamera) | Wedding | `couple toast wedding dinner` |
| 18 | Detail kartu nama / dekorasi meja | Wedding | `wedding place setting minimal` |
| 19 | Tekstur kertas washi | Latar | `washi paper texture` |
| 20 | Chef menyiapkan hidangan (wajah tidak terlihat jelas) | Tentang | `japanese chef preparing food` |

**Catatan foto**
- Untuk foto orang (nomor 17, 20), pilih yang wajah tidak dominan agar tidak terkesan memakai identitas orang sungguhan sebagai pengantin atau chef Shion.
- Simpan file asli di `apps/web/src/assets/raw/` (tidak di-commit jika besar), hasil optimasi AVIF/WebP di `apps/web/public/images/`.
- Ukuran target: hero 2400 px lebar, kartu 1200 px, thumbnail 600 px.
