import type { NewGuest } from './types';

export interface ParsedGuests {
  rows: NewGuest[];
  skipped: Array<{ line: number; reason: string }>;
}

/** Memecah satu baris CSV, mendukung nilai dalam tanda kutip ("Budi, Jr."). */
function splitLine(line: string, sep: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === sep) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

/**
 * Format: nama, grup, maks_orang, meja. Hanya kolom nama yang wajib.
 * Baris judul (yang diawali "nama" atau "name") dilewati. Pemisah koma atau titik koma.
 */
export function parseGuestCsv(text: string): ParsedGuests {
  const rows: NewGuest[] = [];
  const skipped: ParsedGuests['skipped'] = [];
  const lines = text.replace(/^﻿/, '').split(/\r?\n/);
  const sep = (lines.find((l) => l.trim()) ?? '').includes(';') ? ';' : ',';
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;
    const [name = '', group = '', max = '', table = ''] = splitLine(line, sep);
    if (i === 0 && /^(nama|name)$/i.test(name)) return;
    if (name.length < 2) return skipped.push({ line: i + 1, reason: 'nama kosong' });
    const maxPax = max ? Number(max) : 1;
    if (!Number.isInteger(maxPax) || maxPax < 1 || maxPax > 10) return skipped.push({ line: i + 1, reason: `maks orang "${max}" harus 1 sampai 10` });
    rows.push({ name, groupLabel: group, maxPax, tableNo: table });
  });
  return { rows, skipped };
}
