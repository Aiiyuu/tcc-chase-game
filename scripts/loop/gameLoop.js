/**
 * gameLoop.ts
 *
 * Main animation loop that updates game state every frame.
 * Delegates tasks to specialized handlers.
 */
import handlePlayerMovement from './handlePlayerMovement.js';
import updateTccEmployee from './updateTccEmployee.js';
import detectPlayerTccEmployeeCollision from './detectPlayerTccEmployeeCollision.js';
export default function gameLoop(params) {
    const { ctx, game, player, tccEmployee } = params;
    let lastTime = performance.now();
    function loop(currentTime) {
        const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
        lastTime = currentTime;
        // Update game here
        game.update(deltaTime);
        // Update TCC Employee' states
        updateTccEmployee(ctx, tccEmployee, deltaTime);
        // Update player state
        player.update(deltaTime);
        // Handle keyboard input for player movement
        handlePlayerMovement(player);
        // Detect and handle collisions between TCC Employee and player
        detectPlayerTccEmployeeCollision(game, player, tccEmployee);
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
//# sourceMappingURL=gameLoop.js.map
