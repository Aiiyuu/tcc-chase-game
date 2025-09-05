/**
 * tccEmployer.ts
 *
 * TCC Employer logic and state management for the tcc chase game
 * Handles TCC Employer objects, updating their states, collision detection, and drawing.
 */

// import ImageCache from '../utils/ImageCache.js';
import { gameConfig, tccEmployerConfig } from '../config.js';
import type { Position } from '../types/config.js';

export default class TccEmployer {
  private ctx: CanvasRenderingContext2D;

  private position: Position;
  private gameSpeed: number = gameConfig.gameSpeed;
  private isDead: boolean = false;

  private randomEmployer: HTMLImageElement = new Image();
  private randomGrave: HTMLImageElement = new Image();

  private randomImageIndex: number = Math.floor(
    Math.random() * tccEmployerConfig.tccEmployerImages.length,
  );

  private randomTccEmployerSrc: string =
    tccEmployerConfig.tccEmployerImages[this.randomImageIndex]!;
  private randomGraveSrc: string =
    tccEmployerConfig.graveImages[this.randomImageIndex]!;

  // Off-screen buffer canvas for optimized rendering
  private employerBufferCanvas: HTMLCanvasElement;
  private graveBufferCanvas: HTMLCanvasElement;
  private bufferCtx: CanvasRenderingContext2D;
  private graveCtx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D, position: Position) {
    this.ctx = ctx;
    this.position = position;

    // Create off-screen buffer canvas
    this.employerBufferCanvas = document.createElement('canvas');
    this.bufferCtx = this.employerBufferCanvas.getContext('2d')!;

    // Load tcc employer random image
    this.randomEmployer.onload = (): void => {
      // Set buffer canvas size based on image dimensions
      this.employerBufferCanvas.width = this.randomEmployer.width;
      this.employerBufferCanvas.height = this.randomEmployer.height;

      // Draw the image to the buffer
      this.bufferCtx.drawImage(this.randomEmployer, 0, 0);

      this.draw(); // Call draw after image is loaded
    };
    this.randomEmployer.src = this.randomTccEmployerSrc;

    // Create grave buffer canvas
    this.graveBufferCanvas = document.createElement('canvas');
    this.graveCtx = this.graveBufferCanvas.getContext('2d')!;

    this.randomGrave.onload = (): void => {
      this.graveBufferCanvas.width = this.randomGrave.width;
      this.graveBufferCanvas.height = this.randomGrave.height;

      this.graveCtx.drawImage(this.randomGrave, 0, 0);
    };
    this.randomGrave.src = this.randomGraveSrc;
  }

  /**
   * Updates the TCC Employer objects' states
   */
  public update(deltaTime: number): void {
    // Move Employers
    this.position.x -= this.gameSpeed * deltaTime;

    this.draw();
  }

  /**
   * Draw elements on the screen
   */
  private draw(): void {
    if (!this.isDead) {
      this.drawEmployer();
      return;
    }

    this.drawGrave();
  }

  /**
   * Draw TCC Employer on the screen
   */
  public drawEmployer(): void {
    if (this.randomEmployer.complete) {
      // Draw the buffer (off-screen canvas) to the main canvas
      this.ctx.drawImage(
        this.employerBufferCanvas,
        this.position.x,
        this.position.y - this.employerBufferCanvas.height,
      );
    }
  }

  /**
   * Draw grave object on the screen
   */
  public drawGrave(): void {
    if (this.randomGrave.complete) {
      this.ctx.drawImage(
        this.graveBufferCanvas,
        this.position.x,
        this.position.y - this.graveBufferCanvas.height,
      );
    }
  }

  /**
   * Return true if the TCC Employer is off the canvas window
   */
  public isOffScreen(): boolean {
    return this.position.x + this.randomEmployer.width < 0;
  }

  public getPosition(): Position {
    return this.position;
  }

  public getSize(): { width: number; height: number } {
    return {
      width: this.employerBufferCanvas.width,
      height: this.employerBufferCanvas.height,
    };
  }

  public getIsDead(): boolean {
    return this.isDead;
  }

  public setIsDead(): void {
    this.isDead = true;
  }
}
