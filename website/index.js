/**
 * index.ts
 *
 * This file is responsible for processing webpage tasks that are
 * not considered part of the game.
 */
/**
 * This function sets up the click event listener for the play button.
 *
 * @param playButton - The play button element.
 */
function setupPlayButtonEventListener(playButton, gameWindow) {
    playButton.addEventListener('click', () => {
        gameWindow.classList.add('show');
    });
}
const PLAY_BUTTON = document.getElementById('start-game');
const GAME_WINDOW = document.getElementById('game');
window.addEventListener('DOMContentLoaded', () => {
    setupPlayButtonEventListener(PLAY_BUTTON, GAME_WINDOW);
});
export {};
//# sourceMappingURL=index.js.map
