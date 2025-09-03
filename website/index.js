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
function setupPlayButtonEventListener(playButton, gameWindow, backgroundMusic) {
    playButton.addEventListener('click', () => {
        gameWindow.classList.add('show');
        backgroundMusic.play();
    });
}
const PLAY_BUTTON = document.getElementById('start-game');
const GAME_WINDOW = document.getElementById('game');
const BACKGROUND_MUSIC = document.getElementById('background-music');
const MUSIC_VOLUME = 0.6;
BACKGROUND_MUSIC.volume = MUSIC_VOLUME;
window.addEventListener('DOMContentLoaded', () => {
    setupPlayButtonEventListener(PLAY_BUTTON, GAME_WINDOW, BACKGROUND_MUSIC);
});
export {};
//# sourceMappingURL=index.js.map
