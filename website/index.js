/**
 * index.ts
 *
 * This file is responsible for processing webpage tasks that are
 * not considered part of the game.
 */
import { triggerRibbons, RIBBONS_DELAY } from './ribbons.js';
import { setupScrollAnimation } from './setupScrollAnimation.js';
import { showLoadingUntilSiteLoaded } from './loader.js';
import { setupShop, handleTentaclesMovement, handleTentaclesCollapse, setupShopSlider, } from './shop.js';
/**
 * This function sets up the click event listener for the play button.
 */
function setupPlayButtonEventListener() {
    const playButton = document.getElementById('start-game');
    const gameWindow = document.getElementById('game');
    playButton.addEventListener('click', () => {
        window.removeEventListener('scroll', scrollAnimation);
        window.removeEventListener('mousemove', handleTentaclesMovement);
        window.removeEventListener('click', handleTentaclesCollapse);
        triggerRibbons();
        setTimeout(() => {
            gameWindow.classList.add('show');
        }, RIBBONS_DELAY / 2);
    });
}
function scrollAnimation() {
    setupScrollAnimation();
    setupShopSlider();
}
window.addEventListener('DOMContentLoaded', () => {
    showLoadingUntilSiteLoaded();
    setupPlayButtonEventListener();
    setupShop();
    window.addEventListener('scroll', scrollAnimation);
    window.addEventListener('mousemove', handleTentaclesMovement);
    window.addEventListener('click', handleTentaclesCollapse);
});
setTimeout(() => window.scrollTo(0, 0), 10);
//# sourceMappingURL=index.js.map
