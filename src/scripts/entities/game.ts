/**
 * Game.ts
 *
 * Core game logic and state management for the tcc chase game
 * Handles game objects, updating their states, collision detection, and drawing.
 */

import type { DrawableImage } from '../types/ImageCache.js';
import type { Position, Size } from '../types/config.js';
import { coinConfig, gameConfig } from '../config.js';

export default class Game {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private gameSpeed: number = gameConfig.gameSpeed;

  private roadImg: HTMLImageElement;
  private roadSegments: DrawableImage[] = [];
  private roadImgOffset: number = 5; // this is used to remove gaps between roads

  private buildingSegments: DrawableImage[] = [];
  private buildingImages: (HTMLCanvasElement | HTMLImageElement)[] = [];
  private buildingsGap: number[] = gameConfig.buildingsGap;

  // this is used to remove gaps between road and buildings
  private buildingsOffset: number = 35;

  private treeSegments: DrawableImage[] = [];
  private treeImages: (HTMLCanvasElement | HTMLImageElement)[] = [];
  private treesGap: number[] = gameConfig.treesGap;

  // this is used to remove gaps between road and trees
  private treeOffset: number = 35;

  private cloudSegments: DrawableImage[] = [];
  private cloudImages: (HTMLCanvasElement | HTMLImageElement)[] = [];
  private cloudsGap: number[] = gameConfig.cloudsGap;

  private healthPoints: number = gameConfig.healthPoints;
  private heartIcon: HTMLImageElement;

  private scores: number = localStorage.getItem('bank')
    ? Number(localStorage.getItem('bank'))
    : 0;
  private scoreIcon: HTMLImageElement;
  private scoresPosition: Position = { x: 0, y: 0 };

  private backgroundMusic: HTMLAudioElement | null = null;
  private backgroundMusicLoudness: number = gameConfig.backgroundMusicLoudness;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;

    // Initialize road image and cache
    this.roadImg = new Image();
    this.roadImg.src = gameConfig.road;
    this.roadImg.onload = (): void => {
      this.initRoadCache();
    };

    // Load building images asynchronously
    this.loadBuildingImages(gameConfig.buildings);

    // Load tree images asynchronously
    this.loadTreeImages(gameConfig.trees);

    // Load cloud images asynchronously
    this.loadCloudImages(gameConfig.clouds);

    // Load heart icon
    this.heartIcon = new Image();
    this.heartIcon.src = gameConfig.heartIcon;

    // Load score icon
    this.scoreIcon = new Image();
    this.scoreIcon.src = coinConfig.coinImg;
    this.scoreIcon.width *= gameConfig.scoresScale;
    this.scoreIcon.height *= gameConfig.scoresScale;

    // Calculate scores position
    this.scoresPosition.x =
      gameConfig.canvasWidth - this.scoreIcon.width - gameConfig.scoreMargin.x;

    this.scoresPosition.y =
      gameConfig.canvasHeight -
      this.scoreIcon.height -
      gameConfig.heartMargin.y;

    // Load background music
    this.backgroundMusic = new Audio(gameConfig.backgroundMusic);
    this.backgroundMusic.volume = this.backgroundMusicLoudness;
    this.backgroundMusic.loop = true;
  }

  /**
   * Rasterizes an SVG image by drawing it onto a canvas and returning the resulting canvas.
   * Waits for the image to load if it's not yet complete.
   *
   * @param img - The SVG image element to rasterize.
   * @returns A Promise that resolves to a canvas element with the rasterized image.
   */
  private async rasterizeSVG(
    img: HTMLImageElement,
  ): Promise<HTMLCanvasElement> {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
    if (!img.complete) {
      await new Promise((resolve) => (img.onload = resolve));
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  // Initialize road cache and road segments for scrolling
  private initRoadCache(): void {
    const roadWidth: number = this.roadImg.width;
    const roadHeight: number = this.roadImg.height;
    const yPos: number = gameConfig.canvasHeight - roadHeight + 3;

    const count: number = Math.ceil(this.canvas.width / roadWidth) + 1;

    this.roadSegments = [];

    for (let i: number = 0; i < count; i++) {
      this.roadSegments.push({
        img: this.roadImg,
        x: i * (roadWidth - this.roadImgOffset),
        y: yPos,
        width: roadWidth,
        height: roadHeight,
      });
    }
  }

  // Load buildings, rasterize and store in buildingImages array
  private async loadBuildingImages(paths: string[]): Promise<void> {
    for (const path of paths) {
      const img = new Image();
      img.src = path;

      await new Promise((res) => (img.onload = res));
      const rasterized: HTMLCanvasElement = await this.rasterizeSVG(img);

      this.buildingImages.push(rasterized);
    }
  }

  // Load trees, rasterize and store in treeImages array
  private async loadTreeImages(paths: string[]): Promise<void> {
    for (const path of paths) {
      const img = new Image();
      img.src = path;

      await new Promise((res) => (img.onload = res));
      const rasterized: HTMLCanvasElement = await this.rasterizeSVG(img);
      this.treeImages.push(rasterized);
    }
  }

  // Load clouds, rasterize and store in treeImages array
  private async loadCloudImages(paths: string[]): Promise<void> {
    for (const path of paths) {
      const img = new Image();
      img.src = path;

      await new Promise((res) => (img.onload = res));
      const rasterized: HTMLCanvasElement = await this.rasterizeSVG(img);
      this.cloudImages.push(rasterized);
    }
  }

  /**
   * Updates the game state
   */
  public update(deltaTime: number): void {
    this.updateRoadSegments(deltaTime);
    this.updateBuildingSegments(deltaTime);
    this.updateTreeSegments(deltaTime);
    this.updateCloudSegments(deltaTime);

    this.draw();
  }

  /**
   * Draw elements on the screen
   */
  private draw(): void {
    // Fill the canvas with the configured background color
    this.ctx.fillStyle = gameConfig.canvasBackground;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw clouds first (background)
    for (const seg of this.cloudSegments) {
      this.ctx.drawImage(
        seg.img,
        Math.round(seg.x),
        Math.round(seg.y),
        Math.round(seg.width),
        Math.round(seg.height),
      );
    }

    // Draw buildings
    for (const seg of this.buildingSegments) {
      this.ctx.drawImage(
        seg.img,
        Math.round(seg.x),
        Math.round(seg.y),
        Math.round(seg.width),
        Math.round(seg.height),
      );
    }

    // Draw road
    for (const seg of this.roadSegments) {
      this.ctx.drawImage(
        seg.img,
        Math.round(seg.x),
        Math.round(seg.y),
        Math.round(seg.width),
        Math.round(seg.height),
      );
    }

    // Draw trees
    for (const seg of this.treeSegments) {
      this.ctx.drawImage(
        seg.img,
        Math.round(seg.x),
        Math.round(seg.y),
        Math.round(seg.width),
        Math.round(seg.height),
      );
    }

    // Draw health
    this.drawHealth();

    // Draw scores
    this.drawScores();

    // Draw instruction
    this.drawInstruction();

    // Draw game over
    if (this.getIsDead()) {
      this.drawGameOver();
      return;
    }
  }

  /**
   * Draw heart icons and health points
   */
  private drawHealth(): void {
    const x: number = 0 + gameConfig.heartMargin.x;
    const y: number =
      gameConfig.canvasHeight -
      this.heartIcon.height -
      gameConfig.heartMargin.y;

    this.ctx.drawImage(
      this.heartIcon,
      x,
      y,
      this.heartIcon.width,
      this.heartIcon.height,
    );

    // Reset text align
    this.ctx.textAlign = 'left';

    const heartCenterY: number = y + this.heartIcon.height / 2;
    const textX: number =
      x + this.heartIcon.width + gameConfig.healthPointsTextMargin;

    this.ctx.font = gameConfig.healthPointsFont;
    this.ctx.fillStyle = gameConfig.healthPointsTextColor;
    this.ctx.textBaseline = 'middle';

    this.ctx.fillText(this.healthPoints.toString(), textX, heartCenterY);
  }

  /**
   * Draw score icon and scores
   */
  private drawScores(): void {
    const x: number = this.scoresPosition.x;
    const y: number = this.scoresPosition.y;

    this.ctx.drawImage(
      this.scoreIcon,
      x,
      y,
      this.scoreIcon.width,
      this.scoreIcon.height,
    );

    const scoresCenterY: number = y + this.scoreIcon.height / 2;

    this.ctx.font = gameConfig.scoresFont;
    this.ctx.fillStyle = gameConfig.scoresTextColor;
    this.ctx.textBaseline = 'middle';

    const scoreText: string = this.scores.toString();
    const textWidth: number = this.ctx.measureText(scoreText).width;

    const textX: number = x - gameConfig.scoresTextMargin - textWidth;

    this.ctx.fillText(scoreText, textX, scoresCenterY);
  }

  /**
   * Draw instruction on the middle-bottom
   */
  private drawInstruction(): void {
    this.ctx.font = gameConfig.instructionFont;
    this.ctx.fillStyle = gameConfig.instructionTextColor;
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';

    const instructionText: string = 'Press Space to jump';
    const font: string = gameConfig.instructionFont;
    const textHeight: number = font ? parseInt(font.split(' ')[0]!, 10) : 0;
    const textY: number =
      gameConfig.canvasHeight - textHeight - gameConfig.instructionMarginY;

    this.ctx.fillText(instructionText, gameConfig.canvasWidth / 2, textY);
  }

  /**
   * Draw game over message
   */
  private drawGameOver(): void {
    // Draw 'Game Over' text
    this.ctx.font = gameConfig.gameOverFont;
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';

    const gameOverText = 'Game Over';
    const fontSize: number = parseInt(gameConfig.gameOverFont, 10) || 16;
    const gameOverY: number = gameConfig.canvasHeight / 2 - fontSize;
    const gameOverBorderThickness: number = 16;

    // Set stroke (border) style
    this.ctx.lineWidth = gameOverBorderThickness;
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeText(gameOverText, gameConfig.canvasWidth / 2, gameOverY);
    this.ctx.fillStyle = gameConfig.gameOverTextColor;
    this.ctx.fillText(gameOverText, gameConfig.canvasWidth / 2, gameOverY);

    // Draw description text with border
    this.ctx.font = gameConfig.gameOverDescriptionFont;
    this.ctx.fillStyle = gameConfig.gameOverDescriptionTextColor;

    const text = `I'm too lazy to create a restart button,\nso please refresh the webpage`;
    const lines: string[] = text.split('\n');

    const descFontSize: number =
      parseInt(gameConfig.gameOverDescriptionFont, 10) || 16;
    const lineHeight: number = descFontSize * 1;
    const startY: number = gameConfig.canvasHeight / 2;
    const gameOverDescBorderThickness: number = 12;

    lines.forEach((line: string, i: number): void => {
      // Set stroke (border) style
      this.ctx.lineWidth = gameOverDescBorderThickness;
      this.ctx.strokeStyle = 'black';
      this.ctx.strokeText(
        line,
        gameConfig.canvasWidth / 2,
        startY + i * lineHeight,
      );
      this.ctx.fillStyle = gameConfig.gameOverDescriptionTextColor;
      this.ctx.fillText(
        line,
        gameConfig.canvasWidth / 2,
        startY + i * lineHeight,
      );
    });
  }

  /**
   * Initializes the road segments that make up the scrolling road.
   *
   * - Positions the road at the bottom of the canvas.
   * - Calculates how many road segments are needed to fully cover the canvas width,
   *   plus one extra for seamless scrolling.
   * - Creates and stores each road segment with its initial x-position,
   *   width, and height based on the loaded road image.
   */
  private updateRoadSegments(deltaTime: number): void {
    for (const seg of this.roadSegments) {
      seg.x -= this.gameSpeed * deltaTime;
    }

    // Recycle road segments
    const first: DrawableImage | undefined = this.roadSegments[0];
    if (first && first.x + first.width < 0) {
      this.roadSegments.shift();
      const last: DrawableImage | undefined =
        this.roadSegments[this.roadSegments.length - 1];

      if (last) {
        this.roadSegments.push({
          img: this.roadImg,
          x: last.x + last.width - this.roadImgOffset,
          y: first.y,
          width: first.width,
          height: first.height,
        });
      }
    }
  }

  /**
   * Moves buildings, removes those that go off-screen, and spawns new ones.
   * @private
   */
  private updateBuildingSegments(deltaTime: number): void {
    // Move buildings
    for (const building of this.buildingSegments) {
      building.x -= this.gameSpeed * deltaTime;
    }

    // Remove buildings off screen
    while (
      this.buildingSegments.length > 0 &&
      this.buildingSegments[0]!.x + this.buildingSegments[0]!.width < 0
    ) {
      this.buildingSegments.shift();
    }

    // Spawn new buildings if needed to fill screen width
    let lastX: number =
      this.buildingSegments.length > 0
        ? this.buildingSegments[this.buildingSegments.length - 1]!.x +
          this.buildingSegments[this.buildingSegments.length - 1]!.width
        : 0;

    const [gapMin, gapMax] = this.buildingsGap;

    while (lastX < this.canvas.width) {
      const randomGap: number = gapMin! + Math.random() * (gapMax! - gapMin!);
      const img =
        this.buildingImages[
          Math.floor(Math.random() * this.buildingImages.length)
        ];

      if (!img) continue;

      const x: number = lastX + randomGap;

      // Scale width and height
      const scaledWidth: number = img.width * gameConfig.buildingsScale;
      const scaledHeight: number = img.height * gameConfig.buildingsScale;

      const y: number =
        gameConfig.canvasHeight -
        this.roadImg.height -
        scaledHeight +
        this.buildingsOffset;

      this.buildingSegments.push({
        img,
        x,
        y,
        width: scaledWidth,
        height: scaledHeight,
      });

      lastX = x + scaledWidth;
    }
  }

  /**
   * Moves trees, removes those that go off-screen, and spawns new ones.
   * @private
   */
  private updateTreeSegments(deltaTime: number): void {
    // Move trees
    for (const tree of this.treeSegments) {
      tree.x -= this.gameSpeed * deltaTime;
    }

    // Remove trees off screen
    while (
      this.treeSegments.length > 0 &&
      this.treeSegments[0]!.x + this.treeSegments[0]!.width < 0
    ) {
      this.treeSegments.shift();
    }

    // Spawn new trees if needed to fill screen width
    let lastX: number =
      this.treeSegments.length > 0
        ? this.treeSegments[this.treeSegments.length - 1]!.x +
          this.treeSegments[this.treeSegments.length - 1]!.width
        : 0;

    const [gapMin, gapMax] = this.treesGap;

    while (lastX < this.canvas.width) {
      const randomGap: number = gapMin! + Math.random() * (gapMax! - gapMin!);
      const img =
        this.treeImages[Math.floor(Math.random() * this.treeImages.length)];

      if (!img) continue;

      const x: number = lastX + randomGap;

      // Scale width and height
      const scaledWidth: number = img.width * gameConfig.treesScale;
      const scaledHeight: number = img.height * gameConfig.treesScale;

      // Adjust y position based on scaled height
      const y: number =
        gameConfig.canvasHeight -
        this.roadImg.height -
        scaledHeight +
        this.treeOffset;

      this.treeSegments.push({
        img,
        x,
        y,
        width: scaledWidth,
        height: scaledHeight,
      });

      lastX = x + scaledWidth;
    }
  }

  /**
   * Moves clouds, removes those that go off-screen, and spawns new ones.
   * @private
   */
  private updateCloudSegments(deltaTime: number): void {
    // Move clouds
    for (const cloud of this.cloudSegments) {
      cloud.x -= gameConfig.cloudsSpeed * deltaTime;
    }

    // Remove clouds off screen
    while (
      this.cloudSegments.length > 0 &&
      this.cloudSegments[0]!.x + this.cloudSegments[0]!.width < 0
    ) {
      this.cloudSegments.shift();
    }

    const [gapMin, gapMax] = this.cloudsGap;

    // Spawn new trees if needed to fill screen width
    let lastX: number =
      this.cloudSegments.length > 0
        ? this.cloudSegments[this.cloudSegments.length - 1]!.x +
          this.cloudSegments[this.cloudSegments.length - 1]!.width +
          gapMax!
        : 0;

    while (lastX < this.canvas.width) {
      const randomGap: number = gapMin! + Math.random() * (gapMax! - gapMin!);
      const img =
        this.cloudImages[Math.floor(Math.random() * this.cloudImages.length)];

      if (!img) continue;

      const x: number = lastX + randomGap;

      // Scale width and height
      const scaledWidth: number = img.width * gameConfig.cloudsScale;
      const scaledHeight: number = img.height * gameConfig.cloudsScale;

      // Adjust y position based on scaled height
      const y: number = Math.floor(
        Math.random() * (this.canvas.height / 2 - scaledHeight),
      );

      this.cloudSegments.push({
        img,
        x,
        y,
        width: scaledWidth,
        height: scaledHeight,
      });

      lastX = x + scaledWidth;
    }
  }

  public subtractHealthPoints(damageTaken: number): void {
    if (this.healthPoints - damageTaken <= 0) {
      this.healthPoints = 0;

      return;
    }

    this.healthPoints -= damageTaken;
  }

  public updateScores(score: number): void {
    this.scores += score;
  }

  public getScoresPosition(): Position {
    return {
      x: this.scoresPosition.x + this.scoreIcon.width / 2,
      y: this.scoresPosition.y + this.scoreIcon.height / 2,
    };
  }

  public getScoresSize(): Size {
    return {
      width: this.scoreIcon.width,
      height: this.scoreIcon.height,
    };
  }

  // Starts background music
  public startBackgroundMusic(): void {
    if (this.backgroundMusic && this.backgroundMusic.paused) {
      this.backgroundMusic.play().catch((err): void => {
        console.warn('Background music failed to play:', err);
      });
    }
  }

  // Stops background music
  public stopBackgroundMusic(): void {
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  // Updates bank
  updateScoresStorage(): void {
    localStorage.setItem('bank', `${this.scores}`);
  }

  getIsDead(): boolean {
    return this.healthPoints <= 0;
  }
}
