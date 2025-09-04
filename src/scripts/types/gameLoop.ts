import Game from '../entities/game.js';
import Player from '../entities/player.js';

export type GameLoopParams = {
  ctx: CanvasRenderingContext2D;
  game: Game;
  player: Player;
};
