import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Lang } from '../lib/types';

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'id', setLang: () => {} });

function initial(): Lang {
  try {
    const saved = localStorage.getItem('shion-lang');
    if (saved === 'id' || saved === 'en') return saved;
  } catch {
    /* penyimpanan diblokir */
  }
  return 'id';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initial);
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('shion-lang', lang);
    } catch {
      /* abaikan */
    }
  }, [lang]);
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Tombol ID / EN. `tone` menyesuaikan warna dengan latar terang atau gelap. */
export function LangToggle({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`lang lang--${tone}`} role="group" aria-label={lang === 'id' ? 'Bahasa' : 'Language'}>
      {(['id', 'en'] as const).map((l) => (
        <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function formatDate(iso: string, lang: Lang, opts: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Date(iso + 'T00:00:00').toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-GB', opts);
}
