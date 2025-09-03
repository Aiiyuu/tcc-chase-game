/**
 * gameLoop.ts
 *
 * Main animation loop that updates game state every frame.
 * Delegates tasks to specialized handlers.
 */
export default function gameLoop(params) {
    const { game } = params;
    (function () {
        // Update game here
        game.update();
    })();
}
//# sourceMappingURL=gameLoop.js.map
