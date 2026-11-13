import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Fades up every `[data-reveal]` element the first time it enters the viewport. */
export function initReveals(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 }),
  });
  // Hide pending elements only once JS runs, so no-JS users always see content.
  gsap.set('[data-reveal]', { autoAlpha: 0 });
  ScrollTrigger.refresh();
}
