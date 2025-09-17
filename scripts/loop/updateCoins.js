/**
 * updateCoins.ts
 *
 * Updates the position of each coin and removes any that go off-screen.
 */
import Coin from '../entities/coin.js';
import { gameConfig, coinConfig } from '../config.js';
// Internal state for spawning logic
let lastGroupSpawnTime = performance.now();
let nextGroupGap = getRandomGap();
function getRandomGap() {
    const [minGap = 500, maxGap = 1500] = coinConfig.coinGroupGap;
    return Math.random() * (maxGap - minGap) + minGap;
}
function getRandomCoinsCount() {
    const [minCoins = 3, maxCoins = 5] = coinConfig.coinsPerGroup;
    return Math.floor(Math.random() * (maxCoins - minCoins + 1)) + minCoins;
}
function getRandomY() {
    const [minY = 50, maxY = 300] = coinConfig.yPos;
    return Math.random() * (maxY - minY) + minY;
}
export default function updateCoins(ctx, coins, deltaTime) {
    // Remove off screen coins (left side)
    if (coins.length > 0 && coins[0].isOffScreen()) {
        coins.shift();
    }
    // Remove coins that are ready to be destroyed
    for (let i = 0; i < coins.length; i++) {
        if (coins[i].isReadyToBeDestroyed) {
            coins.splice(i, 1);
        }
    }
    // Spawn new coin groups based on timing
    const now = performance.now();
    if (now - lastGroupSpawnTime >= nextGroupGap) {
        lastGroupSpawnTime = now;
        nextGroupGap = getRandomGap();
        const coinsCount = getRandomCoinsCount();
        const y = getRandomY();
        for (let i = 0; i < coinsCount; i++) {
            const x = gameConfig.canvasWidth + i * coinConfig.coinGap;
            coins.push(new Coin(ctx, { x: x, y: y }));
        }
    }
    // Update all existing coins
    for (const coin of coins) {
        coin.update(deltaTime);
    }
}
//# sourceMappingURL=updateCoins.js.map
