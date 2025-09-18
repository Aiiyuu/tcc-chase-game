/**
 * throttling.ts
 *
 * This file contains a function used for optimizing the scroll animation
 */
export function throttle(fn, wait) {
    let isThrottled = false;
    return function () {
        if (!isThrottled) {
            fn();
            isThrottled = true;
            setTimeout(() => {
                isThrottled = false;
            }, wait);
        }
    };
}
//# sourceMappingURL=throttling.js.map
