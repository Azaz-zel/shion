import { useCallback, useEffect, useRef, useState } from 'react';
import { brand } from '../../config/brand';
import { formatDate } from '../../i18n/lang';
import { api, errorText } from '../../lib/api';
import type { Reservation, Wedding } from '../../lib/types';

export interface Live<T> {
  data: T | null;
  error: string;
  loading: boolean;
  updatedAt: Date | null;
  reload: () => void;
}

/** Memuat data lalu memuat ulang setiap kali ada perubahan dari server (realtime) atau tab lain (demo). */
export function useLive<T>(loader: () => Promise<T>, deps: unknown[]): Live<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const reload = useCallback(() => {
    loaderRef.current()
      .then((d) => {
        setData(d);
        setError('');
        setUpdatedAt(new Date());
      })
      .catch((e) => setError(errorText(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    reload();
    let timer = 0;
    const stop = api.admin.subscribe(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(reload, 150);
    });
    return () => {
      stop();
      window.clearTimeout(timer);
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, error, loading, updatedAt, reload };
}

export function relativeTime(iso: string | null): string {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

/** Nama pasangan, atau nama kontak kalau form wedding belum mengisi pasangannya. */
export function coupleName(w: Wedding): string {
  return w.couple2 ? `${w.couple1} & ${w.couple2}` : w.couple1 || w.contactName;
}

/** Link chat WhatsApp ke nomor pelanggan. Nomor tersimpan sebagai 08xx, wa.me butuh 628xx. */
export function waLink(phone: string, text: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(text)}`;
}

/** Form yang diisi pelanggan wedding sendiri (halaman GuestList). */
export function guestFormUrl(w: Wedding): string {
  return `${location.origin}/tamu/${w.code}`;
}

/** Link undangan umum: satu link untuk semua tamu, tiap tamu menulis nama dan jumlah orangnya sendiri. */
export function openInviteUrl(w: Wedding): string {
  return `${location.origin}/w/${w.slug}`;
}

export function reservationChat(r: Reservation): string {
  return waLink(r.phone, `Halo ${r.guestName}, kami dari ${brand.name}. Mengenai reservasi ${r.code} pada ${formatDate(r.date, 'id')} pukul ${r.time.replace(':', '.')} untuk ${r.pax} orang.`);
}

export function guestListChat(w: Wedding): string {
  return waLink(w.phone, `Halo ${w.contactName}, kami dari ${brand.name}. Ini link undangan digital untuk wedding ${w.code}: ${openInviteUrl(w)} Bagikan link ini ke tamu Anda. Tiap tamu menulis nama, grup, dan jumlah orangnya sendiri, lalu jawabannya langsung masuk ke kami. Kalau ingin menentukan tamunya sendiri, isi daftarnya di ${guestFormUrl(w)}`);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
