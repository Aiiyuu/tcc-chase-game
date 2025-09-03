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
