/**
 * config.ts
 *
 * Centralized configuration and constants for the game such as canvas size,
 * speeds, colors, and other gameplay settings.
 */
// Get the game window object
const gameWindow = document.getElementById('game');
// Make sure the game window exists
if (!gameWindow) {
    throw new Error("Cannot find element with ID 'game'");
}
const GAME_SPEED = 5;
export const gameConfig = {
    canvasWidth: gameWindow.offsetWidth,
    canvasHeight: gameWindow.offsetHeight,
    canvasBackground: '#F6F1E9',
    healthPoints: 100,
    healthPointsFont: '40px Bangers',
    healthPointsTextColor: '#fff',
    healthPointsTextMargin: 15,
    heartIcon: 'assets/icons/heart.svg',
    heartMargin: {
        x: 60,
        y: 25,
    },
    gameSpeed: GAME_SPEED,
    buildingsGap: [10, 100], // min, max
    buildingsScale: 1,
    buildings: [
        'assets/sprites/background-objects/buildings/house-1.svg',
        'assets/sprites/background-objects/buildings/house-2.svg',
        'assets/sprites/background-objects/buildings/house-3.svg',
        'assets/sprites/background-objects/buildings/house-4.svg',
        'assets/sprites/background-objects/buildings/house-5.svg',
    ],
    treesGap: [150, 450],
    treesScale: 1,
    trees: [
        'assets/sprites/background-objects/trees/tree-1.svg',
        'assets/sprites/background-objects/trees/tree-2.svg',
        'assets/sprites/background-objects/trees/tree-3.svg',
        'assets/sprites/background-objects/trees/tree-4.svg',
    ],
    cloudsGap: [-150, 50],
    cloudsScale: 1,
    cloudsSpeed: GAME_SPEED * 2,
    clouds: [
        'assets/sprites/background-objects/clouds/cloud-1.svg',
        'assets/sprites/background-objects/clouds/cloud-2.svg',
        'assets/sprites/background-objects/clouds/cloud-3.svg',
        'assets/sprites/background-objects/clouds/cloud-4.svg',
        'assets/sprites/background-objects/clouds/cloud-5.svg',
    ],
    road: 'assets/sprites/background-objects/road/road.svg',
};
//# sourceMappingURL=config.js.map
