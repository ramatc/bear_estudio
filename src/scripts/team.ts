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

  // 1 + 3. Clicking a photo bounces it and rotates the name tags between photos.
  const tags = [...root.querySelectorAll<HTMLElement>('[data-tag]')];
  const slots = tags.map((t) => ({ l: t.style.getPropertyValue('--l'), t: t.style.getPropertyValue('--t') }));
  let offset = 0;

  root.querySelectorAll<HTMLButtonElement>('[data-member]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!reduced) gsap.fromTo(btn, { scale: 0.85 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)', clearProps: 'scale' });

      offset = (offset + 1) % tags.length;
      tags.forEach((tag, i) => {
        const slot = slots[(i + offset) % slots.length]!;
        if (reduced) {
          tag.style.setProperty('--l', slot.l);
          tag.style.setProperty('--t', slot.t);
          return;
        }
        // FLIP: measure, move, then animate from the old position.
        const before = tag.getBoundingClientRect();
        tag.style.setProperty('--l', slot.l);
        tag.style.setProperty('--t', slot.t);
        const after = tag.getBoundingClientRect();
        gsap.fromTo(
          tag,
          { x: before.left - after.left, y: before.top - after.top, rotate: gsap.utils.random(-12, 12) },
          { x: 0, y: 0, rotate: 0, duration: 0.7, ease: 'power3.inOut' },
        );
      });
    });
  });

  // Gentle idle float on the retro desktop icons.
  if (!reduced) {
    root.querySelectorAll<HTMLElement>('[data-float]').forEach((el, i) => {
      gsap.to(el, { y: -10, duration: 2 + i * 0.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
  }
}
