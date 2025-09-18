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
function setupPlayButtonEventListener() {
    const playButton = document.getElementById('start-game');
    const gameWindow = document.getElementById('game');
    playButton.addEventListener('click', () => {
        gameWindow.classList.add('show');
        window.removeEventListener('scroll', setupScrollAnimation);
    });
}
/**
 * Creates scroll animation
 */
function setupScrollAnimation() {
    // Motorcycle scroll animation
    const motorcycle = document.querySelector('.header__motorcycle');
    const dust = document.querySelector('.header__motorcycle-dust');
    if (!motorcycle || !dust)
        return;
    const scrollPosition = window.scrollY;
    const maxMotorcycleScroll = window.innerHeight;
    const windowWidth = window.innerWidth;
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
    }
    else {
        if (header && header.classList.contains('fixed')) {
            header.classList.remove('fixed');
        }
    }
}
const header = document.querySelector('.header');
window.addEventListener('DOMContentLoaded', () => {
    setupPlayButtonEventListener();
    window.addEventListener('scroll', setupScrollAnimation);
});
//# sourceMappingURL=index.js.map
