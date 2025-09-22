/**
 * setupScrollAnimation.ts
 *
 * This file is responsible for handling scroll animation
 */

import { throttledMotorcycleScroll } from './motorcycleScroll.js';

/**
 * Creates scroll animation
 */
export function setupScrollAnimation(): void {
  // Motorcycle scroll animation
  const motorcycle: HTMLDivElement | null = document.querySelector(
    '.header__motorcycle',
  );
  const dust: HTMLDivElement | null = document.querySelector(
    '.header__motorcycle-dust',
  );

  if (!motorcycle || !dust) return;

  const scrollPosition: number = window.scrollY;
  const maxMotorcycleScroll: number = window.innerHeight;
  const windowWidth: number = window.innerWidth;

  const THROTTLING_TIME = 10; // 10ms

  // Unfixed header if the motorcycle animation is over
  if (scrollPosition < maxMotorcycleScroll) {
    header?.classList.add('fixed');
    shop?.classList.remove('show');

    throttledMotorcycleScroll({
      motorcycle,
      dust,
      scrollPosition,
      maxMotorcycleScroll,
      windowWidth,
      throttling_time: THROTTLING_TIME,
    });
  } else {
    header?.classList.remove('fixed');
    shop?.classList.add('show');
  }
}

const header: HTMLHeadElement | null = document.querySelector('.header');
const shop: HTMLDivElement | null = document.querySelector('.shop');
