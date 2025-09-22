/**
 * motorcycleScroll.ts
 *
 * This file is responsible for motorcycle scroll animation which is
 * not considered part of the game.
 */

import { throttle } from './throttling.js';

type moveMotorcycleParams = {
  motorcycle: HTMLDivElement;
  dust: HTMLDivElement;
  scrollPosition: number;
  maxMotorcycleScroll: number;
  windowWidth: number;
};

type throttledMotorcycleScrollParams = {
  motorcycle: HTMLDivElement;
  dust: HTMLDivElement;
  scrollPosition: number;
  maxMotorcycleScroll: number;
  windowWidth: number;
  throttling_time: number;
};

/**
 * Moves Motorcycle and Dust HTML objects when scrolling
 * @param motorcycle
 * @param dust
 * @param scrollPosition
 * @param maxMotorcycleScroll
 * @param windowWidth
 */
export function moveMotorcycle({
  motorcycle,
  dust,
  scrollPosition,
  maxMotorcycleScroll,
  windowWidth,
}: moveMotorcycleParams): void {
  const percentageScrolled: number =
    (scrollPosition * 100) / maxMotorcycleScroll;

  const xPosition: number = Math.round(
    (windowWidth * percentageScrolled) / 100,
  );

  motorcycle.style.left = `${xPosition}px`;
  dust.style.left = `${xPosition}px`;
}

/**
 * Handles Motorcycle and Dust scroll animation
 * @param motorcycle
 * @param dust
 * @param scrollPosition
 * @param maxMotorcycleScroll
 * @param windowWidth
 * @param throttling_time
 */
export function throttledMotorcycleScroll({
  motorcycle,
  dust,
  scrollPosition,
  maxMotorcycleScroll,
  windowWidth,
  throttling_time,
}: throttledMotorcycleScrollParams): void {
  throttle((): void => {
    moveMotorcycle({
      motorcycle,
      dust,
      scrollPosition,
      maxMotorcycleScroll,
      windowWidth,
    });
  }, throttling_time)();
}
