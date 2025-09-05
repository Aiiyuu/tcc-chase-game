/**
 * player.ts
 *
 * Player logic and state management for the tcc chase game
 * Handles a player object, updating its states, collision detection, and drawing.
 */
import ImageCache from '../utils/ImageCache.js';
import { gameConfig, playerConfig } from '../config.js';
export default class Player {
    constructor(canvas, ctx) {
        this.gameSpeed = gameConfig.gameSpeed;
        this.wheelRotation = 0;
        this.motorcycleX = playerConfig.motorcyclePosition.x;
        this.motorcycleY = playerConfig.motorcyclePosition.y;
        this.wheelX = playerConfig.wheelsPosition.x;
        this.wheelY = playerConfig.wheelsPosition.y;
        // Jumping physics
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.gravity = playerConfig.gravity;
        this.initialMotorcycleY = playerConfig.motorcyclePosition.y;
        this.initialWheelY = playerConfig.wheelsPosition.y[0];
        this.jumpHeight = playerConfig.jumpHeight;
        this.motorcycleAudio = null;
        this.motorcycleSoundLoudness = playerConfig.motorcycleSoundLoudness;
        this.audioContext = null;
        this.jumpBuffer = null;
        this.soundEffectBuffers = [];
        this.canvas = canvas;
        this.ctx = ctx;
        this.imageCache = new ImageCache(canvas.width, canvas.height);
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
    async loadImages() {
        const motorcycleImg = new Image();
        const wheelImg = new Image();
        motorcycleImg.src = playerConfig.motorcycleImg;
        wheelImg.src = playerConfig.wheelImg;
        await Promise.all([
            new Promise((res) => (motorcycleImg.onload = res)),
            new Promise((res) => (wheelImg.onload = res)),
        ]);
        this.motorcycleImage = await this.imageCache.rasterizeSVG(motorcycleImg);
        this.wheelImage = await this.imageCache.rasterizeSVG(wheelImg);
    }
    // Load sound effects
    async loadAllSoundEffects() {
        try {
            const win = window;
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext ||
                    win.webkitAudioContext)();
            }
            const bufferPromises = playerConfig.soundEffects.map(async (url) => {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                return await this.audioContext.decodeAudioData(arrayBuffer);
            });
            this.soundEffectBuffers = await Promise.all(bufferPromises);
        }
        catch (error) {
            console.error('Failed to load sound effects:', error);
        }
    }
    /**
     * Updates the player state
     */
    update(deltaTime) {
        // Rotate wheels
        this.wheelRotation += this.gameSpeed * deltaTime * 0.05;
        if (this.isJumping) {
            // Apply movement
            this.motorcycleY += this.jumpVelocity * deltaTime;
            for (let i = 0; i < this.wheelY.length; i++) {
                this.wheelY[i] += this.jumpVelocity * deltaTime;
            }
            // Apply gravity
            this.jumpVelocity += this.gravity * deltaTime;
            // Landed
            if (this.motorcycleY >= this.initialMotorcycleY) {
                this.motorcycleY = this.initialMotorcycleY;
                for (let i = 0; i < this.wheelY.length; i++) {
                    this.wheelY[i] = this.initialWheelY;
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
    draw() {
        this.drawMotorcycle();
    }
    // Draw motorcycle object
    drawMotorcycle() {
        const scale = playerConfig.imgScale;
        const motorcycleWidth = this.motorcycleImage.width * scale;
        const motorcycleHeight = this.motorcycleImage.height * scale;
        const wheelWidth = this.wheelImage.width * scale;
        const wheelHeight = this.wheelImage.height * scale;
        // Draw both wheels using configured offsets
        for (let i = 0; i < this.wheelX.length; i++) {
            const x = this.wheelX[i];
            const y = this.wheelY[i];
            this.ctx.save();
            // Translate to center of the wheel
            this.ctx.translate(x + wheelWidth / 2, y + wheelHeight / 2);
            // Rotate based on the wheelRotation
            this.ctx.rotate(-this.wheelRotation);
            // Draw the wheel image centered
            this.ctx.drawImage(this.wheelImage, -wheelWidth / 2, -wheelHeight / 2, wheelWidth, wheelHeight);
            this.ctx.restore();
        }
        // Draw motorcycle body
        this.ctx.drawImage(this.motorcycleImage, this.motorcycleX, this.motorcycleY, motorcycleWidth, motorcycleHeight);
    }
    // Moves the player object up for a while
    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpVelocity = -1 * this.jumpHeight;
            this.playJumpSound();
        }
    }
    // Starts motorcycle sound
    startMotorcycleSound() {
        if (this.motorcycleAudio && this.motorcycleAudio.paused) {
            this.motorcycleAudio.play().catch((err) => {
                console.warn('Motorcycle sound failed to play:', err);
            });
        }
    }
    // Stops motorcycle sound
    stopMotorcycleSound() {
        if (this.motorcycleAudio && !this.motorcycleAudio.paused) {
            this.motorcycleAudio.pause();
            this.motorcycleAudio.currentTime = 0;
        }
    }
    // Load jump sound
    async loadJumpSound() {
        try {
            const win = window;
            this.audioContext = new (window.AudioContext || win.webkitAudioContext)();
            const response = await fetch(playerConfig.jumpSound);
            const arrayBuffer = await response.arrayBuffer();
            this.jumpBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        }
        catch (error) {
            console.error('Failed to load jump sound:', error);
        }
    }
    // Play jump sound
    playJumpSound() {
        if (!this.audioContext || !this.jumpBuffer)
            return;
        const source = this.audioContext.createBufferSource();
        source.buffer = this.jumpBuffer;
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = playerConfig.jumpSoundLoudness;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        source.start(0);
    }
    /**
     * Play random sound effect when player is hit
     */
    playRandomSound() {
        // Exit if audio context isn't ready or no sound buffers loaded
        if (!this.audioContext || this.soundEffectBuffers.length === 0)
            return;
        // Pick a random buffer from the loaded sound effects
        const index = Math.floor(Math.random() * this.soundEffectBuffers.length);
        const buffer = this.soundEffectBuffers[index];
        // Create a buffer source and assign the selected sound
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        // Create a gain node to control volume
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = playerConfig.soundEffectLoudness;
        // Connect nodes: source → gain → output
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        // Play the sound
        source.start(0);
    }
    getPosition() {
        return { x: this.motorcycleX, y: this.motorcycleY };
    }
    getMotorcycleSize() {
        return {
            width: this.motorcycleImage.width * playerConfig.imgScale,
            height: this.motorcycleImage.height * playerConfig.imgScale,
        };
    }
}
//# sourceMappingURL=player.js.map
