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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class ImageCache {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cacheNeedsUpdate = true;
        this.images = [];
        this.cacheCanvas = document.createElement('canvas');
        this.cacheCanvas.width = width;
        this.cacheCanvas.height = height;
        this.cacheCtx = this.cacheCanvas.getContext('2d');
    }
    /**
     * Rasterize an SVG image (or any image) into a canvas
     */
    rasterizeSVG(img) {
        return __awaiter(this, void 0, void 0, function* () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!img.complete) {
                yield new Promise((resolve) => (img.onload = resolve));
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            return canvas;
        });
    }
    /**
     * Add images to the cache (either image or canvas)
     */
    addImage(img) {
        this.images.push(img);
    }
    /**
     * Clear the cache canvas
     */
    clearCache() {
        this.cacheCtx.clearRect(0, 0, this.cacheCanvas.width, this.cacheCanvas.height);
    }
    /**
     * Mark cache as dirty to trigger redraw
     */
    markDirty() {
        this.cacheNeedsUpdate = true;
    }
    /**
     * Draw images to cache - override in subclass with actual draw logic
     */
    drawToCache(drawables) {
        this.clearCache();
        for (const item of drawables) {
            this.cacheCtx.drawImage(item.img, item.x, item.y, item.width, item.height);
        }
        this.cacheNeedsUpdate = false;
    }
    /**
     * Draw cached content to target context
     */
    draw(ctx) {
        if (this.cacheNeedsUpdate) {
            throw new Error('Cache needs update: call updateCache(drawables) first');
        }
        ctx.drawImage(this.cacheCanvas, 0, 0);
    }
    /**
     * Update cache with new drawable items
     */
    updateCache(drawables) {
        this.drawToCache(drawables);
    }
}
//# sourceMappingURL=ImageCache.js.map
