import { useEffect, useRef, useState, type FormEvent } from 'react';
import { homeCopy, type HomeCopy } from '../content/home';
import { brand } from '../config/brand';
import { api, errorText } from '../lib/api';
import { addDaysISO, todayISO } from '../lib/validation';
import type { PackageCode, Session } from '../lib/types';
import { LangToggle, useLang } from '../i18n/lang';
import { useHomeMotion } from '../hooks/useHomeMotion';

type Preset = 'table' | PackageCode | 'wedding';

const Arrow = () => (
  <span className="m-icon" aria-hidden="true">
    <svg viewBox="0 0 16 16" width="14" height="14"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
  </span>
);

const SEASON_IMG = ['uni', 'otoro', 'wagyu', 'shiitake', 'yuzu', 'ikura'];
const WORK_IMG = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'];
const HOURS = [
  { id: '18.00', en: '18:00', img: 'h1' },
  { id: '19.00', en: '19:00', img: 'h2' },
  { id: '20.00', en: '20:00', img: 'h3' },
  { id: '21.00', en: '21:00', img: 'h4' },
  { id: '22.00', en: '22:00', img: 'h5' },
];
// Posisi awal tumpukan foto acara (dari template 8B): geser x, geser y, rotasi, lalu versi HP.
const PILE = [
  ['132.426%', '-25.8%', '-11deg', '45.054%', '-8.199%'],
  ['44.142%', '-8.143%', '7deg', '-45.054%', '28.265%'],
  ['-44.142%', '-8.143%', '-5deg', '-45.054%', '-61.843%'],
  ['-132.426%', '-25.8%', '9deg', '-45.054%', '-96.205%'],
  ['44.142%', '-96.427%', '-8deg', '45.054%', '-151.95%'],
  ['-44.142%', '-96.427%', '4deg', '45.054%', '-242.058%'],
];

function Nav({ t }: { t: HomeCopy }) {
  const [open, setOpen] = useState(false);
  const openBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) closeBtn.current?.focus();
  }, [open]);
  const close = () => {
    setOpen(false);
    openBtn.current?.focus();
  };
  const links: Array<[string, string]> = [
    ['#season', t.nav.season], ['#work', t.nav.work], ['#dusk', t.nav.dusk],
    ['#standing', t.nav.standing], ['#events', t.nav.events], ['#faq', t.nav.faq],
  ];
  return (
    <header id="navigation" data-8b-section="navigation">
      <a className="nav__brand" href="#opening" aria-label={t.nav.top}>
        <span className="nav__kanji" aria-hidden="true">{brand.kanji}</span>
        <span>{brand.name}</span>
      </a>
      <nav className="nav__links" aria-label="Utama">
        {links.map(([href, label]) => <a key={href} className="m-link-2" href={href}>{label}</a>)}
      </nav>
      <div className="nav__end">
        <LangToggle />
        <a className="nav__cta" href="#contact">{t.nav.reserve} <Arrow /></a>
      </div>
      <button ref={openBtn} className="nav__menu m-icon" type="button" aria-expanded={open} aria-controls="menu" aria-label={t.nav.open} onClick={() => setOpen(true)}>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 4.5h14M1 11.5h14" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
      </button>
      <div className="menu" id="menu" hidden={!open} role="dialog" aria-modal="true" aria-label="Menu" onKeyDown={(e) => e.key === 'Escape' && close()}>
        <div className="menu__top">
          <span className="m-text-3">{brand.name} {brand.kanji}</span>
          <button ref={closeBtn} className="menu__close m-icon" type="button" aria-label={t.nav.close} onClick={close}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>
        </div>
        <nav className="menu__links" aria-label="Menu">
          {[...links, ['#contact', t.nav.reserve] as [string, string]].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </nav>
        <div className="menu__foot">
          <LangToggle tone="dark" />
          <p className="m-text-8">{t.addressLine}</p>
          <a className="m-link" href={brand.whatsappUrl}>{brand.phoneLabel}</a>
        </div>
      </div>
    </header>
  );
}

function Opening({ t, onPreset }: { t: HomeCopy; onPreset: (p: Preset) => void }) {
  return (
    <section id="opening" data-8b-section="opening" aria-label={brand.name}>
      <div className="op__hold">
        <div className="op__top">
          <h1 className="op__mark m-text-7" style={{ ['--len' as string]: 17 }}>
            <span className="op__w op__w--1"><span className="op__word">{brand.name}</span></span>
            <span className="op__and"><span className="op__and-in m-text-6">{brand.kanji}</span></span>
            <span className="op__w op__w--2"><span className="op__word">Kaiseki</span></span>
          </h1>
          <p className="op__tag op__tag--l m-text-4">{t.hero.tagL[0]}<br />{t.hero.tagL[1]}</p>
          <div className="op__right">
            <p className="op__tag op__tag--r m-text-4">{t.hero.tagR[0]}<br />{t.hero.tagR[1]}</p>
            <div className="op__actions">
              <a className="m-btn" href="#contact" onClick={() => onPreset('table')}><span className="m-btn__label">{t.hero.cta}</span></a>
              <a className="m-link" href="#contact" onClick={() => onPreset('wedding')}>{t.hero.link}</a>
            </div>
          </div>
        </div>
        <figure className="op__photo">
          <div className="op__drift"><img src="/img/hero.jpg" width={1024} height={680} alt={t.hero.alt} fetchPriority="high" /></div>
        </figure>
      </div>
      <div className="op__night">
        <p className="op__label m-text-3">{t.night.label}</p>
        <p className="op__statement m-text-4">{t.night.statement}</p>
        <p className="op__ribbon m-text-5" aria-hidden="true" style={{ ['--len' as string]: 7 }}>忘れない</p>
        <p className="op__close m-text-3">{t.night.close}</p>
      </div>
    </section>
  );
}

function Season({ t }: { t: HomeCopy }) {
  const s = t.season;
  return (
    <section id="season" data-8b-section="season" aria-labelledby="season-title">
      <header className="bench__head">
        <p className="m-text-3">{s.label}</p>
        <h2 id="season-title" className="m-text-2" data-8b-motion="lift">{s.title}</h2>
        <p className="bench__intro m-text">{s.intro}</p>
      </header>
      <div className="bench__frame">
        <div className="bench__deck">
          {s.items.map((it, k) => (
            <figure key={k} className="bench__ph"><img src={`/img/${SEASON_IMG[k]}.jpg`} width={1024} height={683} alt={it.alt} loading="lazy" /></figure>
          ))}
          {/* Teks diisi oleh useHomeMotion sesuai bahan yang aktif. */}
          <p className="bench__count" aria-hidden="true" />
        </div>
      </div>
      <ol className="bench__rows">
        {s.items.map((it) => (
          <li key={it.name} className="bench__row">
            <h3 className="bench__name m-text-4">{it.name}</h3>
            <p className="m-text-8">{it.meta}</p>
            <p className="bench__note m-text">{it.note}</p>
          </li>
        ))}
      </ol>
      <a className="bench__more m-rowlink" href="#contact"><span className="m-rowlink__line" aria-hidden="true" /><span className="m-rowlink__label">{s.more}</span><Arrow /></a>
    </section>
  );
}

function Work({ t }: { t: HomeCopy }) {
  return (
    <section id="work" data-8b-section="work" aria-labelledby="work-title">
      <header className="work__head">
        <p className="m-text-3">{t.work.label}</p>
        <h2 id="work-title" className="m-text-2" data-8b-motion="lift">{t.work.title}</h2>
      </header>
      <p className="work__ribbon m-text-5" aria-hidden="true" data-8b-motion="ribbon" style={{ ['--len' as string]: 7 }}>旬の味</p>
      <ul className="work__grid" data-8b-items=":scope > .work__item">
        {t.work.items.map((it, k) => (
          <li key={k} className="work__item">
            <figure>
              <div className="work__ph"><img src={`/img/${WORK_IMG[k]}.jpg`} width={1024} height={683} alt={it.alt} loading="lazy" /></div>
              <figcaption><span className="m-text-3">{it.title}</span><span className="m-text-8">{it.caption}</span></figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <a className="m-rowlink" href="#standing"><span className="m-rowlink__line" aria-hidden="true" data-8b-motion="rule" data-8b-enter="92%" /><span className="m-rowlink__label">{t.work.link}</span><Arrow /></a>
    </section>
  );
}

function Dusk({ t }: { t: HomeCopy }) {
  const { lang } = useLang();
  return (
    <section id="dusk" data-8b-section="dusk" aria-labelledby="dusk-title">
      <header className="dusk__head">
        <p className="m-text-3">{t.dusk.label}</p>
        <h2 id="dusk-title" className="m-text-2" data-8b-motion="lift">{t.dusk.title}</h2>
        <p className="dusk__intro m-text">{t.dusk.intro}</p>
      </header>
      <div className="dusk__run">
        <div className="dusk__stage">
          <ol className="dusk__track" data-8b-items=":scope > .dusk__panel">
            {t.dusk.panels.map((p, k) => (
              <li key={k} className="dusk__panel">
                <p className="dusk__hour m-text-7">{HOURS[k][lang]}</p>
                <div className="dusk__copy">
                  <h3 className="m-text-4">{p.name}</h3>
                  <p className="m-text">{p.text}</p>
                  {k === t.dusk.panels.length - 1 && <p className="dusk__night m-text-5" aria-hidden="true">ご馳走様</p>}
                </div>
                <figure className="dusk__ph"><img src={`/img/${HOURS[k].img}.jpg`} width={1024} height={683} alt={p.alt} loading="lazy" /></figure>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Standing({ t, onPreset }: { t: HomeCopy; onPreset: (p: Preset) => void }) {
  const s = t.standing;
  return (
    <section id="standing" data-8b-section="standing" aria-labelledby="standing-title">
      <div className="so__head">
        <p className="m-text-3">{s.label}</p>
        <h2 id="standing-title" className="m-text-2" data-8b-motion="lift">{s.title}</h2>
        <p className="so__intro m-text">{s.intro}</p>
      </div>
      <div className="so__cols m-text-3" aria-hidden="true">{s.cols.map((c) => <span key={c}>{c}</span>)}<span /></div>
      <ul className="so__rows">
        {s.rows.map((r) => (
          <li key={r.code} className="so__row">
            <span className="so__line" aria-hidden="true" data-8b-motion="rule" data-8b-enter="92%" />
            <h3 className="so__name m-text-4">{r.name}</h3>
            <p className="so__what m-text">{r.what}</p>
            <p className="m-text-8">{r.when}</p>
            <p className="so__price">{r.price}</p>
            <a className="m-link" href="#contact" onClick={() => onPreset(r.code as PackageCode)}>{r.cta}</a>
          </li>
        ))}
      </ul>
      <p className="so__foot m-text-8"><span className="so__line" aria-hidden="true" data-8b-motion="rule" data-8b-enter="92%" />{s.foot}</p>
    </section>
  );
}

function Events({ t, onPreset }: { t: HomeCopy; onPreset: (p: Preset) => void }) {
  const e = t.events;
  return (
    <section id="events" data-8b-section="events" aria-labelledby="events-title">
      <div className="ev__head">
        <div className="ev__title">
          <p className="m-text-3">{e.label}</p>
          <h2 id="events-title" className="m-text-2" data-8b-motion="lift">{e.title}</h2>
        </div>
        <div className="ev__side">
          <p className="m-text">{e.body}</p>
          <ul className="ev__kinds">
            {e.kinds.map((k) => <li key={k.name}><span className="m-text-4">{k.name}</span><span className="m-text-8">{k.meta}</span></li>)}
          </ul>
          <a className="m-btn-2" href="#contact" onClick={() => onPreset('wedding')}><span className="m-btn__label">{e.cta}</span></a>
        </div>
      </div>
      <ul className="ev__board" data-8b-items=":scope > .ev__ph">
        {PILE.map(([x, y, r, xm, ym], k) => (
          <li key={k} className="ev__ph" style={{
            ['--events-li-ev-ph-translate-5-from' as string]: x, ['--events-li-ev-ph-translate-5-from-2' as string]: y,
            ['--events-li-ev-ph-rotate-5-from' as string]: r, ['--events-li-ev-ph-translate-5-from-m' as string]: xm,
            ['--events-li-ev-ph-translate-5-from-2-m' as string]: ym,
          }}>
            <img src={`/img/e${k + 1}.jpg`} width={1024} height={683} alt={e.alts[k]} loading="lazy" />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Faq({ t }: { t: HomeCopy }) {
  return (
    <section id="faq" data-8b-section="faq" aria-labelledby="faq-title">
      <div className="fq__head">
        <p className="m-text-3">{t.faq.label}</p>
        <h2 id="faq-title" className="m-text-2" data-8b-motion="lift">{t.faq.title}</h2>
        <p className="m-text">{t.faq.intro}</p>
      </div>
      <div className="fq__list">
        {t.faq.items.map((f) => (
          <details key={f.q} className="fq__item">
            <summary><span className="fq__line" aria-hidden="true" data-8b-motion="rule" data-8b-enter="92%" /><span className="m-text-4">{f.q}</span><span className="fq__sign" aria-hidden="true" /></summary>
            <p className="m-text">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function nextOpenDay(): string {
  let d = addDaysISO(todayISO(), 1);
  if (new Date(d + 'T00:00:00').getDay() === 1) d = addDaysISO(d, 1);
  return d;
}

const TIMES = ['11:30', '12:00', '12:30', '13:00', '13:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

function Contact({ t, preset }: { t: HomeCopy; preset: { value: Preset; n: number } }) {
  const c = t.contact;
  const { lang } = useLang();
  const [kind, setKind] = useState<Preset>(preset.value);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(nextOpenDay);
  const [time, setTime] = useState('19:00');
  const [pax, setPax] = useState(2);
  const [session, setSession] = useState<Session>('dinner');
  const [estimate, setEstimate] = useState(60);
  const [notes, setNotes] = useState('');
  const [state, setState] = useState<{ status: 'idle' | 'sending' | 'done' | 'error'; message: string }>({ status: 'idle', message: '' });

  useEffect(() => setKind(preset.value), [preset]);
  const times = kind === 'matsu' ? ['18:00', '20:30'] : kind === 'take' ? TIMES.filter((x) => x >= '18:00') : TIMES;
  useEffect(() => {
    if (!times.includes(time)) setTime(times[0]);
  }, [kind]); // eslint-disable-line react-hooks/exhaustive-deps

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState({ status: 'sending', message: '' });
    try {
      if (kind === 'wedding') {
        const { code } = await api.createWeddingInquiry({ contactName: name, phone, eventDate: date, session, guestEstimate: estimate, notes });
        setState({ status: 'done', message: c.doneWedding(code) });
      } else {
        const { code } = await api.createReservation({
          type: kind === 'table' ? 'table' : 'dinner_package', packageCode: kind === 'table' ? null : kind,
          date, time, pax, guestName: name, phone, notes,
        });
        setState({ status: 'done', message: c.done(code) });
      }
    } catch (err) {
      setState({ status: 'error', message: errorText(err) });
    }
  }

  const timeLabel = (x: string) => (lang === 'id' ? x.replace(':', '.') : x);
  return (
    <section id="contact" data-8b-section="contact" aria-labelledby="contact-title">
      <figure className="ct__room"><img src="/img/order.jpg" width={1024} height={683} alt={c.alt} loading="lazy" /></figure>
      <div className="ct__card m-surface">
        <div className="ct__top">
          <p className="m-text-3">{c.label}</p>
          <h2 id="contact-title" className="m-text-2">{c.title}</h2>
        </div>
        {state.status === 'done' ? (
          <div className="ct__form" role="status">
            <p className="ct__done m-text">{state.message}</p>
            <button className="m-btn" type="button" onClick={() => setState({ status: 'idle', message: '' })}><span className="m-btn__label">{c.again}</span></button>
          </div>
        ) : (
          <form className="ct__form" onSubmit={submit} noValidate>
            <label className="m-field ct__wide"><span className="m-field__label">{c.type}</span>
              <select id="r-type" className="m-field__input" value={kind} onChange={(e) => setKind(e.target.value as Preset)}>
                {(Object.keys(c.types) as Preset[]).map((k) => <option key={k} value={k}>{c.types[k as keyof typeof c.types]}</option>)}
              </select>
            </label>
            <label className="m-field"><span className="m-field__label">{c.name}</span>
              <input id="r-name" className="m-field__input" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="m-field"><span className="m-field__label">{c.phone}</span>
              <input id="r-phone" className="m-field__input" type="tel" autoComplete="tel" inputMode="numeric" placeholder="0812xxxxxxxx" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label className="m-field"><span className="m-field__label">{c.date}</span>
              <input id="r-date" className="m-field__input" type="date" min={todayISO()} required value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            {kind === 'wedding' ? (
              <>
                <label className="m-field"><span className="m-field__label">{c.session}</span>
                  <select id="r-session" className="m-field__input" value={session} onChange={(e) => setSession(e.target.value as Session)}>
                    <option value="dinner">{c.sessions.dinner}</option><option value="lunch">{c.sessions.lunch}</option>
                  </select>
                </label>
                <label className="m-field"><span className="m-field__label">{c.estimate}</span>
                  <input id="r-estimate" className="m-field__input" type="number" min={40} max={120} value={estimate} onChange={(e) => setEstimate(Number(e.target.value))} />
                </label>
              </>
            ) : (
              <>
                <label className="m-field"><span className="m-field__label">{c.time}</span>
                  <select id="r-time" className="m-field__input" value={time} onChange={(e) => setTime(e.target.value)}>
                    {times.map((x) => <option key={x} value={x}>{timeLabel(x)}</option>)}
                  </select>
                </label>
                <label className="m-field"><span className="m-field__label">{c.pax}</span>
                  <select id="r-pax" className="m-field__input" value={pax} onChange={(e) => setPax(Number(e.target.value))}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {c.people}</option>)}
                  </select>
                </label>
              </>
            )}
            <label className="m-field ct__wide"><span className="m-field__label">{c.notes}</span>
              <textarea id="r-notes" className="m-field__input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
            {state.status === 'error' && <p className="ct__error ct__wide" role="alert">{state.message}</p>}
            <button className="m-btn" type="submit" disabled={state.status === 'sending'}>
              <span className="m-btn__label">{state.status === 'sending' ? c.sending : c.submit}</span>
            </button>
            {api.mode === 'demo' && <p className="m-text-8 ct__wide">{c.demo}</p>}
          </form>
        )}
        <dl className="ct__info">
          <div><dt className="m-text-3">{c.info.address}</dt><dd className="m-text">{brand.address[0]}<br />{brand.address[1]}</dd></div>
          <div><dt className="m-text-3">{c.info.open}</dt><dd className="m-text">{c.info.hours[0]}<br />{c.info.hours[1]}</dd></div>
          <div><dt className="m-text-3">{c.info.whatsapp}</dt><dd><a className="m-link" href={brand.whatsappUrl}>{brand.phoneLabel}</a></dd></div>
          <div><dt className="m-text-3">{c.info.email}</dt><dd className="m-text">{brand.email}</dd></div>
        </dl>
      </div>
    </section>
  );
}

function Footer({ t }: { t: HomeCopy }) {
  const f = t.footer;
  return (
    <footer id="footer" data-8b-section="footer">
      <p className="ft__word" aria-hidden="true">{brand.name}<span>{brand.kanji}</span></p>
      <div className="ft__cols">
        <nav className="ft__col" aria-label={f.restaurant}>
          <p className="m-text-3">{f.restaurant}</p>
          <a className="m-link-2" href="#season">{t.nav.season}</a>
          <a className="m-link-2" href="#work">{t.nav.work}</a>
          <a className="m-link-2" href="#dusk">{t.nav.dusk}</a>
          <a className="m-link-2" href="#standing">{t.nav.standing}</a>
        </nav>
        <nav className="ft__col" aria-label={f.events}>
          <p className="m-text-3">{f.events}</p>
          <a className="m-link-2" href="#events">{f.weddings}</a>
          <a className="m-link-2" href="#faq">{t.nav.faq}</a>
          <a className="m-link-2" href="#contact">{f.reserve}</a>
        </nav>
        <div className="ft__col">
          <p className="m-text-3">{f.find}</p>
          <p>{brand.address[0]}<br />{brand.address[1]}</p>
          <p className="m-text-8">{f.closed}</p>
          <a className="m-link-2" href={brand.whatsappUrl}>{brand.phoneLabel}</a>
        </div>
        <div className="ft__col">
          <p className="m-text-3">{f.credits}</p>
          <details className="ft__credits">
            <summary className="m-link-2">{f.creditsOpen}</summary>
            <p className="m-text-8">{f.creditsText}</p>
          </details>
        </div>
      </div>
      <div className="ft__base m-text-8">
        <p>© 2026 {brand.name}. {f.base} <a href="https://8b.com/" style={{ color: 'inherit' }}>8B</a> (MIT)</p>
        <a className="m-link-2" href="#opening">{f.back}</a>
      </div>
    </footer>
  );
}

export default function Home() {
  const { lang } = useLang();
  const t = homeCopy[lang];
  const [preset, setPreset] = useState<{ value: Preset; n: number }>({ value: 'table', n: 0 });
  const onPreset = (value: Preset) => setPreset((p) => ({ value, n: p.n + 1 }));
  useHomeMotion([lang]);
  useEffect(() => {
    document.title = `${brand.name} · Kaiseki & omakase`;
  }, []);
  return (
    <div className="home">
      <a className="skip" href="#main">{t.skip}</a>
      <Nav t={t} />
      <main id="main">
        <Opening t={t} onPreset={onPreset} />
        <Season t={t} />
        <Work t={t} />
        <Dusk t={t} />
        <Standing t={t} onPreset={onPreset} />
        <Events t={t} onPreset={onPreset} />
        <Faq t={t} />
        <Contact t={t} preset={preset} />
      </main>
      <Footer t={t} />
    </div>
  );
}
