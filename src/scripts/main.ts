import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import Lenis from 'lenis';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const q = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s)!;
const rand = gsap.utils.random;
const COLORS = ['#e0476a', '#f5c242', '#8fc3a0', '#7fb5ea', '#b9a4e6', '#f7a98b'];

/* ───────── scroll suave ───────── */
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const scrollTo = (target: string | HTMLElement, offset = 0) =>
  lenis ? lenis.scrollTo(target as any, { offset, duration: 1.6 }) : (typeof target === 'string' ? $(target) : target).scrollIntoView({ behavior: 'auto' });

q('[data-scroll-to]').forEach((a) =>
  a.addEventListener('click', (e) => {
    e.preventDefault();
    scrollTo(a.dataset.scrollTo!);
  })
);

/* ───────── barra de progreso (tira de washi) ───────── */
gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

/* ───────── destellos que siguen al cursor ───────── */
if (finePointer && !reduce) {
  const shapes = [
    '<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.8-8 11-8 11z"/>',
    '<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.2l7.1-.6z"/>',
    '<path d="M12 1 Q13 11 23 12 Q13 13 12 23 Q11 13 1 12 Q11 11 12 1Z"/>',
  ];
  let lx = 0, ly = 0;
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const dx = e.clientX - lx, dy = e.clientY - ly;
    if (dx * dx + dy * dy < 1100) return;
    lx = e.clientX; ly = e.clientY;
    const s = document.createElement('div');
    s.className = 'spark';
    s.innerHTML = `<svg viewBox="0 0 24 24" fill="${COLORS[Math.floor(Math.random() * COLORS.length)]}">${shapes[Math.floor(Math.random() * shapes.length)]}</svg>`;
    document.body.append(s);
    gsap.fromTo(
      s,
      { x: e.clientX - 8, y: e.clientY - 8, scale: rand(0.6, 1.2), rotation: rand(-40, 40), opacity: 1 },
      { x: e.clientX + rand(-26, 26), y: e.clientY + rand(16, 48), scale: 0, rotation: '+=100', opacity: 0, duration: rand(0.7, 1.1), ease: 'power1.out', onComplete: () => s.remove() }
    );
  });
}

/* ───────── portada ───────── */
const chars = q('.hero .ch');
const heroDoodles = q<SVGElement>('.hero .doodle');
let introDone = reduce;

if (!reduce) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => (introDone = true) });
  tl.fromTo(
    chars,
    { y: -160, rotation: () => rand(-50, 50), opacity: 0 },
    { y: 0, rotation: 0, opacity: 1, duration: 1.1, ease: 'bounce.out', stagger: { each: 0.04, from: 'random' } }
  )
    .fromTo('.hl', { scaleX: 0, rotation: -1.2 }, { scaleX: 1, rotation: -1.2, duration: 0.6 }, '-=0.5')
    .fromTo('.age', { scale: 0, rotation: -90, opacity: 0 }, { scale: 1, rotation: 14, opacity: 1, duration: 0.6, ease: 'back.out(2.6)' }, '-=0.3')
    .fromTo('#cake-wrap', { y: 90, opacity: 0, scale: 0.85 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.6)' }, '-=0.6')
    .fromTo(heroDoodles, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2.6)', stagger: 0.09 }, '-=0.7')
    .fromTo('#hint', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
    .to('.h-arrow [data-draw]', { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, '-=0.2')
    .fromTo('.scroll-cue', { opacity: 0 }, { opacity: 0.75, duration: 0.5 }, '-=0.4');

  // los garabatos flotan despacito
  heroDoodles.forEach((d) =>
    gsap.to(d, { y: `+=${rand(8, 16)}`, rotation: `+=${rand(-8, 8)}`, duration: rand(2.2, 3.6), yoyo: true, repeat: -1, ease: 'sine.inOut', delay: rand(0, 1.5) })
  );
  gsap.to('.scroll-cue svg', { y: 6, duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  // las letras saltan cuando pasas el mouse
  chars.forEach((c) =>
    c.addEventListener('pointerenter', () => {
      if (!introDone) return;
      gsap.to(c, { y: -16, rotation: rand(-14, 14), duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out', overwrite: 'auto' });
    })
  );
}

/* ───────── pastel y velitas ───────── */
const candles = q<SVGGElement>('[data-candle]');
const hintText = $('.hint-text');
const lit = new Array(candles.length).fill(true);
const flicker: gsap.core.Tween[] = [];

candles.forEach((c, i) => {
  const flame = $('[data-flame]', c);
  gsap.set(flame, { transformOrigin: '50% 100%' });
  const startFlicker = () => {
    flicker[i] = gsap.to(flame, { scaleY: () => rand(0.88, 1.14), scaleX: () => rand(0.9, 1.1), skewX: () => rand(-7, 7), duration: () => rand(0.1, 0.22), repeat: -1, yoyo: true, repeatRefresh: true, ease: 'sine.inOut' });
  };
  if (!reduce) startFlicker();
  (c as any)._start = startFlicker;
});

function setHint(text: string) {
  if (reduce) { hintText.textContent = text; return; }
  gsap.timeline()
    .to(hintText, { y: -10, opacity: 0, duration: 0.15 })
    .add(() => { hintText.textContent = text; })
    .fromTo(hintText, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'back.out(2)' });
}

function remaining() {
  return lit.filter(Boolean).length;
}

function toggleCandle(i: number) {
  const c = candles[i];
  const flame = $('[data-flame]', c);
  const smoke = $('.smoke', c);
  if (lit[i]) {
    lit[i] = false;
    flicker[i]?.kill();
    gsap.to(flame, { scaleY: 0, scaleX: 0.3, duration: 0.2, ease: 'power2.in', overwrite: true });
    gsap.fromTo(smoke, { opacity: 0.75, y: 0 }, { opacity: 0, y: -34, duration: 1.3, ease: 'power1.out' });
    const left = remaining();
    if (left === 0) celebrate();
    else setHint(left === 1 ? '¡falta una!' : `¡faltan ${left}!`);
  } else {
    lit[i] = true;
    gsap.fromTo(flame, { scaleY: 0, scaleX: 0.3 }, { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1,.4)', overwrite: true, onComplete: () => !reduce && (c as any)._start() });
    if (remaining() === candles.length) setHint('toca las velitas para apagarlas');
  }
}

candles.forEach((c, i) => {
  c.addEventListener('click', () => toggleCandle(i));
  c.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCandle(i); }
  });
});

function celebrate() {
  setHint('¡pide un deseo!');
  const heart = confetti.shapeFromPath({ path: 'M167 72c19-38 37-56 75-56 42 0 76 33 76 75 0 76-76 151-151 227C90 242 15 167 15 91c0-42 34-75 76-75 38 0 57 18 76 56z' });
  const burst = (x: number, angle: number, count = 70) =>
    confetti({ particleCount: count, angle, spread: 75, origin: { x, y: 0.72 }, colors: COLORS, shapes: [heart, 'star', 'circle'], scalar: 1.3, ticks: 280, startVelocity: 48, disableForReducedMotion: true });
  burst(0.05, 60); burst(0.95, 120);
  setTimeout(() => { burst(0.3, 80, 50); burst(0.7, 100, 50); }, 350);
  setTimeout(() => confetti({ particleCount: 90, spread: 360, startVelocity: 22, gravity: 0.7, ticks: 320, origin: { x: 0.5, y: 0.35 }, colors: COLORS, shapes: [heart, 'star'], scalar: 1.2, disableForReducedMotion: true }), 750);

  if (!reduce) {
    gsap.to(chars, { y: -22, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1, stagger: { each: 0.04 }, overwrite: 'auto' });
    gsap.fromTo('#cake-wrap', { rotation: -3 }, { rotation: 0, duration: 1.2, ease: 'elastic.out(1,.3)' });
  }
  setTimeout(() => {
    if (scrollY < innerHeight * 0.4 && remaining() === 0) scrollTo('#collage');
  }, 2800);
}

/* ───────── capítulos ───────── */
q('.chapter-head').forEach((h) => {
  const stamp = $('[data-stamp]', h), title = $('[data-ch-title]', h), note = $('[data-ch-note]', h), line = $('[data-draw-line]', h);
  if (reduce) { gsap.set(stamp, { rotation: -10 }); return; }
  gsap.timeline({ scrollTrigger: { trigger: h, start: 'top 85%', once: true } })
    .fromTo(stamp, { scale: 0, rotation: -140, opacity: 0 }, { scale: 1, rotation: -10, opacity: 1, duration: 0.8, ease: 'back.out(2.6)' })
    .fromTo(title, { y: 60, opacity: 0, rotation: 2 }, { y: 0, opacity: 1, rotation: 0, duration: 0.8, ease: 'power3.out' }, '-=0.45')
    .to(line, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, '-=0.3')
    .fromTo(note, { opacity: 0, y: 24 }, { opacity: 0.75, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5');
});

/* ───────── polaroids ───────── */
const pols = q('[data-pol]');
const tapes = q('.tape');
tapes.forEach((t) => gsap.set(t, { rotation: parseFloat(t.dataset.trot!), scaleX: reduce ? 1 : 0 }));
q('.pol-in').forEach((p) => gsap.set(p, { rotation: parseFloat(p.dataset.rot!) }));

if (!reduce) {
  ScrollTrigger.batch(pols, {
    start: 'top 93%',
    once: true,
    onEnter: (batch) => {
      const ins = batch.map((b) => $('.pol-in', b));
      gsap.fromTo(
        ins,
        { y: 170, x: () => rand(-90, 90), rotation: () => rand(-34, 34), scale: 0.6, opacity: 0 },
        { y: 0, x: 0, rotation: (_i, el) => parseFloat(el.dataset.rot), scale: 1, opacity: 1, duration: 1.05, ease: 'back.out(1.5)', stagger: 0.12, overwrite: 'auto' }
      );
      gsap.to(batch.map((b) => $('.tape', b)), { scaleX: 1, duration: 0.35, ease: 'power2.out', delay: 0.95, stagger: 0.12 });
    },
  });
}

if (finePointer && !reduce) {
  // hover: se endereza y se levanta
  pols.forEach((p) => {
    const inner = $('.pol-in', p);
    p.addEventListener('pointerenter', () => gsap.to(inner, { rotation: 0, scale: 1.05, y: -6, duration: 0.3, ease: 'power2.out', overwrite: 'auto' }));
    p.addEventListener('pointerleave', () => gsap.to(inner, { rotation: parseFloat(inner.dataset.rot!), scale: 1, y: 0, duration: 0.5, ease: 'elastic.out(1,.55)', overwrite: 'auto' }));
  });
}

/* ───────── garabatos con parallax ───────── */
q<SVGElement>('.c-doodle, .l-d').forEach((d) => {
  const speed = parseFloat(d.dataset.speed || '0.3');
  if (reduce) return;
  gsap.from(d, { scale: 0, opacity: 0, duration: 0.8, ease: 'back.out(2.4)', scrollTrigger: { trigger: d, start: 'top 92%', once: true } });
  gsap.to(d, { y: -speed * 340, rotation: `+=${speed * 50}`, ease: 'none', scrollTrigger: { trigger: d.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
});

/* ───────── sobre y carta ───────── */
{
  const wrap = $('[data-env-wrap]');
  const env = $<HTMLButtonElement>('[data-env]');
  const flap = $('[data-flap]');
  const paper = $('[data-paper]');
  const lines = q('[data-line]', paper);
  const invite = $('[data-env-invite]');
  let opened = false;

  if (!reduce) {
    gsap.set(flap, { transformPerspective: 900, transformOrigin: '50% 0' });
    // el sobre "toca la puerta" cada tanto
    gsap.timeline({ repeat: -1, repeatDelay: 2.6, scrollTrigger: { trigger: wrap, start: 'top 90%' } })
      .to(env, { rotation: 3, duration: 0.07 }).to(env, { rotation: -3, duration: 0.07 }).to(env, { rotation: 2, duration: 0.07 })
      .to(env, { rotation: -2, duration: 0.07 }).to(env, { rotation: 0, duration: 0.1 });
    gsap.from([invite, wrap], { y: 60, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: invite, start: 'top 88%', once: true } });
  }

  env.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    env.setAttribute('aria-expanded', 'true');
    gsap.killTweensOf(env);
    const paperH = paper.offsetHeight + 24;
    const startH = wrap.offsetHeight;
    const hearts = confetti.shapeFromPath({ path: 'M167 72c19-38 37-56 75-56 42 0 76 33 76 75 0 76-76 151-151 227C90 242 15 167 15 91c0-42 34-75 76-75 38 0 57 18 76 56z' });
    if (reduce) {
      gsap.set(env, { display: 'none' }); gsap.set(invite, { display: 'none' });
      gsap.set(paper, { visibility: 'visible', position: 'relative' }); gsap.set(wrap, { height: 'auto' });
      return;
    }
    gsap.timeline()
      .to(invite, { opacity: 0, y: -10, duration: 0.3 })
      .to(flap, { rotationX: 180, duration: 0.65, ease: 'power2.inOut' }, 0)
      .add(() => confetti({ particleCount: 40, spread: 70, startVelocity: 28, origin: { x: 0.5, y: 0.55 }, colors: COLORS, shapes: [hearts, 'star'], scalar: 1.1, disableForReducedMotion: true }), 0.45)
      .to(env, { y: 110, opacity: 0, duration: 0.6, ease: 'power2.in' }, 0.65)
      .set(paper, { visibility: 'visible' }, 0.75)
      .fromTo(wrap, { height: startH }, { height: paperH, duration: 0.8, ease: 'power3.inOut' }, 0.75)
      .fromTo(paper, { y: 150, opacity: 0, scale: 0.88, rotation: -6 }, { y: 0, opacity: 1, scale: 1, rotation: -0.8, duration: 1, ease: 'back.out(1.3)' }, 0.8)
      .fromTo(lines, { opacity: 0, y: 14, rotation: -1 }, { opacity: 1, y: 0, rotation: 0, duration: 0.55, stagger: 0.45, ease: 'power2.out' }, 1.5)
      .add(() => ScrollTrigger.refresh());
    setTimeout(() => scrollTo(wrap, -80), 500);
    gsap.fromTo('[data-fin]', { opacity: 0 }, { opacity: 0.6, duration: 1, delay: 3.5 });
  });
}

/* ───────── visor de fotos ───────── */
{
  const lb = $<HTMLDialogElement>('#lb');
  const frame = $('.lb-frame', lb);
  const img = $<HTMLImageElement>('img', lb);
  const cap = $('figcaption', lb);
  let cur = 0;

  const load = (i: number) => {
    cur = (i + pols.length) % pols.length;
    const p = pols[cur];
    img.src = p.dataset.full!;
    img.alt = p.dataset.cap || 'Un recuerdo';
    cap.textContent = p.dataset.cap || '';
  };

  async function openAt(i: number) {
    const from = pols[i];
    load(i);
    gsap.set(frame, { opacity: 0 });
    lb.showModal();
    lenis?.stop();
    await img.decode().catch(() => {});
    if (reduce) return void gsap.set(frame, { opacity: 1 });
    const a = $('img', from).getBoundingClientRect();
    const b = frame.getBoundingClientRect();
    gsap.fromTo(
      frame,
      { opacity: 1, x: a.left + a.width / 2 - (b.left + b.width / 2), y: a.top + a.height / 2 - (b.top + b.height / 2), scale: a.width / (b.width - 24), rotation: parseFloat($('.pol-in', from).dataset.rot!) },
      { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.6, ease: 'power3.out' }
    );
  }

  async function go(dir: number) {
    load(cur + dir);
    gsap.set(frame, { opacity: 0 });
    await img.decode().catch(() => {});
    gsap.fromTo(frame, { x: dir * 80, opacity: 0, rotation: dir * 5, scale: 0.96 }, { x: 0, opacity: 1, rotation: 0, scale: 1, duration: reduce ? 0 : 0.4, ease: 'power3.out' });
  }

  function close() {
    if (reduce) return lb.close();
    gsap.to(frame, { opacity: 0, scale: 0.92, y: 24, duration: 0.2, ease: 'power2.in', onComplete: () => lb.close() });
  }

  lb.addEventListener('close', () => { lenis?.start(); gsap.set(frame, { clearProps: 'all' }); });
  $('.lb-x', lb).addEventListener('click', close);
  $('.lb-prev', lb).addEventListener('click', () => go(-1));
  $('.lb-next', lb).addEventListener('click', () => go(1));
  lb.addEventListener('click', (e) => { const t = e.target as HTMLElement; if (t === lb || t.classList.contains('lb-fig')) close(); });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });
  let sx = 0;
  lb.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  });

  pols.forEach((p, i) => {
    p.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAt(i); }
    });
  });

  /* arrastrar (solo con mouse; en el celular el dedo sigue haciendo scroll) */
  if (finePointer && !reduce) {
    let z = 10;
    pols.forEach((p, i) => {
      const inner = $('.pol-in', p);
      const base = () => parseFloat(inner.dataset.rot!);
      Draggable.create(p, {
        type: 'x,y',
        bounds: '#collage',
        inertia: true,
        minimumMovement: 6,
        zIndexBoost: false,
        onPress() {
          p.style.zIndex = String(++z);
          gsap.to(inner, { scale: 1.08, rotation: 0, duration: 0.2, overwrite: 'auto' });
        },
        onDrag() {
          const vx = InertiaPlugin.getVelocity(p, 'x') as number;
          gsap.to(inner, { rotation: gsap.utils.clamp(-16, 16, vx / 80), duration: 0.25, overwrite: 'auto' });
        },
        onRelease() {
          gsap.to(inner, { scale: 1, rotation: base(), duration: 0.8, ease: 'elastic.out(1,.5)', overwrite: 'auto' });
        },
        onClick() {
          openAt(i);
        },
      });
    });
  } else {
    pols.forEach((p, i) => p.addEventListener('click', () => openAt(i)));
  }
}

addEventListener('load', () => ScrollTrigger.refresh());
