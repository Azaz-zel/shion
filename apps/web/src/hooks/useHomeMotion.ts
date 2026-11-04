// Gerak beranda. Diadaptasi dari "motion kit" template 8B (MIT): penomoran --i untuk daftar,
// kelas is-in saat elemen masuk layar, wheel yang dihaluskan, dan jeda animasi berulang di luar layar.
// Ditambah: deck foto "Minggu ini" yang digerakkan scroll per baris.
import { useEffect } from 'react';

const live = () => document.documentElement.hasAttribute('data-8b-live');

function box(el: HTMLElement) {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

export function useHomeMotion(deps: unknown[]) {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const on = <K extends keyof WindowEventMap>(type: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      window.addEventListener(type, fn, opts);
      cleanups.push(() => window.removeEventListener(type, fn, opts));
    };

    // Navigasi: tinggi untuk CSS, sembunyi saat scroll ke bawah, muncul saat ke atas.
    const nav = document.getElementById('navigation');
    if (nav) {
      const setH = () => document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
      setH();
      const ro = new ResizeObserver(setH);
      ro.observe(nav);
      cleanups.push(() => ro.disconnect());
      let lastY = scrollY;
      let hidden = false;
      on('scroll', () => {
        const y = scrollY;
        const dy = y - lastY;
        if (Math.abs(dy) < 3) return;
        const menuOpen = document.getElementById('menu')?.hidden === false;
        const hide = dy > 0 && y > 140 && !menuOpen;
        if (hide !== hidden) {
          hidden = hide;
          nav.classList.toggle('is-hidden', hide);
        }
        lastY = y;
      }, { passive: true });
    }

    // Hero: hentikan animasi berulang saat layar pertama tidak terlihat.
    const opening = document.getElementById('opening');
    const hold = opening?.querySelector('.op__hold');
    if (opening && hold) {
      const io = new IntersectionObserver(([entry]) => opening.classList.toggle('is-off', !entry.isIntersecting));
      io.observe(hold);
      cleanups.push(() => io.disconnect());
    }

    // Deck foto "Minggu ini": foto ke-k bergeser keluar seiring teks bahan ke-k melewati tepi foto.
    const season = document.getElementById('season');
    if (season) {
      const frame = season.querySelector<HTMLElement>('.bench__frame')!;
      const rows = [...season.querySelectorAll<HTMLElement>('.bench__row')];
      const figs = [...season.querySelectorAll<HTMLElement>('.bench__ph')];
      const count = season.querySelector<HTMLElement>('.bench__count')!;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)');
      figs.forEach((fig, k) => fig.style.setProperty('--k', String(k)));
      let active = -1;
      let queued = false;
      const update = () => {
        queued = false;
        const fr = frame.getBoundingClientRect();
        const beside = fr.right <= rows[0].getBoundingClientRect().left + 1;
        const line = beside ? fr.top : fr.bottom;
        const progress = rows.map((row) => {
          const r = row.getBoundingClientRect();
          const end = row.querySelector('.bench__note')!.getBoundingClientRect().bottom - r.top;
          const p = Math.min(1, Math.max(0, (line - r.top) / end));
          return reduce.matches ? (p >= 1 ? 1 : 0) : p;
        });
        figs.forEach((fig, k) => {
          fig.style.setProperty('--p', (k < figs.length - 1 ? progress[k] : 0).toFixed(4));
          fig.style.setProperty('--q', (k === 0 ? 1 : progress[k - 1]).toFixed(4));
        });
        let next = progress.findIndex((p) => p < 1);
        if (next < 0) next = rows.length - 1;
        if (next === active) return;
        active = next;
        rows.forEach((row, k) => row.classList.toggle('is-active', k === active));
        count.textContent = `${active + 1} / ${rows.length} · ${rows[active].querySelector('.bench__name')!.textContent}`;
      };
      const queue = () => {
        if (!queued) {
          queued = true;
          requestAnimationFrame(update);
        }
      };
      on('scroll', queue, { passive: true });
      on('resize', queue);
      update();
    }

    if (!live()) return () => cleanups.forEach((fn) => fn());

    // Penomoran --i / --n untuk grup yang punya data-8b-items.
    const number = () =>
      document.querySelectorAll<HTMLElement>('[data-8b-items]').forEach((group) => {
        const items = [...group.querySelectorAll<HTMLElement>(group.getAttribute('data-8b-items')!)];
        items.forEach((item, i) => {
          item.style.setProperty('--i', String(i));
          item.style.setProperty('--n', String(items.length));
        });
      });
    number();

    // Animasi scroll perlu disejajarkan ulang setelah layout berubah (font selesai dimuat, resize).
    const realign = () =>
      document.getAnimations().forEach((a) => {
        if (a.timeline && a.timeline !== document.timeline && a.playState === 'running') {
          a.pause();
          a.play();
        }
      });

    // Elemen data-8b-motion mendapat kelas is-in saat bagian atasnya melewati garis masuk.
    let pending = [...document.querySelectorAll<HTMLElement>('[data-8b-motion]')].map((el) => {
      const own = /^(\d{1,3}(?:\.\d+)?)%$/.exec((el.getAttribute('data-8b-enter') ?? '').trim());
      return { el, y: 0, at: own && +own[1] <= 100 ? +own[1] / 100 : 0.88 };
    });
    let checkQueued = false;
    const check = () => {
      checkQueued = false;
      pending = pending.filter((item) => {
        if (item.y > scrollY + innerHeight * item.at) return true;
        item.el.classList.add('is-in');
        return false;
      });
    };
    const queueCheck = () => {
      if (!checkQueued) {
        checkQueued = true;
        requestAnimationFrame(check);
      }
    };
    const measure = () => {
      number();
      pending.forEach((item) => (item.y = box(item.el)));
      queueCheck();
      realign();
    };
    measure();
    on('scroll', queueCheck, { passive: true });
    const ro = new ResizeObserver(() => requestAnimationFrame(measure));
    ro.observe(document.body);
    cleanups.push(() => ro.disconnect());
    void document.fonts?.ready.then(() => requestAnimationFrame(measure));

    // Wheel yang dihaluskan (hanya mouse/trackpad; layar sentuh memakai scroll bawaan).
    if (matchMedia('(pointer: fine)').matches) {
      let target = scrollY;
      let current = scrollY;
      let last = 0;
      let running = false;
      const step = (now: number) => {
        current += (target - current) * (1 - Math.exp(-5.3 * Math.min(0.05, (now - last) / 1000)));
        last = now;
        if (Math.abs(target - current) < 0.5) current = target;
        window.scrollTo({ top: current, behavior: 'instant' as ScrollBehavior });
        if (current !== target) requestAnimationFrame(step);
        else running = false;
      };
      const scrollsInside = (node: Element | null, dy: number) => {
        for (; node && node !== document.body && node !== document.documentElement; node = node.parentElement) {
          const el = node as HTMLElement;
          if (!/(auto|scroll)/.test(getComputedStyle(el).overflowY) || el.scrollHeight <= el.clientHeight) continue;
          if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
        }
        return false;
      };
      on('wheel', (event) => {
        const menuOpen = document.getElementById('menu')?.hidden === false;
        if (menuOpen || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || scrollsInside(event.target as Element, event.deltaY)) return;
        event.preventDefault();
        if (!running) target = current = scrollY;
        const unit = event.deltaMode === 1 ? 40 : event.deltaMode === 2 ? innerHeight : 1;
        target = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, target + event.deltaY * unit * 0.95));
        if (!running) {
          running = true;
          last = performance.now();
          requestAnimationFrame(step);
        }
      }, { passive: false });
    }

    requestAnimationFrame(realign);
    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
