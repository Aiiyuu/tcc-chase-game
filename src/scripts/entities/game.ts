/**
 * game.ts
 *
 * Core game logic and state management for the tcc chase game
 * Handles game objects, updating their states, collision detection, and drawing.
 */

export default class Game {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  /**
   * Updates the game state
   *
   * @param playerVelocity - The velocity of the player character (x, y) affecting the background.
   */
  public update(): void {
    this.draw();
  }

  /**
   * Draw elements on the screen
   */
  public draw(): void {
    this.ctx.fillRect(0, 0, 50, 50);
  }
}
