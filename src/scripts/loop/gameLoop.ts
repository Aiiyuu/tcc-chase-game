/**
 * gameLoop.ts
 *
 * Main animation loop that updates game state every frame.
 * Delegates tasks to specialized handlers.
 */

import type { GameLoopParams } from '../types/gameLoop.js';
import handlePlayerMovement from './handlePlayerMovement.js';

export default function gameLoop(params: GameLoopParams): void {
  const { game, player } = params;

  function loop(): void {
    // Update game here
    game.update();

    // Update player state
    player.update();

    // Handle keyboard input for player movement
    handlePlayerMovement(player);

    // Request the next animation frame to keep the loop going
    requestAnimationFrame(loop);
  }

  loop();
}
