/**
 * throttling.ts
 *
 * This file contains a function used for optimizing the scroll animation
 */

export function throttle(fn: () => void, wait: number): () => void {
  let isThrottled: boolean = false;

  return function (): void {
    if (!isThrottled) {
      fn();
      isThrottled = true;

      setTimeout((): void => {
        isThrottled = false;
      }, wait);
    }
  };
}
