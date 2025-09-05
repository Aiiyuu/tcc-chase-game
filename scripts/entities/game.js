/**
 * Game.ts
 *
 * Core game logic and state management for the tcc chase game
 * Handles game objects, updating their states, collision detection, and drawing.
 */
import { gameConfig } from '../config.js';
export default class Game {
    constructor(canvas, ctx) {
        this.gameSpeed = gameConfig.gameSpeed;
        this.roadSegments = [];
        this.roadImgOffset = 5; // this is used to remove gaps between roads
        this.buildingSegments = [];
        this.buildingImages = [];
        this.buildingsGap = gameConfig.buildingsGap;
        // this is used to remove gaps between road and buildings
        this.buildingsOffset = 35;
        this.treeSegments = [];
        this.treeImages = [];
        this.treesGap = gameConfig.treesGap;
        // this is used to remove gaps between road and trees
        this.treeOffset = 35;
        this.cloudSegments = [];
        this.cloudImages = [];
        this.cloudsGap = gameConfig.cloudsGap;
        this.healthPoints = gameConfig.healthPoints;
        this.backgroundMusic = null;
        this.backgroundMusicLoudness = gameConfig.backgroundMusicLoudness;
        this.canvas = canvas;
        this.ctx = ctx;
        // Initialize road image and cache
        this.roadImg = new Image();
        this.roadImg.src = gameConfig.road;
        this.roadImg.onload = () => {
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
    async rasterizeSVG(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!img.complete) {
            await new Promise((resolve) => (img.onload = resolve));
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return canvas;
    }
    // Initialize road cache and road segments for scrolling
    initRoadCache() {
        const roadWidth = this.roadImg.width;
        const roadHeight = this.roadImg.height;
        const yPos = gameConfig.canvasHeight - roadHeight + 3;
        const count = Math.ceil(this.canvas.width / roadWidth) + 1;
        this.roadSegments = [];
        for (let i = 0; i < count; i++) {
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
    async loadBuildingImages(paths) {
        for (const path of paths) {
            const img = new Image();
            img.src = path;
            await new Promise((res) => (img.onload = res));
            const rasterized = await this.rasterizeSVG(img);
            this.buildingImages.push(rasterized);
        }
    }
    // Load trees, rasterize and store in treeImages array
    async loadTreeImages(paths) {
        for (const path of paths) {
            const img = new Image();
            img.src = path;
            await new Promise((res) => (img.onload = res));
            const rasterized = await this.rasterizeSVG(img);
            this.treeImages.push(rasterized);
        }
    }
    // Load clouds, rasterize and store in treeImages array
    async loadCloudImages(paths) {
        for (const path of paths) {
            const img = new Image();
            img.src = path;
            await new Promise((res) => (img.onload = res));
            const rasterized = await this.rasterizeSVG(img);
            this.cloudImages.push(rasterized);
        }
    }
    /**
     * Updates the game state
     */
    update(deltaTime) {
        this.updateRoadSegments(deltaTime);
        this.updateBuildingSegments(deltaTime);
        this.updateTreeSegments(deltaTime);
        this.updateCloudSegments(deltaTime);
        this.draw();
    }
    /**
     * Draw elements on the screen
     */
    draw() {
        // Fill the canvas with the configured background color
        this.ctx.fillStyle = gameConfig.canvasBackground;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw clouds first (background)
        for (const seg of this.cloudSegments) {
            this.ctx.drawImage(seg.img, Math.round(seg.x), Math.round(seg.y), Math.round(seg.width), Math.round(seg.height));
        }
        // Draw buildings
        for (const seg of this.buildingSegments) {
            this.ctx.drawImage(seg.img, Math.round(seg.x), Math.round(seg.y), Math.round(seg.width), Math.round(seg.height));
        }
        // Draw road
        for (const seg of this.roadSegments) {
            this.ctx.drawImage(seg.img, Math.round(seg.x), Math.round(seg.y), Math.round(seg.width), Math.round(seg.height));
        }
        // Draw trees
        for (const seg of this.treeSegments) {
            this.ctx.drawImage(seg.img, Math.round(seg.x), Math.round(seg.y), Math.round(seg.width), Math.round(seg.height));
        }
        // Draw health
        this.drawHealth();
    }
    /**
     * Draw heart icons and health points
     */
    drawHealth() {
        const x = 0 + gameConfig.heartMargin.x;
        const y = gameConfig.canvasHeight -
            this.heartIcon.height -
            gameConfig.heartMargin.y;
        this.ctx.drawImage(this.heartIcon, x, y, this.heartIcon.width, this.heartIcon.height);
        const heartCenterY = y + this.heartIcon.height / 2;
        const textX = x + this.heartIcon.width + gameConfig.healthPointsTextMargin;
        this.ctx.font = gameConfig.healthPointsFont;
        this.ctx.fillStyle = gameConfig.healthPointsTextColor;
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.healthPoints.toString(), textX, heartCenterY);
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
    updateRoadSegments(deltaTime) {
        for (const seg of this.roadSegments) {
            seg.x -= this.gameSpeed * deltaTime;
        }
        // Recycle road segments
        const first = this.roadSegments[0];
        if (first && first.x + first.width < 0) {
            this.roadSegments.shift();
            const last = this.roadSegments[this.roadSegments.length - 1];
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
    updateBuildingSegments(deltaTime) {
        // Move buildings
        for (const building of this.buildingSegments) {
            building.x -= this.gameSpeed * deltaTime;
        }
        // Remove buildings off screen
        while (this.buildingSegments.length > 0 &&
            this.buildingSegments[0].x + this.buildingSegments[0].width < 0) {
            this.buildingSegments.shift();
        }
        // Spawn new buildings if needed to fill screen width
        let lastX = this.buildingSegments.length > 0
            ? this.buildingSegments[this.buildingSegments.length - 1].x +
                this.buildingSegments[this.buildingSegments.length - 1].width
            : 0;
        const [gapMin, gapMax] = this.buildingsGap;
        while (lastX < this.canvas.width) {
            const randomGap = gapMin + Math.random() * (gapMax - gapMin);
            const img = this.buildingImages[Math.floor(Math.random() * this.buildingImages.length)];
            if (!img)
                continue;
            const x = lastX + randomGap;
            // Scale width and height
            const scaledWidth = img.width * gameConfig.buildingsScale;
            const scaledHeight = img.height * gameConfig.buildingsScale;
            const y = gameConfig.canvasHeight -
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
    updateTreeSegments(deltaTime) {
        // Move trees
        for (const tree of this.treeSegments) {
            tree.x -= this.gameSpeed * deltaTime;
        }
        // Remove trees off screen
        while (this.treeSegments.length > 0 &&
            this.treeSegments[0].x + this.treeSegments[0].width < 0) {
            this.treeSegments.shift();
        }
        // Spawn new trees if needed to fill screen width
        let lastX = this.treeSegments.length > 0
            ? this.treeSegments[this.treeSegments.length - 1].x +
                this.treeSegments[this.treeSegments.length - 1].width
            : 0;
        const [gapMin, gapMax] = this.treesGap;
        while (lastX < this.canvas.width) {
            const randomGap = gapMin + Math.random() * (gapMax - gapMin);
            const img = this.treeImages[Math.floor(Math.random() * this.treeImages.length)];
            if (!img)
                continue;
            const x = lastX + randomGap;
            // Scale width and height
            const scaledWidth = img.width * gameConfig.treesScale;
            const scaledHeight = img.height * gameConfig.treesScale;
            // Adjust y position based on scaled height
            const y = gameConfig.canvasHeight -
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
    updateCloudSegments(deltaTime) {
        // Move clouds
        for (const cloud of this.cloudSegments) {
            cloud.x -= gameConfig.cloudsSpeed * deltaTime;
        }
        // Remove clouds off screen
        while (this.cloudSegments.length > 0 &&
            this.cloudSegments[0].x + this.cloudSegments[0].width < 0) {
            this.cloudSegments.shift();
        }
        const [gapMin, gapMax] = this.cloudsGap;
        // Spawn new trees if needed to fill screen width
        let lastX = this.cloudSegments.length > 0
            ? this.cloudSegments[this.cloudSegments.length - 1].x +
                this.cloudSegments[this.cloudSegments.length - 1].width +
                gapMax
            : 0;
        while (lastX < this.canvas.width) {
            const randomGap = gapMin + Math.random() * (gapMax - gapMin);
            const img = this.cloudImages[Math.floor(Math.random() * this.cloudImages.length)];
            if (!img)
                continue;
            const x = lastX + randomGap;
            // Scale width and height
            const scaledWidth = img.width * gameConfig.cloudsScale;
            const scaledHeight = img.height * gameConfig.cloudsScale;
            // Adjust y position based on scaled height
            const y = Math.floor(Math.random() * (this.canvas.height / 2 - scaledHeight));
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
    subtractHealthPoints(damageTaken) {
        if (this.healthPoints - damageTaken <= 0) {
            this.healthPoints = 0;
            return;
        }
        this.healthPoints -= damageTaken;
    }
    // Starts background music
    startBackgroundMusic() {
        if (this.backgroundMusic && this.backgroundMusic.paused) {
            this.backgroundMusic.play().catch((err) => {
                console.warn('Background music failed to play:', err);
            });
        }
    }
    // Stops background music
    stopBackgroundMusic() {
        if (this.backgroundMusic && !this.backgroundMusic.paused) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }
    getIsDead() {
        return this.healthPoints <= 0;
    }
}
//# sourceMappingURL=game.js.map
