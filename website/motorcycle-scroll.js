/**
 * motorcycle-scroll.ts
 *
 * This file is responsible for motorcycle scroll animation which is
 * not considered part of the game.
 */
import { throttle } from './throttling.js';
/**
 * Moves Motorcycle and Dust HTML objects when scrolling
 * @param motorcycle
 * @param dust
 * @param scrollPosition
 * @param maxMotorcycleScroll
 * @param windowWidth
 */
export function moveMotorcycle({ motorcycle, dust, scrollPosition, maxMotorcycleScroll, windowWidth, }) {
    const percentageScrolled = (scrollPosition * 100) / maxMotorcycleScroll;
    const xPosition = Math.round((windowWidth * percentageScrolled) / 100);
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
export function throttledMotorcycleScroll({ motorcycle, dust, scrollPosition, maxMotorcycleScroll, windowWidth, throttling_time, }) {
    throttle(() => {
        moveMotorcycle({
            motorcycle,
            dust,
            scrollPosition,
            maxMotorcycleScroll,
            windowWidth,
        });
    }, throttling_time)();
}
//# sourceMappingURL=motorcycle-scroll.js.map
