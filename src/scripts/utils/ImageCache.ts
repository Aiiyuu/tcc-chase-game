/**
 * ImageCache.ts
 *
 * A utility base class to optimize rendering of images (including SVGs) by rasterizing them
 * into an offscreen canvas cache. This helps improve performance by reducing repetitive
 * rendering overhead for complex images.
 *
 * This class provides methods for:
 * - Rasterizing SVG or any images into canvas elements.
 * - Managing an offscreen cache canvas where all images are drawn once.
 * - Drawing the cached image efficiently onto a target canvas.
 * - Marking the cache as dirty and updating it with new image data.
 *
 * The class is designed to be extended for specific use cases, such as handling
 * building sprites, road segments, or any other visual elements in a game.
 */

import type { DrawableImage } from '../types/ImageCache.js';

export default class ImageCache {
  protected cacheCanvas: HTMLCanvasElement;
  protected cacheCtx: CanvasRenderingContext2D;
  protected cacheNeedsUpdate: boolean = true;
  protected images: (HTMLImageElement | HTMLCanvasElement)[] = [];

  constructor(
    protected width: number,
    protected height: number,
  ) {
    this.cacheCanvas = document.createElement('canvas');
    this.cacheCanvas.width = width;
    this.cacheCanvas.height = height;
    this.cacheCtx = this.cacheCanvas.getContext('2d')!;
  }

  /**
   * Rasterize an SVG image (or any image) into a canvas
   */
  async rasterizeSVG(img: HTMLImageElement): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    if (!img.complete) {
      await new Promise((resolve) => (img.onload = resolve));
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  /**
   * Add images to the cache (either image or canvas)
   */
  addImage(img: HTMLImageElement | HTMLCanvasElement): void {
    this.images.push(img);
  }

  /**
   * Clear the cache canvas
   */
  clearCache(): void {
    this.cacheCtx.clearRect(
      0,
      0,
      this.cacheCanvas.width,
      this.cacheCanvas.height,
    );
  }

  /**
   * Mark cache as dirty to trigger redraw
   */
  markDirty(): void {
    this.cacheNeedsUpdate = true;
  }

  /**
   * Draw images to cache - override in subclass with actual draw logic
   */
  protected drawToCache(drawables: DrawableImage[]): void {
    this.clearCache();

    for (const item of drawables) {
      this.cacheCtx.drawImage(
        item.img,
        item.x,
        item.y,
        item.width,
        item.height,
      );
    }

    this.cacheNeedsUpdate = false;
  }

  /**
   * Draw cached content to target context
   */
  draw(ctx: CanvasRenderingContext2D): void {
    if (this.cacheNeedsUpdate) {
      throw new Error('Cache needs update: call updateCache(drawables) first');
    }
    ctx.drawImage(this.cacheCanvas, 0, 0);
  }

  /**
   * Update cache with new drawable items
   */
  updateCache(drawables: DrawableImage[]): void {
    this.drawToCache(drawables);
  }
}
