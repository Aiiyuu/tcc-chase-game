/**
 * gameLoop.ts
 *
 * Main animation loop that updates game state every frame.
 * Delegates tasks to specialized handlers.
 */

import type { GameLoopParams } from '../types/gameLoop.js';
import handlePlayerMovement from './handlePlayerMovement.js';
import updateTccEmployee from './updateTccEmployee.js';
import detectPlayerTccEmployeeCollision from './detectPlayerTccEmployeeCollision.js';

export default function gameLoop(params: GameLoopParams): void {
  const { ctx, game, player, tccEmployee } = params;

  function loop(): void {
    // Update game here
    game.update();

    // Update player state
    player.update();

    // Update TCC Employee' states
    updateTccEmployee(ctx, tccEmployee);

    // Handle keyboard input for player movement
    handlePlayerMovement(player);

    // Detect and handle collisions between TCC Employee and player
    detectPlayerTccEmployeeCollision(game, player, tccEmployee);

    // End game if player is dead
    if (!game.getIsDead()) {
      // Request the next animation frame to keep the loop going
      requestAnimationFrame(loop);
      return;
    }

    player.stopMotorcycleSound();
  }

  loop();
}
