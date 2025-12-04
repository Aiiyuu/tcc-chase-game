/**
 * player.ts
 *
 * Player logic and state management for the tcc chase game
 * Handles a player object, updating its states, collision detection, and drawing.
 */

import ImageCache from '../utils/ImageCache.js';
import { gameConfig, motorcycles, playerConfig } from '../config.js';
import type { Motorcycle } from '../types/config.js';

interface WindowWithWebkitAudioContext extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export default class Player {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private gameSpeed: number = gameConfig.gameSpeed;

  private selectedMotorcycle: number = 0;
  private motorcycle: Motorcycle;

  private motorcycleImage!: HTMLCanvasElement;
  private wheelImage!: HTMLCanvasElement;
  private imageCache: ImageCache;
  private wheelRotation: number = 0;

  private motorcycleX: number;
  private motorcycleY: number;
  private wheelX: number[];
  private wheelY: number[];

  // Jumping physics
  private isJumping: boolean = false;
  private jumpVelocity: number = 0;
  private gravity: number = playerConfig.gravity;
  private initialMotorcycleY: number;
  private initialWheelY: number;
  private jumpHeight: number = playerConfig.jumpHeight;

  private motorcycleAudio: HTMLAudioElement | null = null;
  private motorcycleSoundLoudness: number =
    playerConfig.motorcycleSoundLoudness;

  private audioContext: AudioContext | null = null;
  private jumpBuffer: AudioBuffer | null = null;

  private soundEffectBuffers: AudioBuffer[] = [];

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.imageCache = new ImageCache(canvas.width, canvas.height);

    // Pick motorcycle
    this.selectedMotorcycle = localStorage.getItem('selected-motorcycle')
      ? Number(localStorage.getItem('selected-motorcycle'))
      : 0;

    this.motorcycle = motorcycles[this.selectedMotorcycle]!;
    this.motorcycleX = this.motorcycle.motorcyclePosition.x;
    this.motorcycleY = this.motorcycle.motorcyclePosition.y;
    this.wheelX = this.motorcycle.wheelsPosition.x;
    this.wheelY = this.motorcycle.wheelsPosition.y;
    this.initialMotorcycleY = this.motorcycle.motorcyclePosition.y;
    this.initialWheelY = this.motorcycle.wheelsPosition.y[0]!;

    this.loadImages();

    // Load motorcycle sound
    this.motorcycleAudio = new Audio(playerConfig.motorcycleSound);
    this.motorcycleAudio.volume = this.motorcycleSoundLoudness;
    this.motorcycleAudio.loop = true;

    // Load player sounds
    this.loadJumpSound();
    this.loadAllSoundEffects();
  }

  // Loads motorcycle and wheels images
  private async loadImages(): Promise<void> {
    const motorcycleImg = new Image();
    const wheelImg = new Image();

    motorcycleImg.src = this.motorcycle.motorcycleImg;
    wheelImg.src = this.motorcycle.wheelImg;

    await Promise.all([
      new Promise((res) => (motorcycleImg.onload = res)),
      new Promise((res) => (wheelImg.onload = res)),
    ]);

    this.motorcycleImage = await this.imageCache.rasterizeSVG(motorcycleImg);
    this.wheelImage = await this.imageCache.rasterizeSVG(wheelImg);
  }

  // Load sound effects
  private async loadAllSoundEffects(): Promise<void> {
    try {
      const win = window as WindowWithWebkitAudioContext;
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext ||
          win.webkitAudioContext)();
      }

      const bufferPromises = playerConfig.soundEffects.map(
        async (url: string) => {
          const response: Response = await fetch(url);
          const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
          return await this.audioContext!.decodeAudioData(arrayBuffer);
        },
      );

      this.soundEffectBuffers = await Promise.all(bufferPromises);
    } catch (error) {
      console.error('Failed to load sound effects:', error);
    }
  }

  /**
   * Updates the player state
   */
  public update(deltaTime: number): void {
    // Rotate wheels
    this.wheelRotation += this.gameSpeed * deltaTime * 0.05;

    if (this.isJumping) {
      // Apply movement
      this.motorcycleY += this.jumpVelocity * deltaTime;

      for (let i: number = 0; i < this.wheelY.length; i++) {
        this.wheelY[i]! += this.jumpVelocity * deltaTime;
      }

      // Apply gravity
      this.jumpVelocity += this.gravity * deltaTime;

      // Landed
      if (this.motorcycleY >= this.initialMotorcycleY) {
        this.motorcycleY = this.initialMotorcycleY;

        for (let i: number = 0; i < this.wheelY.length; i++) {
          this.wheelY[i]! = this.initialWheelY;
        }

        this.isJumping = false;
        this.jumpVelocity = 0;
      }
    }

    this.draw();
  }

  /**
   * Draw elements on the screen
   */
  private draw(): void {
    this.drawMotorcycle();
  }

  // Draw motorcycle object
  private drawMotorcycle(): void {
    const scale: number = playerConfig.imgScale;

    const motorcycleWidth: number = this.motorcycleImage.width * scale;
    const motorcycleHeight: number = this.motorcycleImage.height * scale;

    const wheelWidth: number = this.wheelImage.width * scale;
    const wheelHeight: number = this.wheelImage.height * scale;

    // Draw both wheels using configured offsets
    for (let i: number = 0; i < this.wheelX.length; i++) {
      const x: number = this.wheelX[i]!;
      const y: number = this.wheelY[i]!;

      this.ctx.save();

      // Translate to center of the wheel
      this.ctx.translate(x + wheelWidth / 2, y + wheelHeight / 2);

      // Rotate based on the wheelRotation
      this.ctx.rotate(-this.wheelRotation);

      // Draw the wheel image centered
      this.ctx.drawImage(
        this.wheelImage,
        -wheelWidth / 2,
        -wheelHeight / 2,
        wheelWidth,
        wheelHeight,
      );

      this.ctx.restore();
    }

    // Draw motorcycle body
    this.ctx.drawImage(
      this.motorcycleImage,
      this.motorcycleX,
      this.motorcycleY,
      motorcycleWidth,
      motorcycleHeight,
    );
  }

  // Moves the player object up for a while
  public jump(): void {
    if (!this.isJumping) {
      this.isJumping = true;
      this.jumpVelocity = -1 * this.jumpHeight;
      this.playJumpSound();
    }
  }

  // Starts motorcycle sound
  public startMotorcycleSound(): void {
    if (this.motorcycleAudio && this.motorcycleAudio.paused) {
      this.motorcycleAudio.play().catch((err): void => {
        console.warn('Motorcycle sound failed to play:', err);
      });
    }
  }

  // Stops motorcycle sound
  public stopMotorcycleSound(): void {
    if (this.motorcycleAudio && !this.motorcycleAudio.paused) {
      this.motorcycleAudio.pause();
      this.motorcycleAudio.currentTime = 0;
    }
  }

  // Load jump sound
  private async loadJumpSound(): Promise<void> {
    try {
      const win = window as WindowWithWebkitAudioContext;

      this.audioContext = new (window.AudioContext || win.webkitAudioContext)();

      const response: Response = await fetch(playerConfig.jumpSound);
      const arrayBuffer: ArrayBuffer = await response.arrayBuffer();

      this.jumpBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error('Failed to load jump sound:', error);
    }
  }

  // Play jump sound
  private playJumpSound(): void {
    if (!this.audioContext || !this.jumpBuffer) return;

    const source: AudioBufferSourceNode =
      this.audioContext.createBufferSource();
    source.buffer = this.jumpBuffer;

    const gainNode: GainNode = this.audioContext.createGain();
    gainNode.gain.value = playerConfig.jumpSoundLoudness;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start(0);
  }

  /**
   * Play random sound effect when player is hit
   */
  public playRandomSound(): void {
    // Exit if audio context isn't ready or no sound buffers loaded
    if (!this.audioContext || this.soundEffectBuffers.length === 0) return;

    // Pick a random buffer from the loaded sound effects
    const index: number = Math.floor(
      Math.random() * this.soundEffectBuffers.length,
    );
    const buffer: AudioBuffer = this.soundEffectBuffers[index]!;

    // Create a buffer source and assign the selected sound
    const source: AudioBufferSourceNode =
      this.audioContext.createBufferSource();
    source.buffer = buffer;

    // Create a gain node to control volume
    const gainNode: GainNode = this.audioContext.createGain();
    gainNode.gain.value = playerConfig.soundEffectLoudness;

    // Connect nodes: source → gain → output
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Play the sound
    source.start(0);
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.motorcycleX, y: this.motorcycleY };
  }

  public getMotorcycleSize(): { width: number; height: number } {
    return {
      width: this.motorcycleImage.width * playerConfig.imgScale,
      height: this.motorcycleImage.height * playerConfig.imgScale,
    };
  }
}
