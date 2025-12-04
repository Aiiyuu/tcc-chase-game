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
  private targetPosition: Position = { x: -1, y: -1 };
  private rotationState: number = 0;
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

  private audioContext: AudioContext | null = null;
  private hitSoundBuffer: AudioBuffer | null = null;
  private hitSoundLoaded: boolean = false;

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

    // Load sounds
    this.loadHitSound();
  }

  // Loads grave hit sound
  private async loadHitSound(): Promise<void> {
    try {
      this.audioContext = new AudioContext();

      const response: Response = await fetch(tccEmployerConfig.hitSound);
      const arrayBuffer: ArrayBuffer = await response.arrayBuffer();

      this.hitSoundBuffer =
        await this.audioContext.decodeAudioData(arrayBuffer);
      this.hitSoundLoaded = true;
    } catch (error) {
      console.error('Error loading hit sound:', error);
    }
  }

  // Play hit sound
  public playHitSound(): void {
    if (!this.audioContext || !this.hitSoundLoaded || !this.hitSoundBuffer) {
      return;
    }

    const source: AudioBufferSourceNode =
      this.audioContext.createBufferSource();
    source.buffer = this.hitSoundBuffer;

    const gainNode: GainNode = this.audioContext.createGain();
    gainNode.gain.value = tccEmployerConfig.hitSoundLoudness;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start(0);
  }

  /**
   * Smoothly moves from current position to target position
   * @param current Current position
   * @param target Target position
   * @param speed Speed in units per second
   * @param deltaTime Time elapsed since last frame
   */
  private moveTowards(
    current: number,
    target: number,
    speed: number,
    deltaTime: number,
  ): number {
    // Calculate distance to move based on deltaTime and speed (units per second)
    const distance: number = target - current;

    // If we're close enough to the target, we can stop moving
    if (Math.abs(distance) < 1e-3) {
      return target;
    }

    // Calculate how much to move this frame (speed * deltaTime gives us the movement per frame)
    const moveDistance: number =
      Math.sign(distance) * Math.min(Math.abs(distance), speed * deltaTime);

    // Move the current position towards the target
    return current + moveDistance;
  }

  /**
   * Updates the TCC Employer objects' states
   */
  public update(deltaTime: number): void {
    // Move Employers
    if (this.targetPosition.x === -1 && this.targetPosition.y === -1) {
      this.position.x -= this.gameSpeed * deltaTime;
    } else {
      // Rotate grave image smoothly
      this.rotationState =
        (this.rotationState + tccEmployerConfig.rotationSpeed * deltaTime) %
        360;
    }

    // Move Employers along the X-axis (towards targetPosition.x)
    if (this.targetPosition.x !== -1) {
      this.position.x = this.moveTowards(
        this.position.x,
        this.targetPosition.x,
        this.gameSpeed,
        deltaTime,
      );
    }

    // Move Employers along the Y-axis (towards targetPosition.y) only if targetPosition.y is defined
    if (this.targetPosition.y !== -1) {
      this.position.y = this.moveTowards(
        this.position.y,
        this.targetPosition.y,
        this.gameSpeed,
        deltaTime,
      );
    }

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
      const centerX: number =
        this.position.x + this.graveBufferCanvas.width / 2;
      const centerY: number =
        this.position.y - this.graveBufferCanvas.height / 2;

      this.ctx.save();

      this.ctx.translate(centerX, centerY);
      this.ctx.rotate((this.rotationState * Math.PI) / 180);

      this.ctx.drawImage(
        this.graveBufferCanvas,
        -this.graveBufferCanvas.width / 2,
        -this.graveBufferCanvas.height / 2,
      );

      this.ctx.restore();
    }
  }

  /**
   * Return true if the TCC Employer is off the canvas window
   */
  public isOffScreen(): boolean {
    return (
      this.position.x + this.randomEmployer.width <= 0 ||
      (this.position.x === this.targetPosition.x &&
        this.position.y === this.targetPosition.y)
    );
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

  public setTargetPosition(position: Position): void {
    this.targetPosition = position;
  }
}
