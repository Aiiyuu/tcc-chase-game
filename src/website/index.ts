/**
 * index.ts
 *
 * This file is responsible for processing webpage tasks that are
 * not considered part of the game.
 */

import { triggerRibbons, RIBBONS_DELAY } from './ribbons.js';
import { setupScrollAnimation } from './setupScrollAnimation.js';
import {
  setupShop,
  handleTentaclesMovement,
  handleTentaclesCollapse,
  setupShopSlider,
} from './shop.js';

/**
 * This function sets up the click event listener for the play button.
 */
function setupPlayButtonEventListener(): void {
  const playButton = document.getElementById(
    'start-game',
  )! as HTMLButtonElement;
  const gameWindow = document.getElementById('game')! as HTMLDivElement;

  playButton.addEventListener('click', (): void => {
    window.removeEventListener('scroll', scrollAnimation);
    window.removeEventListener('mousemove', handleTentaclesMovement);
    window.removeEventListener('click', handleTentaclesCollapse);

    triggerRibbons();

    setTimeout((): void => {
      gameWindow.classList.add('show');
    }, RIBBONS_DELAY / 2);
  });
}

function scrollAnimation(): void {
  setupScrollAnimation();
  setupShopSlider();
}

window.addEventListener('DOMContentLoaded', (): void => {
  setupPlayButtonEventListener();
  setupShop();

  window.addEventListener('scroll', scrollAnimation);
  window.addEventListener('mousemove', handleTentaclesMovement);
  window.addEventListener('click', handleTentaclesCollapse);
});

setTimeout((): void => window.scrollTo(0, 0), 10);
