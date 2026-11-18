import { gsap } from 'gsap';

/**
 * Playful team section, per the Figma notes:
 * 1. clicked elements grow / shrink,
 * 2. the lime figure changes shape,
 * 3. the name tags trade places.
 */
export function initTeam(): void {
  const root = document.querySelector<HTMLElement>('[data-team]');
  if (!root) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. Figure changes on click.
  const shape = root.querySelector<HTMLButtonElement>('[data-shape]');
  const glyph = root.querySelector<HTMLElement>('[data-shape-glyph]');
  const options = [...root.querySelectorAll<HTMLElement>('[data-shape-option]')];
  let shapeIndex = 0;
  const showShape = () => options.forEach((o, i) => (o.hidden = i !== shapeIndex));
  shape?.addEventListener('click', () => {
    if (!glyph || options.length === 0) return;
    shapeIndex = (shapeIndex + 1) % options.length;
    if (reduced) {
      showShape();
      return;
    }
    gsap
      .timeline()
      .to(glyph, { scale: 0, rotate: '+=120', duration: 0.2, ease: 'power2.in' })
      .call(showShape)
      .to(glyph, { scale: 1, rotate: '+=120', duration: 0.5, ease: 'back.out(2.5)' });
  });

  // 1 + 3. Clicking a photo bounces it and rotates the heads (with their name tags) between slots.
  const groups = [root.querySelectorAll<HTMLElement>('.member'), root.querySelectorAll<HTMLElement>('[data-tag]')].map((list) => {
    const els = [...list];
    return { els, slots: els.map((el) => ({ l: el.style.getPropertyValue('--l'), t: el.style.getPropertyValue('--t') })) };
  });
  let offset = 0;

  const moveTo = (el: HTMLElement, slot: { l: string; t: string }) => {
    if (reduced) {
      el.style.setProperty('--l', slot.l);
      el.style.setProperty('--t', slot.t);
      return;
    }
    // FLIP: measure, move, then animate from the old position.
    const before = el.getBoundingClientRect();
    el.style.setProperty('--l', slot.l);
    el.style.setProperty('--t', slot.t);
    const after = el.getBoundingClientRect();
    gsap.fromTo(
      el,
      { x: before.left - after.left, y: before.top - after.top, rotate: gsap.utils.random(-12, 12) },
      { x: 0, y: 0, rotate: 0, duration: 0.7, ease: 'power3.inOut' },
    );
  };

  root.querySelectorAll<HTMLButtonElement>('[data-member]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!reduced) gsap.fromTo(btn, { scale: 0.85 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)', clearProps: 'scale' });

      offset = (offset + 1) % groups[1]!.els.length;
      groups.forEach(({ els, slots }) => els.forEach((el, i) => moveTo(el, slots[(i + offset) % slots.length]!)));
    });
  });

  // Gentle idle float on the retro desktop icons.
  if (!reduced) {
    root.querySelectorAll<HTMLElement>('[data-float]').forEach((el, i) => {
      gsap.to(el, { y: -10, duration: 2 + i * 0.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
  }
}
