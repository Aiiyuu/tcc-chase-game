/**
 * index.ts
 *
 * This file is responsible for processing webpage tasks that are
 * not considered part of the game.
 */

import { throttledMotorcycleScroll } from './motorcycle-scroll.js';

/**
 * This function sets up the click event listener for the play button.
 */
function setupPlayButtonEventListener(): void {
  const playButton = document.getElementById(
    'start-game',
  )! as HTMLButtonElement;
  const gameWindow = document.getElementById('game')! as HTMLDivElement;

  playButton.addEventListener('click', (): void => {
    gameWindow.classList.add('show');
    window.removeEventListener('scroll', setupScrollAnimation);
  });
}

/**
 * Creates scroll animation
 */
function setupScrollAnimation(): void {
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
    if (header && !header.classList.contains('fixed')) {
      header.classList.add('fixed');
    }
    throttledMotorcycleScroll({
      motorcycle,
      dust,
      scrollPosition,
      maxMotorcycleScroll,
      windowWidth,
      throttling_time: THROTTLING_TIME,
    });
  } else {
    if (header && header.classList.contains('fixed')) {
      header.classList.remove('fixed');
    }
  }
}

const header: HTMLHeadElement | null = document.querySelector('.header');

window.addEventListener('DOMContentLoaded', (): void => {
  setupPlayButtonEventListener();

  window.addEventListener('scroll', setupScrollAnimation);
});
