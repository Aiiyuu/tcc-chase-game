/**
 * player.ts
 *
 * Player logic and state management for the tcc chase game
 * Handles a player object, updating its states, collision detection, and drawing.
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
        this.canvas = canvas;
        this.ctx = ctx;
        this.imageCache = new ImageCache(canvas.width, canvas.height);
        this.loadImages();
        // Load motorcycle sound
        this.motorcycleAudio = new Audio(playerConfig.motorcycleSound);
        this.motorcycleAudio.volume = this.motorcycleSoundLoudness;
        this.motorcycleAudio.loop = true;
        // Load jump sound
        this.loadJumpSound();
    }
    // Loads motorcycle and wheels images
    loadImages() {
        return __awaiter(this, void 0, void 0, function* () {
            const motorcycleImg = new Image();
            const wheelImg = new Image();
            motorcycleImg.src = playerConfig.motorcycleImg;
            wheelImg.src = playerConfig.wheelImg;
            yield Promise.all([
                new Promise((res) => (motorcycleImg.onload = res)),
                new Promise((res) => (wheelImg.onload = res)),
            ]);
            this.motorcycleImage = yield this.imageCache.rasterizeSVG(motorcycleImg);
            this.wheelImage = yield this.imageCache.rasterizeSVG(wheelImg);
        });
    }
    /**
     * Updates the player state
     */
    update() {
        // Rotate based on speed — tweak factor if rotation is too fast or slow
        this.wheelRotation += this.gameSpeed * 0.05;
        if (this.isJumping) {
            this.motorcycleY += this.jumpVelocity;
            for (let i = 0; i < this.wheelY.length; i++) {
                this.wheelY[i] += this.jumpVelocity;
            }
            this.jumpVelocity += this.gravity;
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
            this.ctx.rotate(this.wheelRotation);
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
    loadJumpSound() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const win = window;
                this.audioContext = new (window.AudioContext || win.webkitAudioContext)();
                const response = yield fetch(playerConfig.jumpSound);
                const arrayBuffer = yield response.arrayBuffer();
                this.jumpBuffer = yield this.audioContext.decodeAudioData(arrayBuffer);
            }
            catch (error) {
                console.error('Failed to load jump sound:', error);
            }
        });
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
}
//# sourceMappingURL=player.js.map
