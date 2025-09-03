/**
 * gameLoop.ts
 *
 * Main animation loop that updates game state every frame.
 * Delegates tasks to specialized handlers.
 */
export default function gameLoop(params) {
    const { game } = params;
    function loop() {
        // Update game here
        game.update();
        // Request the next animation frame to keep the loop going
        requestAnimationFrame(loop);
    }
    loop();
}
//# sourceMappingURL=gameLoop.js.map
