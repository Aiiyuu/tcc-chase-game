/**
 * Game.ts
 *
 * Core game logic and state management for the tcc chase game
 * Handles game objects, updating their states, collision detection, and drawing.
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
        this.heartIconIsLoaded = false;
        this.canvas = canvas;
        this.ctx = ctx;
        // Initialize building cache with canvas size
        this.roadCache = new ImageCache(this.canvas.width, this.canvas.height);
        // Initialize road image and cache
        this.roadImg = new Image();
        this.roadImg.src = gameConfig.road;
        this.roadImg.onload = () => {
            this.initRoadCache();
        };
        // Initialize building cache with canvas size
        this.buildingCache = new ImageCache(this.canvas.width, this.canvas.height);
        // Load building images asynchronously
        this.loadBuildingImages(gameConfig.buildings);
        // Initialize tree cache with canvas size
        this.treeCache = new ImageCache(this.canvas.width, this.canvas.height);
        // Load tree images asynchronously
        this.loadTreeImages(gameConfig.trees);
        // Initialize cloud cache with canvas size
        this.cloudCache = new ImageCache(this.canvas.width, this.canvas.height);
        // Load cloud images asynchronously
        this.loadCloudImages(gameConfig.clouds);
        // Load heart icon
        this.heartIcon = new Image();
        this.heartIcon.src = gameConfig.heartIcon;
        this.heartIcon.onload = () => {
            this.heartIconIsLoaded = true;
        };
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
        this.roadCache = new ImageCache(this.canvas.width, this.canvas.height);
        this.roadCache.updateCache(this.roadSegments);
    }
    // Load buildings, rasterize and store in buildingImages array
    loadBuildingImages(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const path of paths) {
                const img = new Image();
                img.src = path;
                yield new Promise((res) => (img.onload = res));
                const rasterized = yield this.buildingCache.rasterizeSVG(img);
                this.buildingImages.push(rasterized);
            }
        });
    }
    // Load trees, rasterize and store in treeImages array
    loadTreeImages(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const path of paths) {
                const img = new Image();
                img.src = path;
                yield new Promise((res) => (img.onload = res));
                const rasterized = yield this.treeCache.rasterizeSVG(img);
                this.treeImages.push(rasterized);
            }
        });
    }
    // Load clouds, rasterize and store in treeImages array
    loadCloudImages(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const path of paths) {
                const img = new Image();
                img.src = path;
                yield new Promise((res) => (img.onload = res));
                const rasterized = yield this.cloudCache.rasterizeSVG(img);
                this.cloudImages.push(rasterized);
            }
        });
    }
    /**
     * Updates the game state
     */
    update() {
        this.updateRoadSegments();
        this.updateBuildingSegments();
        this.updateTreeSegments();
        this.updateCloudSegments();
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
        this.cloudCache.draw(this.ctx);
        // Draw buildings on top of the road
        this.buildingCache.draw(this.ctx);
        // Draw road on top of the buildings
        this.roadCache.draw(this.ctx);
        // Draw trees on top of the road
        this.treeCache.draw(this.ctx);
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
        // Set text styles
        this.ctx.font = gameConfig.healthPointsFont;
        this.ctx.fillStyle = gameConfig.healthPointsTextColor;
        this.ctx.textBaseline = 'middle';
        // Draw the health points count
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
    updateRoadSegments() {
        for (const seg of this.roadSegments) {
            seg.x -= this.gameSpeed;
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
        this.roadCache.updateCache(this.roadSegments);
    }
    /**
     * Moves buildings, removes those that go off-screen, and spawns new ones.
     * @private
     */
    updateBuildingSegments() {
        // Move buildings
        for (const building of this.buildingSegments) {
            building.x -= this.gameSpeed;
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
        this.buildingCache.updateCache(this.buildingSegments);
    }
    /**
     * Moves trees, removes those that go off-screen, and spawns new ones.
     * @private
     */
    updateTreeSegments() {
        // Move trees
        for (const tree of this.treeSegments) {
            tree.x -= this.gameSpeed;
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
        this.treeCache.updateCache(this.treeSegments);
    }
    /**
     * Moves clouds, removes those that go off-screen, and spawns new ones.
     * @private
     */
    updateCloudSegments() {
        // Move clouds
        for (const cloud of this.cloudSegments) {
            cloud.x -= gameConfig.cloudsSpeed;
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
        this.cloudCache.updateCache(this.cloudSegments);
    }
}
//# sourceMappingURL=game.js.map
