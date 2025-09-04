import Game from '../entities/game.js';
import Player from '../entities/player.js';
import TccEmployer from '../entities/tccEmployer.js';

export type GameLoopParams = {
  ctx: CanvasRenderingContext2D;
  game: Game;
  player: Player;
  tccEmployee: TccEmployer[];
};
