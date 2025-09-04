/**
 * tccEmployer.ts
 *
 * TCC Employer logic and state management for the tcc chase game
 * Handles TCC Employer objects, updating their states, collision detection, and drawing.
 */
// import ImageCache from '../utils/ImageCache.js';
import { gameConfig, tccEmployerConfig } from '../config.js';
export default class TccEmployer {
    constructor(ctx, position) {
        this.gameSpeed = gameConfig.gameSpeed;
        this.randomImage = new Image();
        this.randomImageSrc = tccEmployerConfig.tccEmployerImages[Math.floor(Math.random() * tccEmployerConfig.tccEmployerImages.length)];
        this.ctx = ctx;
        this.position = position;
        // Create off-screen buffer canvas
        this.bufferCanvas = document.createElement('canvas');
        this.bufferCtx = this.bufferCanvas.getContext('2d');
        // Load random image
        this.randomImage.src = this.randomImageSrc;
        this.randomImage.onload = () => {
            // Set buffer canvas size based on image dimensions
            this.bufferCanvas.width = this.randomImage.width;
            this.bufferCanvas.height = this.randomImage.height;
            // Draw the image to the buffer
            this.bufferCtx.drawImage(this.randomImage, 0, 0);
            this.draw(); // Call draw after image is loaded
        };
    }
    /**
     * Updates the TCC Employer objects' states
     */
    update() {
        // Move Employers
        this.position.x -= this.gameSpeed;
        this.draw();
    }
    /**
     * Draw elements on the screen
     */
    draw() {
        if (this.randomImage.complete) {
            // Draw the buffer (off-screen canvas) to the main canvas
            this.ctx.drawImage(this.bufferCanvas, this.position.x, this.position.y - this.bufferCanvas.height);
        }
    }
    /**
     * Return true if the TCC Employer is off the canvas window
     */
    isOffScreen() {
        return this.position.x + this.randomImage.width < 0;
    }
    getPosition() {
        return this.position;
    }
}
//# sourceMappingURL=tccEmployer.js.map
