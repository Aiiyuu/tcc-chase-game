/**
 * ribbons.ts
 *
 * This file contains a function responsible for triggering the ribbons' animation.
 */

const ribbons: HTMLDivElement | null = document.querySelector('.ribbons');

export const RIBBONS_DELAY = 3500;

export function triggerRibbons(): void {
  if (!ribbons || ribbons.classList.contains('ribbons--active')) return;

  ribbons.classList.add('ribbons--active');

  setTimeout((): void => {
    ribbons.classList.remove('ribbons--active');
  }, RIBBONS_DELAY);
}
