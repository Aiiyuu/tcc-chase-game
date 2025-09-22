/**
 * detectPlayerCoinCollision.ts
 *
 * Contains logic for detecting collisions between the player and Coin.
 * When a collision is detected, the player’s scores is affected and the coin
 * is removed from the game.
 */
import Game from '../entities/game.js';
import Player from '../entities/player.js';
export default function detectPlayerCoinCollision(game, player, coins) {
    const scoresPosition = game.getScoresPosition();
    const scoresSize = game.getScoresSize();
    const playerPosition = player.getPosition();
    const playerSize = player.getMotorcycleSize();
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        const coinPosition = coin.getPosition();
        const coinSize = coin.getCoinSize();
        const isColliding = playerPosition.x < coinPosition.x + coinSize.width &&
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
//# sourceMappingURL=detectPlayerCoinCollision.js.map
