/**
 * index.ts
 *
 * Entry point of the application.
 * Sets up the canvas, initializes the game, and starts the game loop.
 */

import setupCanvas from './core/setupCanvas.js';
import initGame from './core/initGame.js';
import gameLoop from './loop/gameLoop.js';

// Create canvas and get 2D drawing context
const { canvas, ctx } = setupCanvas();

// Initialize game, player and other elements (but don't start the game just yet)
const { game, player, tccEmployee, coins } = initGame(canvas, ctx);

// Start the game only after the user clicks the "Start Game" button
const START_BTN = document.getElementById('start-game') as HTMLButtonElement;

if (!START_BTN) {
  throw new Error("Cannot find element with ID 'start-game'");
}

START_BTN.addEventListener('click', (): void => {
  player.startMotorcycleSound();
  game.startBackgroundMusic();

  gameLoop({ game, player, tccEmployee, coins, ctx });
});
