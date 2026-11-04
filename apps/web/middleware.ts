// Vercel Edge Middleware: preview link undangan saat dibagikan di WhatsApp dan media sosial.
// Crawler (WhatsApp, Facebook, Telegram, dll.) tidak menjalankan JavaScript, jadi untuk mereka
// kita kirim HTML kecil berisi meta Open Graph: nama pasangan dan tanggal. Tidak ada data tamu.
// Pengunjung biasa diteruskan ke aplikasi React seperti biasa.

declare const process: { env: Record<string, string | undefined> };

export const config = { matcher: '/w/:path*' };

const BOT = /whatsapp|facebookexternalhit|facebot|twitterbot|telegrambot|slackbot|linkedinbot|discordbot|skypeuripreview|googlebot|bingbot/i;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export default async function middleware(request: Request): Promise<Response | undefined> {
  if (!BOT.test(request.headers.get('user-agent') ?? '')) return undefined;
  const url = new URL(request.url);
  const slug = url.pathname.split('/')[2] ?? '';
  const base = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  let title = 'Undangan pernikahan · Shion';
  let description = 'Anda diundang ke pernikahan di Shion, Jakarta Selatan.';
  if (base && key && /^[a-z0-9-]+$/.test(slug)) {
    try {
      const res = await fetch(`${base}/rest/v1/rpc/get_wedding_preview`, {
        method: 'POST',
        headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_slug: slug }),
      });
      const w = (await res.json()) as { couple1: string; couple2: string; eventDate: string } | null;
      if (w?.couple1) {
        const date = new Date(w.eventDate + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        title = `${w.couple1} & ${w.couple2} · ${date}`;
        description = `Anda diundang ke pernikahan ${w.couple1} & ${w.couple2} di Shion, Jakarta Selatan. Buka untuk RSVP.`;
      }
    } catch {
      /* pakai teks umum */
    }
  }
  const image = `${url.origin}/img/hero.jpg`;
  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8">
<title>${esc(title)}</title>
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:url" content="${esc(url.href)}">
<meta name="twitter:card" content="summary_large_image">
</head><body><a href="${esc(url.href)}">${esc(title)}</a></body></html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=600' } });
}
