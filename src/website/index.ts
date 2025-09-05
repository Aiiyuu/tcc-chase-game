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
function setupPlayButtonEventListener(
  playButton: HTMLButtonElement,
  gameWindow: HTMLDivElement,
): void {
  playButton.addEventListener('click', (): void => {
    gameWindow.classList.add('show');
  });
}

const PLAY_BUTTON = document.getElementById('start-game')! as HTMLButtonElement;
const GAME_WINDOW = document.getElementById('game')! as HTMLDivElement;

window.addEventListener('DOMContentLoaded', (): void => {
  setupPlayButtonEventListener(PLAY_BUTTON, GAME_WINDOW);
});
