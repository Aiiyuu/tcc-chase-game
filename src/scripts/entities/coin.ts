/**
 * coin.ts
 *
 * Coin logic and state management for the tcc chase game
 * Handles Coin objects, updating their states, collision detection, and drawing.
 */

import { gameConfig, coinConfig } from '../config.js';
import ImageCache from '../utils/ImageCache.js';
import type { Position, Size } from '../types/config.js';

export default class Coin {
  private ctx: CanvasRenderingContext2D;
  private position: Position;
  private gameSpeed: number = gameConfig.gameSpeed;

  private coinImage!: HTMLCanvasElement;
  private imageCache!: ImageCache;
  private coinImageLoaded: boolean = false;

  private audioContext: AudioContext | null = null;
  private coinSoundBuffer: AudioBuffer | null = null;
  private coinSoundLoaded: boolean = false;

  public isTaken: boolean = false;
  public isReadyToBeDestroyed: boolean = false;
  private coinScale: number = coinConfig.scale;
  private targetPosition: Position = { x: 0, y: 0 };
  private targetSize: Size = { width: 0, height: 0 };

  constructor(ctx: CanvasRenderingContext2D, position: Position) {
    this.ctx = ctx;
    this.position = position;

    this.imageCache = new ImageCache(
      gameConfig.canvasWidth,
      gameConfig.canvasWidth,
    );

    this.loadImages();
    this.loadCoinSound();
  }

  // Loads coin images
  private async loadImages(): Promise<void> {
    const coinImg = new Image();

    coinImg.src = coinConfig.coinImg;

    await Promise.all([new Promise((res) => (coinImg.onload = res))]);

    this.coinImage = await this.imageCache.rasterizeSVG(coinImg);
    this.coinImageLoaded = true;
  }

  // Load coin sound
  private async loadCoinSound(): Promise<void> {
    try {
      this.audioContext = new AudioContext();

      const response: Response = await fetch(coinConfig.coinSound);
      const arrayBuffer: ArrayBuffer = await response.arrayBuffer();

      this.coinSoundBuffer =
        await this.audioContext.decodeAudioData(arrayBuffer);
      this.coinSoundLoaded = true;
    } catch (error) {
      console.error('Error loading coin sound:', error);
    }
  }

  // Play coin sound
  public playCoinSound(): void {
    if (!this.audioContext || !this.coinSoundLoaded || !this.coinSoundBuffer) {
      return;
    }

    const source: AudioBufferSourceNode =
      this.audioContext.createBufferSource();
    source.buffer = this.coinSoundBuffer;

    const gainNode: GainNode = this.audioContext.createGain();
    gainNode.gain.value = coinConfig.coinSoundLoudness;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start(0);
  }

  /**
   * Updates the coin state
   */
  update(deltaTime: number): void {
    if (!this.coinImageLoaded) return;

    function lerp(start: number, end: number, t: number): number {
      return start + (end - start) * t;
    }

    // Move coins
    if (!this.isTaken) {
      this.position.x -= this.gameSpeed * deltaTime;
    } else {
      // Check if the coin is ready to be destroyed
      if (
        Math.round(this.position.x) === Math.round(this.targetPosition.x) &&
        Math.round(this.position.y) === Math.round(this.targetPosition.y)
      ) {
        this.isReadyToBeDestroyed = true;
        return;
      }

      // Smoothly move to target position
      const smoothing = 0.1;

      this.position.x = lerp(this.position.x, this.targetPosition.x, smoothing);
      this.position.y = lerp(this.position.y, this.targetPosition.y, smoothing);

      // Smoothly resize image
      const targetScaleX: number = this.targetSize.width / this.coinImage.width;
      const targetScaleY: number =
        this.targetSize.height / this.coinImage.height;

      this.coinScale = lerp(
        this.coinScale,
        (targetScaleX + targetScaleY) / 2,
        smoothing,
      );
    }

    this.draw();
  }

  /**
   * Draw elements on the screen
   */
  private draw(): void {
    this.drawCoin();
  }

  /**
   * Draws coin objects on the screen
   * @private
   */
  private drawCoin(): void {
    if (!this.coinImage) return;

    const width: number = this.coinImage.width * this.coinScale;
    const height: number = this.coinImage.height * this.coinScale;

    const x: number = this.position.x - width / 2;
    const y: number = this.position.y - height / 2;

    this.ctx.drawImage(this.coinImage, x, y, width, height);
  }

  /**
   * Return true if the Coin is off the canvas window
   */
  public isOffScreen(): boolean {
    if (!this.coinImage) return false;
    return this.position.x + this.coinImage.width < 0;
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.position.x, y: this.position.y };
  }

  public getCoinSize(): { width: number; height: number } {
    if (!this.coinImageLoaded) {
      return { width: 50, height: 50 };
    }

    return {
      width: this.coinImage.width * coinConfig.scale,
      height: this.coinImage.height * coinConfig.scale,
    };
  }

  public setTarget(position: Position, size: Size): void {
    this.targetPosition = position;
    this.targetSize = size;
  }
}
