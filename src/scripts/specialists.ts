import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Splits text into per-character spans (hidden from assistive tech; the parent keeps aria-label). */
function splitChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent?.trim() ?? '';
  el.textContent = '';
  return [...text].map((char) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.setAttribute('aria-hidden', 'true');
    el.append(span);
    return span;
  });
}

export function initSpecialists(): void {
  const section = document.getElementById('especialistas');
  if (!section) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const badge = section.querySelector<SVGElement>('[data-spin]');
  if (badge && !reduced) {
    gsap.to(badge, { rotate: 360, duration: 20, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
  }

  const target = section.querySelector<HTMLElement>('[data-typewriter]');
  if (!target || reduced) return;

  const chars = splitChars(target);
  gsap.set(chars, { opacity: 0 });
  gsap.to(chars, {
    opacity: 1,
    duration: 0.01,
    stagger: 0.035,
    ease: 'none',
    scrollTrigger: { trigger: target, start: 'top 80%', once: true },
  });
}
