/**
 * game.ts
 *
 * Core game logic and state management for the tcc chase game
 * Handles game objects, updating their states, collision detection, and drawing.
 */
export default class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }
    /**
     * Updates the game state
     *
     * @param playerVelocity - The velocity of the player character (x, y) affecting the background.
     */
    update() {
        this.draw();
    }
    /**
     * Draw elements on the screen
     */
    draw() {
        this.ctx.fillRect(0, 0, 50, 50);
    }
}
//# sourceMappingURL=game.js.map
