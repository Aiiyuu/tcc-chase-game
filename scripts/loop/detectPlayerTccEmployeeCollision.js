/**
 * detectPlayerTccEmployeeCollision.ts
 *
 * Contains logic for detecting collisions between the player and TCC Employee.
 * When a collision is detected, the player’s health is affected and the TCC Employee
 * is removed from the game.
 */
import Game from '../entities/game.js';
import Player from '../entities/player.js';
import { gameConfig } from '../config.js';
export default function detectPlayerTccEmployeeCollision(game, player, tccEmployee) {
    const playerPosition = {
        x: player.getPosition().x,
        y: player.getPosition().y,
    };
    const playerSize = player.getMotorcycleSize();
    const playerRight = playerPosition.x + playerSize.width;
    const playerBottom = playerPosition.y + playerSize.height;
    for (const tccEmployer of tccEmployee) {
        if (tccEmployer.getIsDead())
            continue;
        const tccEmployerPosition = tccEmployer.getPosition();
        const tccEmployerSize = tccEmployer.getSize();
        const employerLeft = tccEmployerPosition.x;
        const employerRight = tccEmployerPosition.x + tccEmployerSize.width;
        // Because image is drawn from bottom up
        const employerTop = tccEmployerPosition.y - tccEmployerSize.height;
        const isHorizontalCollision = playerRight >= employerLeft && playerPosition.x <= employerRight;
        const isVerticalCollision = playerBottom >= employerTop;
        if (isHorizontalCollision && isVerticalCollision) {
            tccEmployer.setIsDead();
            player.playRandomSound();
            game.subtractHealthPoints(gameConfig.damage);
            return;
        }
    }
}
//# sourceMappingURL=detectPlayerTccEmployeeCollision.js.map
