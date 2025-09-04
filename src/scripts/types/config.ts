// Game config type
export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  canvasBackground: string;
  gameSpeed: number;

  healthPoints: number;
  healthPointsFont: string;
  healthPointsTextColor: string;
  healthPointsTextMargin: number;
  heartIcon: string;
  heartMargin: {
    x: number;
    y: number;
  };

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

export interface PlayerConfig {
  motorcyclePosition: {
    x: number;
    y: number;
  };
  wheelsPosition: {
    x: number[];
    y: number[];
  };

  imgScale: number;
  motorcycleImg: string;
  wheelImg: string;

  motorcycleSound: string;
  motorcycleSoundLoudness: number;

  jumpHeight: number;
  gravity: number;
  jumpSound: string;
  jumpSoundLoudness: number;
}

export interface TccEmployerConfig {
  gap: number[];
  initialPosition: {
    x: number;
    y: number;
  };
  tccEmployerImages: string[];
}

export type Position = { x: number; y: number };
