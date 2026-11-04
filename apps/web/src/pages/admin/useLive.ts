import { useCallback, useEffect, useRef, useState } from 'react';
import { api, errorText } from '../../lib/api';

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

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
