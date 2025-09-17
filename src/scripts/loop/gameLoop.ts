/**
 * gameLoop.ts
 *
 * Main animation loop that updates game state every frame.
 * Delegates tasks to specialized handlers.
 */

import type { GameLoopParams } from '../types/gameLoop.js';
import handlePlayerMovement from './handlePlayerMovement.js';
import updateCoins from './updateCoins.js';
import updateTccEmployee from './updateTccEmployee.js';
import detectPlayerTccEmployeeCollision from './detectPlayerTccEmployeeCollision.js';
import detectPlayerCoinCollision from './detectPlayerCoinCollision.js';

export default function gameLoop(params: GameLoopParams): void {
  const { ctx, game, player, tccEmployee, coins } = params;

  let lastTime: number = performance.now();

  function loop(currentTime: number): void {
    const deltaTime: number = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;

    // Update game here
    game.update(deltaTime);

    // Update TCC Employee' states
    updateTccEmployee(ctx, tccEmployee, deltaTime);

    // Update Coins' states
    updateCoins(ctx, coins, deltaTime);

    // Update player state
    player.update(deltaTime);

    // Handle keyboard input for player movement
    handlePlayerMovement(player);

    // Detect and handle collisions between TCC Employee and player
    detectPlayerTccEmployeeCollision(game, player, tccEmployee);

    // Detect and handle collisions between Coin and Player
    detectPlayerCoinCollision(game, player, coins);

    // End game if player is dead
    if (!game.getIsDead()) {
      requestAnimationFrame(loop);
      return;
    }

    // Stop playing sounds when player is dead
    game.stopBackgroundMusic();
    player.stopMotorcycleSound();
  }

  // Request the next animation frame to keep the loop going
  requestAnimationFrame(loop);
}
