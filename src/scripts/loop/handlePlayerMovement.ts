/**
 * handlePlayerMovement.ts
 *
 * Updates the player's movement based on keyboard input.
 */

// import { playerConfig } from '../config.js';
import { isKeyClicked } from '../input/keyboard.js';
import Player from '../entities/player.js';

export default function handlePlayerMovement(player: Player): void {
  if (isKeyClicked('space')) {
    player.jump();
  }
}
