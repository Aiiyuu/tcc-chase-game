/**
 * config.ts
 *
 * Centralized configuration and constants for the game such as canvas size,
 * speeds, colors, and other gameplay settings.
 */

import type {
  GameConfig,
  PlayerConfig,
  TccEmployerConfig,
} from './types/config.js';

// Get the game window object
const gameWindow = document.getElementById('game') as HTMLCanvasElement;

// Make sure the game window exists
if (!gameWindow) {
  throw new Error("Cannot find element with ID 'game'");
}

const GAME_SPEED: number = 10;
const MOTORCYCLE_COORDINATES = {
  x: 80,
  y: gameWindow.offsetHeight - 370,
};

export const gameConfig: GameConfig = {
  canvasWidth: gameWindow.offsetWidth,
  canvasHeight: gameWindow.offsetHeight,
  canvasBackground: '#F6F1E9',

  healthPoints: 100,
  damage: 10,
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

export const playerConfig: PlayerConfig = {
  motorcyclePosition: MOTORCYCLE_COORDINATES,
  wheelsPosition: {
    x: [MOTORCYCLE_COORDINATES.x + 25.42, MOTORCYCLE_COORDINATES.x + 237.73],
    y: [MOTORCYCLE_COORDINATES.y + 145.56, MOTORCYCLE_COORDINATES.y + 145.56],
  },

  imgScale: 1,
  motorcycleImg: 'assets/sprites/player/motorcycle.svg',
  wheelImg: 'assets/sprites/player/wheel.svg',

  motorcycleSound: 'assets/sounds/player/motorcycle.mp3',
  motorcycleSoundLoudness: 0.3,

  jumpHeight: 12,
  gravity: 0.15,
  jumpSound: 'assets/sounds/player/jump.mp3',
  jumpSoundLoudness: 0.1,

  soundEffects: [
    'assets/sounds/player/sound-effect-1.mp3',
    'assets/sounds/player/sound-effect-2.mp3',
    'assets/sounds/player/sound-effect-3.mp3',
    'assets/sounds/player/sound-effect-4.mp3',
    'assets/sounds/player/sound-effect-5.mp3',
    'assets/sounds/player/sound-effect-6.mp3',
    'assets/sounds/player/sound-effect-7.mp3',
    'assets/sounds/player/sound-effect-8.mp3',
    'assets/sounds/player/sound-effect-9.mp3',
    'assets/sounds/player/sound-effect-10.mp3',
  ],
  soundEffectLoudness: 1,
};

export const tccEmployerConfig: TccEmployerConfig = {
  gap: [gameConfig.canvasWidth * 0.8, gameConfig.canvasWidth * 1.5],
  initialPosition: {
    x: gameConfig.canvasWidth,
    y: gameConfig.canvasHeight - 130.2,
  },
  tccEmployerImages: [
    'assets/sprites/obstacles/tcc-1.svg',
    'assets/sprites/obstacles/tcc-2.svg',
    'assets/sprites/obstacles/tcc-3.svg',
    'assets/sprites/obstacles/tcc-4.svg',
  ],
  graveImages: [
    'assets/sprites/obstacles/grave-1.svg',
    'assets/sprites/obstacles/grave-2.svg',
    'assets/sprites/obstacles/grave-3.svg',
    'assets/sprites/obstacles/grave-4.svg',
  ],
};
