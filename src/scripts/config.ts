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
  CoinConfig,
  Motorcycle,
} from './types/config.js';

// Get the game window object
const gameWindow = document.getElementById('game') as HTMLCanvasElement;

// Make sure the game window exists
if (!gameWindow) {
  throw new Error("Cannot find element with ID 'game'");
}

const GAME_SPEED: number = 1000; // pixels per seconds

export const USED_KEYS: string[] = ['space'];

export const gameConfig: GameConfig = {
  canvasWidth: gameWindow.offsetWidth,
  canvasHeight: gameWindow.offsetHeight,
  canvasBackground: '#F6F1E9',

  backgroundMusic: 'assets/sounds/background-music.mp3',
  backgroundMusicLoudness: 0.3,

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

  scoresFont: '40px Bangers',
  scoresTextColor: '#fff',
  scoresTextMargin: 15,
  scoresScale: 0.7,
  scoreMargin: {
    x: 60,
    y: 25,
  },

  gameOverFont: '62px Bangers',
  gameOverTextColor: '#E6A034',
  gameOverDescriptionFont: '36px Bangers',
  gameOverDescriptionTextColor: '#E6A034',

  instructionFont: '40px Bangers',
  instructionTextColor: '#fff',
  instructionMarginY: 18,

  gameSpeed: GAME_SPEED,

  buildingsGap: [40, 150], // min, max
  buildingsScale: 1,
  buildings: [
    'assets/sprites/background-objects/buildings/house-1.png',
    'assets/sprites/background-objects/buildings/house-2.png',
    'assets/sprites/background-objects/buildings/house-3.png',
    'assets/sprites/background-objects/buildings/house-4.png',
    'assets/sprites/background-objects/buildings/house-5.png',
    'assets/sprites/background-objects/buildings/house-6.png',
    'assets/sprites/background-objects/buildings/house-7.png',
  ],

  treesGap: [200, 500],
  treesScale: 1,
  trees: [
    'assets/sprites/background-objects/trees/tree-1.png',
    'assets/sprites/background-objects/trees/tree-2.png',
    'assets/sprites/background-objects/trees/tree-3.png',
    'assets/sprites/background-objects/trees/tree-4.png',
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

  road: 'assets/sprites/background-objects/road/road.png',
};

export const motorcycles: Motorcycle[] = [
  {
    motorcyclePosition: { x: 80, y: gameWindow.offsetHeight - 390 },
    wheelsPosition: {
      x: [80 + 25.42, 80 + 237.73],
      y: [
        gameWindow.offsetHeight - 390 + 161.5,
        gameWindow.offsetHeight - 390 + 161.5,
      ],
    },
    motorcycleImg: 'assets/sprites/player/motorcycle-1.png',
    wheelImg: 'assets/sprites/player/wheel.png',
    price: 0,
  },
  {
    motorcyclePosition: { x: 80, y: gameWindow.offsetHeight - 390 },
    wheelsPosition: {
      x: [80 + 2.3, 80 + 244.61],
      y: [
        gameWindow.offsetHeight - 390 + 181,
        gameWindow.offsetHeight - 390 + 181,
      ],
    },
    motorcycleImg: 'assets/sprites/player/motorcycle-2.png',
    wheelImg: 'assets/sprites/player/wheel.png',
    price: 0,
  },
  {
    motorcyclePosition: { x: 80, y: gameWindow.offsetHeight - 390 },
    wheelsPosition: {
      x: [80 + 13.11, 80 + 314.21],
      y: [
        gameWindow.offsetHeight - 390 + 178.15,
        gameWindow.offsetHeight - 390 + 178.15,
      ],
    },
    motorcycleImg: 'assets/sprites/player/motorcycle-3.png',
    wheelImg: 'assets/sprites/player/wheel.png',
    price: 50,
  },
  {
    motorcyclePosition: { x: 80, y: gameWindow.offsetHeight - 410 },
    wheelsPosition: {
      x: [80 - 13.5, 80 + 254.02],
      y: [
        gameWindow.offsetHeight - 410 + 196.31,
        gameWindow.offsetHeight - 410 + 196.31,
      ],
    },
    motorcycleImg: 'assets/sprites/player/motorcycle-4.png',
    wheelImg: 'assets/sprites/player/wheel.png',
    price: 250,
  },
  {
    motorcyclePosition: { x: 80, y: gameWindow.offsetHeight - 400 },
    wheelsPosition: {
      x: [80 + 14.38, 80 + 276.35],
      y: [
        gameWindow.offsetHeight - 400 + 186,
        gameWindow.offsetHeight - 400 + 186,
      ],
    },
    motorcycleImg: 'assets/sprites/player/motorcycle-5.png',
    wheelImg: 'assets/sprites/player/wheel.png',
    price: 499,
  },
];

export const playerConfig: PlayerConfig = {
  imgScale: 1,

  motorcycleSound: 'assets/sounds/player/motorcycle.mp3',
  motorcycleSoundLoudness: 0.3,

  jumpHeight: 1400,
  gravity: 2000, // pixels per second
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
  gap: [2500, 3000],
  initialPosition: {
    x: gameConfig.canvasWidth,
    y: gameConfig.canvasHeight - 130.2,
  },
  tccEmployerImages: [
    'assets/sprites/obstacles/tcc-1.png',
    'assets/sprites/obstacles/tcc-2.png',
    'assets/sprites/obstacles/tcc-3.png',
    'assets/sprites/obstacles/tcc-4.png',
  ],
  graveImages: [
    'assets/sprites/obstacles/grave-1.png',
    'assets/sprites/obstacles/grave-2.png',
    'assets/sprites/obstacles/grave-3.png',
    'assets/sprites/obstacles/grave-4.png',
  ],
};

export const coinConfig: CoinConfig = {
  coinImg: 'assets/sprites/player/coin.png',
  coinSound: 'assets/sounds/coin.mp3',
  coinSoundLoudness: 0.3,
  coinGap: 100,
  coinGroupGap: [2500, 7000],
  coinsPerGroup: [3, 5],
  yPos: [150, 300],
  scale: 1,
};
