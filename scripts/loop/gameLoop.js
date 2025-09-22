/**
 * gameLoop.ts
 *
 * Main animation loop that updates game state every frame.
 * Delegates tasks to specialized handlers.
 */
import handlePlayerMovement from './handlePlayerMovement.js';
import updateCoins from './updateCoins.js';
import updateTccEmployee from './updateTccEmployee.js';
import detectPlayerTccEmployeeCollision from './detectPlayerTccEmployeeCollision.js';
import detectPlayerCoinCollision from './detectPlayerCoinCollision.js';
export default function gameLoop(params) {
    const { ctx, game, player, tccEmployee, coins } = params;
    let lastTime = performance.now();
    function loop(currentTime) {
        const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
        lastTime = currentTime;
        // End game if player is dead
        if (game.getIsDead()) {
            // Update game state (print game over)
            game.update(deltaTime);
            // Stop playing sounds when player is dead
            game.stopBackgroundMusic();
            player.stopMotorcycleSound();
            return;
        }
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
        requestAnimationFrame(loop);
    }
    // Request the next animation frame to keep the loop going
    requestAnimationFrame(loop);
}
//# sourceMappingURL=gameLoop.js.map
