/**
 * setupScrollAnimation.ts
 *
 * This file is responsible for handling scroll animation
 */
import { throttledMotorcycleScroll } from './motorcycleScroll.js';
/**
 * Creates scroll animation
 */
export function setupScrollAnimation() {
    // Motorcycle scroll animation
    const motorcycle = document.querySelector('.header__motorcycle');
    const dust = document.querySelector('.header__motorcycle-dust');
    if (!motorcycle || !dust)
        return;
    const scrollPosition = window.scrollY;
    const maxMotorcycleScroll = window.innerHeight;
    const windowWidth = window.innerWidth;
    const THROTTLING_TIME = 10; // 10ms
    // Unfixed header if the motorcycle animation is over
    if (scrollPosition < maxMotorcycleScroll) {
        header === null || header === void 0 ? void 0 : header.classList.add('fixed');
        shop === null || shop === void 0 ? void 0 : shop.classList.remove('show');
        throttledMotorcycleScroll({
            motorcycle,
            dust,
            scrollPosition,
            maxMotorcycleScroll,
            windowWidth,
            throttling_time: THROTTLING_TIME,
        });
    }
    else {
        header === null || header === void 0 ? void 0 : header.classList.remove('fixed');
        shop === null || shop === void 0 ? void 0 : shop.classList.add('show');
    }
}
const header = document.querySelector('.header');
const shop = document.querySelector('.shop');
//# sourceMappingURL=setupScrollAnimation.js.map
