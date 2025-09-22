/**
 * coin.ts
 *
 * Coin logic and state management for the tcc chase game
 * Handles Coin objects, updating their states, collision detection, and drawing.
 */
import { gameConfig, coinConfig } from '../config.js';
import ImageCache from '../utils/ImageCache.js';
export default class Coin {
    constructor(ctx, position) {
        this.gameSpeed = gameConfig.gameSpeed;
        this.coinImageLoaded = false;
        this.audioContext = null;
        this.coinSoundBuffer = null;
        this.coinSoundLoaded = false;
        this.isTaken = false;
        this.isReadyToBeDestroyed = false;
        this.coinScale = coinConfig.scale;
        this.targetPosition = { x: 0, y: 0 };
        this.targetSize = { width: 0, height: 0 };
        this.ctx = ctx;
        this.position = position;
        this.imageCache = new ImageCache(gameConfig.canvasWidth, gameConfig.canvasWidth);
        this.loadImages();
        this.loadCoinSound();
    }
    // Loads coin images
    async loadImages() {
        const coinImg = new Image();
        coinImg.src = coinConfig.coinImg;
        await Promise.all([new Promise((res) => (coinImg.onload = res))]);
        this.coinImage = await this.imageCache.rasterizeSVG(coinImg);
        this.coinImageLoaded = true;
    }
    // Load coin sound
    async loadCoinSound() {
        try {
            this.audioContext = new AudioContext();
            const response = await fetch(coinConfig.coinSound);
            const arrayBuffer = await response.arrayBuffer();
            this.coinSoundBuffer =
                await this.audioContext.decodeAudioData(arrayBuffer);
            this.coinSoundLoaded = true;
        }
        catch (error) {
            console.error('Error loading coin sound:', error);
        }
    }
    // Play coin sound
    playCoinSound() {
        if (!this.audioContext || !this.coinSoundLoaded || !this.coinSoundBuffer) {
            return;
        }
        const source = this.audioContext.createBufferSource();
        source.buffer = this.coinSoundBuffer;
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = coinConfig.coinSoundLoudness;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        source.start(0);
    }
    /**
     * Updates the coin state
     */
    update(deltaTime) {
        if (!this.coinImageLoaded)
            return;
        function lerp(start, end, t) {
            return start + (end - start) * t;
        }
        // Move coins
        if (!this.isTaken) {
            this.position.x -= this.gameSpeed * deltaTime;
        }
        else {
            // Check if the coin is ready to be destroyed
            if (Math.round(this.position.x) === Math.round(this.targetPosition.x) &&
                Math.round(this.position.y) === Math.round(this.targetPosition.y)) {
                this.isReadyToBeDestroyed = true;
                return;
            }
            // Smoothly move to target position
            const smoothing = 0.1;
            this.position.x = lerp(this.position.x, this.targetPosition.x, smoothing);
            this.position.y = lerp(this.position.y, this.targetPosition.y, smoothing);
            // Smoothly resize image
            const targetScaleX = this.targetSize.width / this.coinImage.width;
            const targetScaleY = this.targetSize.height / this.coinImage.height;
            this.coinScale = lerp(this.coinScale, (targetScaleX + targetScaleY) / 2, smoothing);
        }
        this.draw();
    }
    /**
     * Draw elements on the screen
     */
    draw() {
        this.drawCoin();
    }
    /**
     * Draws coin objects on the screen
     * @private
     */
    drawCoin() {
        if (!this.coinImage)
            return;
        const width = this.coinImage.width * this.coinScale;
        const height = this.coinImage.height * this.coinScale;
        const x = this.position.x - width / 2;
        const y = this.position.y - height / 2;
        this.ctx.drawImage(this.coinImage, x, y, width, height);
    }
    /**
     * Return true if the Coin is off the canvas window
     */
    isOffScreen() {
        if (!this.coinImage)
            return false;
        return this.position.x + this.coinImage.width < 0;
    }
    getPosition() {
        return { x: this.position.x, y: this.position.y };
    }
    getCoinSize() {
        if (!this.coinImageLoaded) {
            return { width: 50, height: 50 };
        }
        return {
            width: this.coinImage.width * coinConfig.scale,
            height: this.coinImage.height * coinConfig.scale,
        };
    }
    setTarget(position, size) {
        this.targetPosition = position;
        this.targetSize = size;
    }
}
//# sourceMappingURL=coin.js.map
