/**
 * updateTccEmployee.ts
 *
 * Updates the position of each TCC Employee and removes any that go off-screen.
 */

import TccEmployer from '../entities/tccEmployer.js';
import { gameConfig, tccEmployerConfig } from '../config.js';
import type { Position } from '../types/config.js';

export default function updateTccEmployee(
  ctx: CanvasRenderingContext2D,
  tccEmployee: TccEmployer[],
): void {
  // Remove off screen employer (left side)
  if (tccEmployee.length > 0 && tccEmployee[0]!.isOffScreen()) {
    tccEmployee.shift();
  }

  const [gapMin = 150, gapMax = 400] = tccEmployerConfig.gap;

  // Determine the x position of the last TCC employee
  const lastX =
    tccEmployee.length > 0
      ? tccEmployee[tccEmployee.length - 1]!.getPosition().x
      : gameConfig.canvasWidth;

  // Only add new employee if the last employee is far enough left to add a new one on the right
  if (lastX <= gameConfig.canvasWidth) {
    // Generate a random gap between 200 and 500
    const randomGap =
      Math.floor(Math.random() * (gapMax - gapMin + 1)) + gapMin;

    // New employee x is last employee's x + gap
    const newX = lastX + randomGap;

    // Position on right side with new gap
    const position: Position = {
      x: newX,
      y: tccEmployerConfig.initialPosition.y,
    };

    const newEmployer = new TccEmployer(ctx, position);
    tccEmployee.push(newEmployer);
  }

  // Update all existing employees
  for (const tccEmployer of tccEmployee) {
    tccEmployer.update();
  }
}
