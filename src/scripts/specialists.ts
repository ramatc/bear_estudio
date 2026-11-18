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

/** Background stars drift, spin and twinkle, each on its own randomized loop. */
function animateStars(section: HTMLElement): void {
  const rand = gsap.utils.random;
  section.querySelectorAll<HTMLElement>('[data-star]').forEach((star) => {
    gsap.to(star, { rotate: '+=360', duration: rand(10, 20), repeat: -1, ease: 'none' });
    gsap.to(star, {
      x: () => rand(-24, 24),
      y: () => rand(-24, 24),
      duration: rand(3, 6),
      repeat: -1,
      repeatRefresh: true,
      ease: 'sine.inOut',
    });
    gsap.to(star, { opacity: rand(0.1, 0.6), duration: rand(1.5, 3), repeat: -1, yoyo: true, ease: 'sine.inOut', delay: rand(0, 2) });
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

  if (!reduced) animateStars(section);

  const target = section.querySelector<HTMLElement>('[data-typewriter]');
  if (!target || reduced) return;

  const follow = section.querySelector<HTMLElement>('[data-typewriter-follow]');
  const chars = splitChars(target);
  const followChars = follow ? splitChars(follow) : [];
  gsap.set([...chars, ...followChars], { opacity: 0 });

  const tl = gsap.timeline({ scrollTrigger: { trigger: target, start: 'top 80%', once: true } });
  tl.to(chars, { opacity: 1, duration: 0.01, stagger: 0.022, ease: 'none' });
  if (followChars.length) {
    tl.to(followChars, { opacity: 1, duration: 0.01, stagger: 0.035, ease: 'none' }, '+=0.3');
  }
}
