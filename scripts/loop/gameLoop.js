/**
 * gameLoop.ts
 *
 * Main animation loop that updates game state every frame.
 * Delegates tasks to specialized handlers.
 */
import handlePlayerMovement from './handlePlayerMovement.js';
import updateTccEmployee from './updateTccEmployee.js';
export default function gameLoop(params) {
    const { ctx, game, player, tccEmployee } = params;
    function loop() {
        // Update game here
        game.update();
        // Update player state
        player.update();
        // Update TCC Employee' states
        updateTccEmployee(ctx, tccEmployee);
        // Handle keyboard input for player movement
        handlePlayerMovement(player);
        // Request the next animation frame to keep the loop going
        requestAnimationFrame(loop);
    }
    loop();
}
//# sourceMappingURL=gameLoop.js.map
