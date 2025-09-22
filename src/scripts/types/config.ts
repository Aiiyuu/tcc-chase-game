// Game config type
export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  canvasBackground: string;
  gameSpeed: number;

  backgroundMusic: string;
  backgroundMusicLoudness: number;

  healthPoints: number;
  damage: number;
  healthPointsFont: string;
  healthPointsTextColor: string;
  healthPointsTextMargin: number;
  heartIcon: string;
  heartMargin: {
    x: number;
    y: number;
  };

  scoresFont: string;
  scoresTextColor: string;
  scoresTextMargin: number;
  scoresScale: number;
  scoreMargin: {
    x: number;
    y: number;
  };

  gameOverFont: string;
  gameOverTextColor: string;
  gameOverDescriptionFont: string;
  gameOverDescriptionTextColor: string;

  instructionFont: string;
  instructionTextColor: string;
  instructionMarginY: number;

  buildingsGap: number[];
  buildingsScale: number;
  buildings: string[];

  treesGap: number[];
  treesScale: number;
  trees: string[];

  cloudsGap: number[];
  cloudsScale: number;
  cloudsSpeed: number;
  clouds: string[];

  road: string;
}

export interface Motorcycle {
  motorcyclePosition: {
    x: number;
    y: number;
  };
  wheelsPosition: {
    x: number[];
    y: number[];
  };

  motorcycleImg: string;
  wheelImg: string;
  price: number;
}

export interface PlayerConfig {
  imgScale: number;

  motorcycleSound: string;
  motorcycleSoundLoudness: number;

  jumpHeight: number;
  gravity: number;
  jumpSound: string;
  jumpSoundLoudness: number;

  soundEffects: string[];
  soundEffectLoudness: number;
}

export interface TccEmployerConfig {
  gap: number[];
  initialPosition: {
    x: number;
    y: number;
  };
  tccEmployerImages: string[];
  graveImages: string[];
}

export interface CoinConfig {
  coinImg: string;
  coinSound: string;
  coinSoundLoudness: number;
  coinGap: number;
  coinGroupGap: number[];
  coinsPerGroup: number[];
  yPos: number[];
  scale: number;
}

export type Position = { x: number; y: number };
export type Size = { width: number; height: number };
