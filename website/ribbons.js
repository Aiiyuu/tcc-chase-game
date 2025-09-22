/**
 * ribbons.ts
 *
 * This file contains a function responsible for triggering the ribbons' animation.
 */
const ribbons = document.querySelector('.ribbons');
export const RIBBONS_DELAY = 3500;
export function triggerRibbons() {
    if (!ribbons || ribbons.classList.contains('ribbons--active'))
        return;
    ribbons.classList.add('ribbons--active');
    setTimeout(() => {
        ribbons.classList.remove('ribbons--active');
    }, RIBBONS_DELAY);
}
//# sourceMappingURL=ribbons.js.map
