import Game from '../entities/game.js';
import Player from '../entities/player.js';

export type GameInitResult = {
  game: Game;
  player: Player;
};
