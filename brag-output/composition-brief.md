# Hyperframes Composition Brief: Shion

## Objective
Create a short, premium social ad for Shion, a kaiseki & omakase restaurant site in Kebayoran Baru, South Jakarta.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: vertical — 1080x1920
- Duration: 23 seconds

## Source Material
- Project root: `D:\Project\shion` (React + Vite app in `apps/web`)
- Primary files read: `apps/web/src/content/home.ts` (all copy), `apps/web/src/content/invitation.ts`, `apps/web/src/styles/home.css` (tokens, fonts, buttons), `apps/web/src/styles/invite.css`, `apps/web/src/pages/Home.tsx`, `apps/web/src/pages/Invitation.tsx`, `README.md`, `docs/CREDITS.md`
- Product name: Shion (紫苑)
- Tagline / strongest claim: "Shion adalah bunga aster ungu. Dalam bahasa bunga Jepang, artinya aku tidak akan melupakanmu."
- Key UI or visual moment to recreate: the "Paket dinner" course table (Ume 梅 / Take 竹 / Matsu 松 rows with prices and the outlined "Pesan … →" button that fills dark from the bottom), the booking confirmation, and the wedding guest invitation with its entry QR.
- Copy that must appear verbatim:
  - "Artinya: aku tidak akan melupakanmu."
  - "Kaiseki & omakase · Jakarta Selatan"
  - Sakizuke, Owan, Yakimono, Shokuji, Kanmi with 18.00–22.00
  - "Tiga perjalanan rasa"
  - "Rp 750.000", "Rp 1.150.000", "Rp 1.850.000"
  - "Seluruh restoran, untuk satu cerita."
  - "Malamnya selesai, kenangannya belum."
  - "Pesan meja Anda"
- Images (copied into `composition/assets/img/`): `hero.jpg` (chef's hands placing nigiri), `h1.jpg`–`h5.jpg` (the five courses of the evening), `e1.jpg` (candlelit wedding table).
- Must NOT appear: the placeholder address "Jl. Contoh Raya No. 88", any phone number or email. The restaurant is fictional; use only "Kebayoran Baru, Jakarta Selatan".

## Creative Direction
- Tone preset: polished
- Creative direction: quiet premium restaurant film, one evening in twenty seconds
- Interpretation: few scenes, long holds, slow crossfades and soft scale drift on photos; restraint signals luxury.
- Angle: the name is the promise. Shion is the purple aster, "I will not forget you". The video walks one evening from 18.00 to 22.00 and closes on the site's own line about the memory staying.
- Hook: 紫苑 in lilac on aubergine, then "Artinya: aku tidak akan melupakanmu."
- Outro / punchline: "Malamnya selesai, kenangannya belum." → 紫苑 SHION lockup, "Pesan meja Anda".
- Avoid: generic restaurant ad language ("cita rasa terbaik", "pengalaman tak terlupakan"), abstract filler, rounded corners and soft UI cards (the site is hard-edged), emoji, any redesign of the brand.

## Visual Identity
- Background: #2a1a2b (aubergine)
- Paper: #f0e2d8 (cream)
- Text: #f0e2d8 on dark, #2a1a2b on cream
- Accent: #b78cf2 (lilac); deep accent #6e3b9e
- Display font: TikTok Sans, weight 900, font-stretch 125%, uppercase (Google Fonts)
- Serif: Brygada 1918, 400–600, often uppercase (Google Fonts)
- Kanji: Yuji Syuku (Google Fonts)
- Visual references from the project: hard-edged photo frames, 1px hairline rules, small uppercase labels with 0.06em tracking, outlined square buttons with arrow, lilac "&" in the invitation names.

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Bunga — 0.0–3.6s — 紫苑 large in lilac, label "SHION · BUNGA ASTER UNGU", line "Artinya: aku tidak akan melupakanmu."
2. Counter — 3.6–7.6s — hero.jpg push-in, "SHION" wide heavy uppercase, "Kaiseki & omakase · Jakarta Selatan"
3. Satu malam — 7.6–13.0s — "Satu malam omakase", photo h1→h5 with a time rail 18.00 Sakizuke … 22.00 Kanmi (each hour ≥0.9s)
4. Tiga perjalanan rasa — 13.0–17.6s — cream; three course rows arrive one by one, then a tap on "Pesan Matsu" fills the button and "Reservasi SHN-4821 terkonfirmasi" slides up
5. Wedding — 17.6–20.6s — "Seluruh restoran, untuk satu cerita." + phone with the guest invitation (RINA & DIMAS, 結, QR masuk · 2 orang)
6. Kenangan + lockup — 20.6–23.0s — two lines, then 紫苑 SHION lockup, "Pesan meja Anda", "Kebayoran Baru, Jakarta Selatan · Selasa–Minggu", tiny credit "Foto: Flickr, CC BY 2.0 · kredit lengkap di keterangan"

## Audio
- Audio role: warm steady bed with sparse professional accents
- Audio arc: fades up under the kanji, moves the evening forward, resolves on one soft bell under the lockup and fades out
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
- Music treatment: volume ~0.28, 0.6s fade-in, ~1.2s fade-out at the end
- Music cue guidance: bundled preset `<skill-dir>/assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json` (109.96 BPM). Strong cues: 13.11 (course title), 22.37 (lockup). Hours in Scene 3 on every other beat (~1.09s).
- Audio-reactive treatment: subtle; lilac glow behind the kanji / lockup and photo vignette may breathe with RMS. No visualizer graphics.
- Audio-coupled moments:
  - Scene 1 kanji landing — soft wood knock
  - Scene 4 rows — soft card place on first and last row; one click on the "Pesan Matsu" tap
  - Scene 6 lockup — soft bell
- SFX selection guidance: low high-frequency risk only; nothing louder than the bed by much.
- SFX analysis guidance: `<skill-dir>/assets/sfx/sfx-analysis.md`
- Exact SFX choice: decided after the animation exists.
- Audio files: copied into `composition/assets/`.
