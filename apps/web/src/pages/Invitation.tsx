import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { coupleStory, inviteCopy } from '../content/invitation';
import { brand } from '../config/brand';
import { api, errorText } from '../lib/api';
import { todayISO } from '../lib/validation';
import type { DietCode, InvitationView } from '../lib/types';
import { formatDate, LangToggle, useLang } from '../i18n/lang';
import '../styles/invite.css';

const DIETS: DietCode[] = ['no_pork', 'no_alcohol', 'vegetarian', 'no_raw'];

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
  const token = params.get('t') ?? '';
  const { lang } = useLang();
  const t = inviteCopy[lang];

  const [load, setLoad] = useState<{ state: 'loading' | 'ready' | 'missing' | 'error'; data: InvitationView | null }>({ state: 'loading', data: null });
  const [editing, setEditing] = useState(false);
  const [choice, setChoice] = useState<'attending' | 'declined'>('attending');
  const [pax, setPax] = useState(1);
  const [diet, setDiet] = useState<DietCode[]>([]);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [send, setSend] = useState<{ busy: boolean; error: string }>({ busy: false, error: '' });

  const fill = (v: InvitationView) => {
    setChoice(v.guest.rsvpStatus === 'declined' ? 'declined' : 'attending');
    setPax(Math.max(1, v.guest.rsvpPax || v.guest.maxPax));
    setDiet(v.guest.dietary);
    setNote(v.guest.dietaryNote);
    setMessage(v.guest.message);
  };

  const open = useCallback(async () => {
    setLoad({ state: 'loading', data: null });
    try {
      const v = token ? await api.getInvitation(slug, token) : null;
      if (!v) return setLoad({ state: 'missing', data: null });
      fill(v);
      setEditing(v.guest.rsvpStatus === 'pending');
      setLoad({ state: 'ready', data: v });
    } catch {
      setLoad({ state: 'error', data: null });
    }
  }, [slug, token]);

  useEffect(() => {
    void open();
  }, [open]);

  useEffect(() => {
    if (load.data) document.title = `${load.data.wedding.couple1} & ${load.data.wedding.couple2} · ${brand.name}`;
  }, [load.data]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!load.data) return;
    setSend({ busy: true, error: '' });
    try {
      const v = await api.submitRsvp(token, { status: choice, pax, dietary: diet, dietaryNote: note, message, consent });
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
  const toggleDiet = (d: DietCode) => setDiet((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));

  return (
    <div className="inv">
      <div className="inv__bar"><span className="inv__brand">{brand.name} <span lang="ja">{brand.kanji}</span></span><LangToggle tone="dark" /></div>

      <header className="inv__cover">
        <p className="inv__dear">{t.dear}</p>
        <p className="inv__guest">{guest.name}</p>
        <h1 className="inv__names">
          <span>{wedding.couple1}</span>
          <span className="inv__amp" aria-hidden="true">&amp;</span>
          <span className="sr-only">{lang === 'id' ? 'dan' : 'and'}</span>
          <span>{wedding.couple2}</span>
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
        {editing ? (
          <form onSubmit={submit} noValidate>
            <h2 id="inv-rsvp">{t.rsvpT}</h2>
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
                <p className="inv__label" id="inv-pax-l">{t.paxT}</p>
                <div className="inv__pax" aria-labelledby="inv-pax-l">
                  <button type="button" aria-label={t.less} disabled={pax <= 1} onClick={() => setPax((p) => p - 1)}>−</button>
                  <output aria-live="polite">{pax}</output>
                  <button type="button" aria-label={t.more} disabled={pax >= guest.maxPax} onClick={() => setPax((p) => p + 1)}>+</button>
                  <span className="inv__small">{t.max(guest.maxPax)}</span>
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
            <button type="button" className="inv__btn inv__btn--ghost" onClick={() => { fill(load.data!); setConsent(false); setEditing(true); }}>{t.change}</button>
          </div>
        ) : (
          <div className="inv__done" role="status">
            <h2 id="inv-rsvp">{t.thanksNo}</h2>
            <p>{t.wishes}</p>
            <button type="button" className="inv__btn inv__btn--ghost" onClick={() => { fill(load.data!); setConsent(false); setEditing(true); }}>{t.change}</button>
          </div>
        )}
      </section>

      <footer className="inv__foot">{t.footer}</footer>
    </div>
  );
}
