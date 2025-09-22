/**
 * detectPlayerCoinCollision.ts
 *
 * Contains logic for detecting collisions between the player and Coin.
 * When a collision is detected, the player’s scores is affected and the coin
 * is removed from the game.
 */

import Game from '../entities/game.js';
import Player from '../entities/player.js';
import type Coin from '../entities/coin.js';
import type { Position, Size } from '../types/config.js';

export default function detectPlayerCoinCollision(
  game: Game,
  player: Player,
  coins: Coin[],
): void {
  const scoresPosition: Position = game.getScoresPosition();
  const scoresSize: Size = game.getScoresSize();

  const playerPosition: Position = player.getPosition();
  const playerSize: Size = player.getMotorcycleSize();

  for (let i: number = coins.length - 1; i >= 0; i--) {
    const coin: Coin = coins[i]!;
    const coinPosition: Position = coin.getPosition();
    const coinSize: Size = coin.getCoinSize();

    const isColliding: boolean =
      playerPosition.x < coinPosition.x + coinSize.width &&
      playerPosition.x + playerSize.width > coinPosition.x &&
      playerPosition.y < coinPosition.y + coinSize.height &&
      playerPosition.y + playerSize.height > coinPosition.y;

    if (isColliding && !coin.isTaken) {
      coin.isTaken = true;
      coin.playCoinSound();
      game.updateScores(1);
      game.updateScoresStorage();
      coin.setTarget(scoresPosition, scoresSize);
    }
  }
}
