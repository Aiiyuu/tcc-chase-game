import Game from '../entities/game.js';
import Player from '../entities/player.js';
import type TccEmployer from '../entities/tccEmployer.js';

export type GameInitResult = {
  game: Game;
  player: Player;
  tccEmployee: TccEmployer[];
};
