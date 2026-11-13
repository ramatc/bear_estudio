import { gsap } from 'gsap';

export function initHero(): void {
  const root = document.querySelector<HTMLElement>('[data-hero]');
  if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap
    .timeline({ defaults: { ease: 'power4.out' } })
    .from(root.querySelectorAll('[data-hero-line]'), { yPercent: 110, duration: 1.1, stagger: 0.12 })
    .from(root.querySelectorAll('[data-hero-fade]'), { autoAlpha: 0, y: 16, duration: 0.8, stagger: 0.08 }, '-=0.6')
    .from(
      root.querySelectorAll('[data-glyph]'),
      { scale: 0, rotate: '-=90', duration: 1, ease: 'back.out(1.7)', stagger: 0.1 },
      '-=0.8',
    );

  // Pointer parallax on decorative glyphs; transform-only so it stays on the compositor.
  const movers = gsap.utils.toArray<HTMLElement>('[data-glyph]', root).map((el) => ({
    x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3' }),
    y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3' }),
  }));

  root.addEventListener('pointermove', (e) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    movers.forEach((m, i) => {
      m.x(nx * 30 * (i + 1));
      m.y(ny * 30 * (i + 1));
    });
  });
}
