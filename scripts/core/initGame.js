/**
 * initGame.ts
 *
 * Initializes the game logic, player, and keyboard input handling.
 * Returns initialized game objects.
 */
// import entities
import Game from '../entities/game.js';
import Player from '../entities/player.js';
import { initKeyboardControls } from '../input/keyboard.js';
export default function initGame(canvas, ctx) {
    // Initialize game entities
    const game = new Game(canvas, ctx);
    const player = new Player(canvas, ctx);
    initKeyboardControls();
    return { game, player };
}
//# sourceMappingURL=initGame.js.map
