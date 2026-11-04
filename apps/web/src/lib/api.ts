import { demoApi } from './demoApi';
import { makeSupabaseApi } from './supabaseApi';
import { UserError, type Api } from './types';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Supabase jika kredensial tersedia, selain itu mode demo di browser. */
export const api: Api = url && key ? makeSupabaseApi(url, key) : demoApi;

/** Pesan error untuk ditampilkan: pesan validasi apa adanya, selain itu pesan umum. */
export function errorText(error: unknown): string {
  if (error instanceof UserError) return error.message;
  return 'Tidak bisa terhubung ke server. Periksa koneksi lalu coba lagi.';
}
