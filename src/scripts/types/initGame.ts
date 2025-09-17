import Game from '../entities/game.js';
import Player from '../entities/player.js';
import type TccEmployer from '../entities/tccEmployer.js';
import type Coin from '../entities/coin.js';

export type GameInitResult = {
  game: Game;
  player: Player;
  tccEmployee: TccEmployer[];
  coins: Coin[];
};
