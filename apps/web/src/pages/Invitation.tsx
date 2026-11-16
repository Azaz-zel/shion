import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { coupleStory, inviteCopy } from '../content/invitation';
import { brand } from '../config/brand';
import { api, errorText } from '../lib/api';
import { OPEN_RSVP_MAX_PAX, todayISO } from '../lib/validation';
import type { DietCode, InvitationView } from '../lib/types';
import { formatDate, LangToggle, useLang } from '../i18n/lang';
import '../styles/invite.css';

const DIETS: DietCode[] = ['no_pork', 'no_alcohol', 'vegetarian', 'no_raw'];

/** Undangan pribadi punya data tamu; undangan umum (tanpa token) belum, sampai tamu mendaftar sendiri. */
type View = { wedding: InvitationView['wedding']; guest: InvitationView['guest'] | null };

// Token undangan pribadi diingat per wedding, supaya tamu yang sudah mendaftar lewat link umum tidak mendaftar dua kali.
const storeKey = (slug: string) => `shion-invite-${slug}`;
function remembered(slug: string): string {
  try {
    return localStorage.getItem(storeKey(slug)) ?? '';
  } catch {
    return '';
  }
}
function remember(slug: string, token: string): void {
  try {
    localStorage.setItem(storeKey(slug), token);
  } catch {
    /* penyimpanan diblokir: tamu tetap memegang link pribadinya di alamat halaman */
  }
}

function daysUntil(iso: string): number {
  return Math.round((new Date(iso + 'T00:00:00').getTime() - new Date(todayISO() + 'T00:00:00').getTime()) / 86400000);
}

/** QR berisi token tamu dengan awalan, divalidasi server saat check-in. */
function EntryQr({ token, label }: { token: string; label: string }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    QRCode.toDataURL(`SHION:${token}`, { margin: 1, width: 480, errorCorrectionLevel: 'M', color: { dark: '#2a1a2b', light: '#ffffff' } })
      .then(setSrc)
      .catch(() => setSrc(''));
  }, [token]);
  return src ? <img className="inv__qr" src={src} width={240} height={240} alt={label} /> : <div className="inv__qr inv__qr--wait" aria-hidden="true" />;
}

export default function Invitation() {
  const { slug = '' } = useParams();
  const [params] = useSearchParams();
  const urlToken = params.get('t') ?? '';
  const { lang } = useLang();
  const t = inviteCopy[lang];

  const [load, setLoad] = useState<{ state: 'loading' | 'ready' | 'missing' | 'error'; data: View | null }>({ state: 'loading', data: null });
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [choice, setChoice] = useState<'attending' | 'declined'>('attending');
  const [pax, setPax] = useState(1);
  const [diet, setDiet] = useState<DietCode[]>([]);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [send, setSend] = useState<{ busy: boolean; error: string }>({ busy: false, error: '' });

  const fill = (g: InvitationView['guest']) => {
    setChoice(g.rsvpStatus === 'declined' ? 'declined' : 'attending');
    setPax(Math.max(1, g.rsvpPax || g.maxPax));
    setDiet(g.dietary);
    setNote(g.dietaryNote);
    setMessage(g.message);
  };

  const open = useCallback(async () => {
    setLoad({ state: 'loading', data: null });
    try {
      const token = urlToken || remembered(slug);
      const v = token ? await api.getInvitation(slug, token) : null;
      if (v) {
        fill(v.guest);
        setEditing(v.guest.rsvpStatus === 'pending');
        return setLoad({ state: 'ready', data: v });
      }
      // Link pribadi yang salah tetap "tidak ditemukan". Tanpa token di alamat, buka undangan umum.
      const wedding = urlToken ? null : await api.getWeddingPreview(slug);
      if (!wedding) return setLoad({ state: 'missing', data: null });
      setEditing(true);
      setLoad({ state: 'ready', data: { wedding, guest: null } });
    } catch {
      setLoad({ state: 'error', data: null });
    }
  }, [slug, urlToken]);

  useEffect(() => {
    void open();
  }, [open]);

  useEffect(() => {
    if (load.data) document.title = `${[load.data.wedding.couple1, load.data.wedding.couple2].filter(Boolean).join(' & ')} · ${brand.name}`;
  }, [load.data]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!load.data) return;
    setSend({ busy: true, error: '' });
    try {
      const known = load.data.guest;
      const input = { status: choice, pax, dietary: diet, dietaryNote: note, message, consent };
      const v = known ? await api.submitRsvp(known.token, input) : await api.submitOpenRsvp(slug, { ...input, name, groupLabel: group });
      if (!known) {
        // Tamu baru: alamat halaman diganti ke link pribadinya, supaya bisa disimpan dan dibuka lagi untuk QR masuk.
        remember(slug, v.guest.token);
        window.history.replaceState(window.history.state, '', `?t=${encodeURIComponent(v.guest.token)}`);
      }
      setLoad({ state: 'ready', data: v });
      setEditing(false);
      setSend({ busy: false, error: '' });
    } catch (err) {
      setSend({ busy: false, error: errorText(err) });
    }
  }

  if (load.state !== 'ready' || !load.data) {
    return (
      <div className="inv inv--state">
        <div className="inv__bar"><span className="inv__brand">{brand.name} <span lang="ja">{brand.kanji}</span></span><LangToggle tone="dark" /></div>
        <div className="inv__state" role={load.state === 'loading' ? 'status' : 'alert'}>
          {load.state === 'loading' && <p>{t.loading}</p>}
          {load.state === 'missing' && (<><h1>{t.notFoundT}</h1><p>{t.notFound}</p></>)}
          {load.state === 'error' && (<><h1>{t.errorT}</h1><p>{errorText(null)}</p><button type="button" className="inv__btn" onClick={() => void open()}>{t.retry}</button></>)}
        </div>
      </div>
    );
  }

  const { wedding, guest } = load.data;
  const story = coupleStory(wedding.slug);
  const days = daysUntil(wedding.eventDate);
  const maxPax = guest?.maxPax ?? OPEN_RSVP_MAX_PAX;
  const toggleDiet = (d: DietCode) => setDiet((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));

  return (
    <div className="inv">
      <div className="inv__bar"><span className="inv__brand">{brand.name} <span lang="ja">{brand.kanji}</span></span><LangToggle tone="dark" /></div>

      <header className="inv__cover">
        {guest && (
          <>
            <p className="inv__dear">{t.dear}</p>
            <p className="inv__guest">{guest.name}</p>
          </>
        )}
        <h1 className="inv__names">
          <span>{wedding.couple1}</span>
          {wedding.couple2 && (
            <>
              <span className="inv__amp" aria-hidden="true">&amp;</span>
              <span className="sr-only">{lang === 'id' ? 'dan' : 'and'}</span>
              <span>{wedding.couple2}</span>
            </>
          )}
        </h1>
        <p className="inv__kanji" lang="ja" aria-hidden="true">結</p>
        <p className="inv__date">{formatDate(wedding.eventDate, lang)} · {t.sessionTime[wedding.session]}</p>
        <p className="inv__count">{t.daysLeft(days)}</p>
      </header>

      <section className="inv__block">
        <p className="inv__lead">{t.invite}</p>
        <p>{story.story[lang]}</p>
      </section>

      <section className="inv__block" aria-labelledby="inv-sched">
        <h2 id="inv-sched">{t.schedule}</h2>
        <ol className="inv__sched">
          {story.schedule[lang].map(([time, label]) => <li key={time}><span>{time}</span><span>{label}</span></li>)}
        </ol>
      </section>

      <section className="inv__block">
        <dl className="inv__facts">
          <div><dt>{t.dressT}</dt><dd>{t.dress}</dd></div>
          <div><dt>{t.venueT}</dt><dd>{brand.name}, {brand.address[0]}, {brand.address[1]}</dd></div>
        </dl>
        <a className="inv__btn inv__btn--ghost" href="https://maps.google.com/?q=Kebayoran+Baru+Jakarta+Selatan">{t.maps}</a>
        <p className="inv__small">{t.valet}</p>
      </section>

      <section className="inv__block inv__rsvp" aria-labelledby="inv-rsvp">
        {editing || !guest ? (
          <form onSubmit={submit} noValidate>
            <h2 id="inv-rsvp">{t.rsvpT}</h2>
            {!guest && (
              <>
                <label className="inv__label" htmlFor="inv-name">{t.nameT}</label>
                <input id="inv-name" className="inv__input" type="text" autoComplete="name" maxLength={80} required placeholder={t.namePh} value={name} onChange={(e) => setName(e.target.value)} />
              </>
            )}
            <div className="inv__choice" role="radiogroup" aria-label={t.rsvpT}>
              {(['attending', 'declined'] as const).map((c) => (
                <label key={c} className={choice === c ? 'is-on' : ''}>
                  <input type="radio" name="rsvp" value={c} checked={choice === c} onChange={() => setChoice(c)} />
                  {c === 'attending' ? t.accept : t.decline}
                </label>
              ))}
            </div>

            {choice === 'attending' && (
              <>
                {!guest && (
                  <>
                    <label className="inv__label" htmlFor="inv-group">{t.groupT}</label>
                    <input id="inv-group" className="inv__input" type="text" list="inv-groups" maxLength={40} placeholder={t.groupPh} value={group} onChange={(e) => setGroup(e.target.value)} />
                    <datalist id="inv-groups">{t.groups.map((g) => <option key={g} value={g} />)}</datalist>
                  </>
                )}
                <p className="inv__label" id="inv-pax-l">{t.paxT}</p>
                <div className="inv__pax" aria-labelledby="inv-pax-l">
                  <button type="button" aria-label={t.less} disabled={pax <= 1} onClick={() => setPax((p) => p - 1)}>−</button>
                  <output aria-live="polite">{pax}</output>
                  <button type="button" aria-label={t.more} disabled={pax >= maxPax} onClick={() => setPax((p) => p + 1)}>+</button>
                  <span className="inv__small">{t.max(maxPax)}</span>
                </div>
                <fieldset className="inv__diets">
                  <legend className="inv__label">{t.dietT}</legend>
                  {DIETS.map((d) => (
                    <label key={d} className={diet.includes(d) ? 'is-on' : ''}>
                      <input type="checkbox" checked={diet.includes(d)} onChange={() => toggleDiet(d)} />
                      {t.diets[d]}
                    </label>
                  ))}
                </fieldset>
                <label className="inv__label" htmlFor="inv-note">{t.noteT}</label>
                <input id="inv-note" className="inv__input" type="text" maxLength={200} value={note} onChange={(e) => setNote(e.target.value)} />
              </>
            )}

            <label className="inv__label" htmlFor="inv-msg">{t.msgT}</label>
            <textarea id="inv-msg" className="inv__input" rows={3} maxLength={500} placeholder={t.msgPh} value={message} onChange={(e) => setMessage(e.target.value)} />

            <label className="inv__consent">
              <input id="inv-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>{t.consent}</span>
            </label>
            {send.error && <p className="inv__error" role="alert">{send.error}</p>}
            <button className="inv__btn" type="submit" disabled={send.busy}>{send.busy ? t.sending : t.send}</button>
            {api.mode === 'demo' && <p className="inv__small">{t.demo}</p>}
          </form>
        ) : guest.rsvpStatus === 'attending' ? (
          <div className="inv__done" role="status">
            <h2 id="inv-rsvp">{t.thanksYes(guest.name)}</h2>
            <p>{t.showQr}</p>
            <EntryQr token={guest.token} label={t.qrLabel(guest.rsvpPax)} />
            <p className="inv__qrlabel">{t.qrLabel(guest.rsvpPax)}{guest.tableNo ? ` · ${t.table(guest.tableNo)}` : ''}</p>
            <p className="inv__small">{t.tip}</p>
            <button type="button" className="inv__btn inv__btn--ghost" onClick={() => { fill(guest); setConsent(false); setEditing(true); }}>{t.change}</button>
          </div>
        ) : (
          <div className="inv__done" role="status">
            <h2 id="inv-rsvp">{t.thanksNo}</h2>
            <p>{t.wishes}</p>
            <button type="button" className="inv__btn inv__btn--ghost" onClick={() => { fill(guest); setConsent(false); setEditing(true); }}>{t.change}</button>
          </div>
        )}
      </section>

      <footer className="inv__foot">{t.footer}</footer>
    </div>
  );
}
