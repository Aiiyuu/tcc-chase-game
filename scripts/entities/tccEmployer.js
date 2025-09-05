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
        this.isDead = false;
        this.randomEmployer = new Image();
        this.randomGrave = new Image();
        this.randomImageIndex = Math.floor(Math.random() * tccEmployerConfig.tccEmployerImages.length);
        this.randomTccEmployerSrc = tccEmployerConfig.tccEmployerImages[this.randomImageIndex];
        this.randomGraveSrc = tccEmployerConfig.graveImages[this.randomImageIndex];
        this.ctx = ctx;
        this.position = position;
        // Create off-screen buffer canvas
        this.employerBufferCanvas = document.createElement('canvas');
        this.bufferCtx = this.employerBufferCanvas.getContext('2d');
        // Load tcc employer random image
        this.randomEmployer.onload = () => {
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
        this.graveCtx = this.graveBufferCanvas.getContext('2d');
        this.randomGrave.onload = () => {
            this.graveBufferCanvas.width = this.randomGrave.width;
            this.graveBufferCanvas.height = this.randomGrave.height;
            this.graveCtx.drawImage(this.randomGrave, 0, 0);
        };
        this.randomGrave.src = this.randomGraveSrc;
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
        if (!this.isDead) {
            this.drawEmployer();
            return;
        }
        this.drawGrave();
    }
    /**
     * Draw TCC Employer on the screen
     */
    drawEmployer() {
        if (this.randomEmployer.complete) {
            // Draw the buffer (off-screen canvas) to the main canvas
            this.ctx.drawImage(this.employerBufferCanvas, this.position.x, this.position.y - this.employerBufferCanvas.height);
        }
    }
    /**
     * Draw grave object on the screen
     */
    drawGrave() {
        if (this.randomGrave.complete) {
            this.ctx.drawImage(this.graveBufferCanvas, this.position.x, this.position.y - this.graveBufferCanvas.height);
        }
    }
    /**
     * Return true if the TCC Employer is off the canvas window
     */
    isOffScreen() {
        return this.position.x + this.randomEmployer.width < 0;
    }
    getPosition() {
        return this.position;
    }
    getSize() {
        return {
            width: this.employerBufferCanvas.width,
            height: this.employerBufferCanvas.height,
        };
    }
    getIsDead() {
        return this.isDead;
    }
    setIsDead() {
        this.isDead = true;
    }
}
//# sourceMappingURL=tccEmployer.js.map
