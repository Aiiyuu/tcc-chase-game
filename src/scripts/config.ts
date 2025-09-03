/**
 * config.ts
 *
 * Centralized configuration and constants for the game such as canvas size,
 * speeds, colors, and other gameplay settings.
 */

import type { GameConfig } from './types/config.js';

// Get the game window object
const gameWindow = document.getElementById('game') as HTMLCanvasElement;

// Make sure the game window exists
if (!gameWindow) {
  throw new Error("Cannot find element with ID 'game'");
}

export const gameConfig: GameConfig = {
  canvasWidth: gameWindow.offsetWidth,
  canvasHeight: gameWindow.offsetHeight,
};
