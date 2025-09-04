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
const { game, player } = initGame(canvas, ctx);
// Start the game only after the user clicks the "Start Game" button
const startButton = document.getElementById('start-game');
if (!startButton) {
    throw new Error("Cannot find element with ID 'start-game'");
}
startButton.addEventListener('click', () => {
    player.startMotorcycleSound();
    gameLoop({ game, player, ctx });
});
//# sourceMappingURL=index.js.map
