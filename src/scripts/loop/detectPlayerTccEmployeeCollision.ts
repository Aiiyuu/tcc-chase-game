/**
 * detectPlayerTccEmployeeCollision.ts
 *
 * Contains logic for detecting collisions between the player and TCC Employee.
 * When a collision is detected, the player’s health is affected and the TCC Employee
 * is removed from the game.
 */

import Game from '../entities/game.js';
import Player from '../entities/player.js';
import type TccEmployer from '../entities/tccEmployer.js';
import { gameConfig } from '../config.js';

type Position = { x: number; y: number };
type Size = { width: number; height: number };

export default function detectPlayerTccEmployeeCollision(
  game: Game,
  player: Player,
  tccEmployee: TccEmployer[],
): void {
  const playerPosition: Position = {
    x: player.getPosition().x,
    y: player.getPosition().y,
  };

  const playerSize: Size = player.getMotorcycleSize();
  const playerRight: number = playerPosition.x + playerSize.width;
  const playerBottom: number = playerPosition.y + playerSize.height;

  for (const tccEmployer of tccEmployee) {
    if (tccEmployer.getIsDead()) continue;

    const tccEmployerPosition: Position = tccEmployer.getPosition();
    const tccEmployerSize: Size = tccEmployer.getSize();

    const employerLeft: number = tccEmployerPosition.x;
    const employerRight: number = tccEmployerPosition.x + tccEmployerSize.width;

    // Because image is drawn from bottom up
    const employerTop: number = tccEmployerPosition.y - tccEmployerSize.height;

    const isHorizontalCollision: boolean =
      playerRight >= employerLeft && playerPosition.x <= employerRight;

    const isVerticalCollision: boolean = playerBottom >= employerTop;

    if (isHorizontalCollision && isVerticalCollision) {
      tccEmployer.setIsDead();
      player.playRandomSound();
      game.subtractHealthPoints(gameConfig.damage);
      return;
    }
  }
}
