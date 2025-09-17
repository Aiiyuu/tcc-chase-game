import Game from '../entities/game.js';
import Player from '../entities/player.js';
import TccEmployer from '../entities/tccEmployer.js';
import Coin from '../entities/coin.js';

export type GameLoopParams = {
  ctx: CanvasRenderingContext2D;
  game: Game;
  player: Player;
  tccEmployee: TccEmployer[];
  coins: Coin[];
};
