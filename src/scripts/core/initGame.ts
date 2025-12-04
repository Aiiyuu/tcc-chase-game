/**
 * initGame.ts
 *
 * Initializes the game logic, player, and keyboard input handling.
 * Returns initialized game objects.
 */

// import entities
import Game from '../entities/game.js';
import Player from '../entities/player.js';
import TccEmployer from '../entities/tccEmployer.js';
import Coin from '../entities/coin.js';

// import types
import type { GameInitResult } from '../types/initGame.js';

import { initKeyboardControls } from '../input/keyboard.js';

export default function initGame(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
): GameInitResult {
  // Initialize game entities
  const game = new Game(canvas, ctx);
  const player = new Player(canvas, ctx);
  const tccEmployee: TccEmployer[] = [];
  const coins: Coin[] = [];

  initKeyboardControls();

  return { game, player, tccEmployee, coins };
}
