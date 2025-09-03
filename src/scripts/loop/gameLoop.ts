/**
 * gameLoop.ts
 *
 * Main animation loop that updates game state every frame.
 * Delegates tasks to specialized handlers.
 */

import type { GameLoopParams } from '../types/gameLoop.js';

export default function gameLoop(params: GameLoopParams): void {
  const { game } = params;

  function loop(): void {
    // Update game here
    game.update();

    // Request the next animation frame to keep the loop going
    requestAnimationFrame(loop);
  }

  loop();
}
