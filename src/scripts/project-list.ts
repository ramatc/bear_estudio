import { gsap } from 'gsap';

export function initProjectList(): void {
  document.querySelectorAll<HTMLElement>('[data-project-list]').forEach(setupList);
}

function setupList(root: HTMLElement): void {
  setupLoadMore(root);
  if (window.matchMedia('(hover: hover)').matches) setupPreview(root);
}

/** "Ver más" reveals the next batch of hidden rows and removes itself when none are left. */
function setupLoadMore(root: HTMLElement): void {
  const button = root.querySelector<HTMLButtonElement>('[data-more]');
  if (!button) return;
  const step = Number(root.dataset.step) || 4;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  button.addEventListener('click', () => {
    const next = [...root.querySelectorAll<HTMLElement>('[data-row][hidden]')].slice(0, step);
    next.forEach((row) => (row.hidden = false));
    if (!reduced) gsap.from(next, { autoAlpha: 0, y: 24, duration: 0.6, stagger: 0.06, ease: 'power3.out' });
    next[0]?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    if (!root.querySelector('[data-row][hidden]')) button.remove();
  });
}

/** Cover card that follows the pointer while hovering a project with a cover image. */
function setupPreview(root: HTMLElement): void {
  const preview = root.querySelector<HTMLElement>('[data-preview]');
  if (!preview) return;

  const images = new Map<string, HTMLElement>();
  preview.querySelectorAll<HTMLElement>('[data-preview-img]').forEach((img) => images.set(img.dataset.previewImg!, img));

  const moveX = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3' });
  const moveY = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3' });
  const offset = () => ({ x: preview.offsetWidth / 2, y: preview.offsetHeight / 2 });

  let active: HTMLElement | undefined;

  root.addEventListener('pointermove', (e) => {
    const o = offset();
    moveX(e.clientX - o.x);
    moveY(e.clientY - o.y);
  });

  root.querySelectorAll<HTMLElement>('[data-project-link]').forEach((link) => {
    link.addEventListener('pointerenter', () => {
      const img = link.dataset.cover ? images.get(link.dataset.cover) : undefined;
      if (active && active !== img) gsap.to(active, { opacity: 0, duration: 0.25 });
      active = img;
      if (!img) {
        gsap.to(preview, { opacity: 0, scale: 0.9, duration: 0.25 });
        return;
      }
      gsap.to(img, { opacity: 1, duration: 0.25 });
      gsap.to(preview, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' });
    });
  });

  const list = root.querySelector('ol');
  const hide = () => gsap.to(preview, { opacity: 0, scale: 0.9, duration: 0.25 });
  list?.addEventListener('pointerleave', hide);

  // Scrolling moves the list without firing pointer events, so a fast scroll
  // could leave the preview stuck. Re-check what is under the pointer instead.
  let pointer: { x: number; y: number } | undefined;
  window.addEventListener('pointermove', (e) => (pointer = { x: e.clientX, y: e.clientY }), { passive: true });
  window.addEventListener(
    'scroll',
    () => {
      const under = pointer && document.elementFromPoint(pointer.x, pointer.y);
      if (!under || !list?.contains(under)) hide();
    },
    { passive: true },
  );
}
