/**
 * loader.ts
 *
 * This file contains the logic for the website preloader
 */
'use strict';

/**
 * This function displays a full-page loading overlay (".loading") while the website loads,
 * and automatically hides it once the window 'load' event is fired (all assets like images are fully loaded).
 *
 * It expects a <div class="loading"> to exist in the HTML and be styled to cover the screen.
 */
export function showLoadingUntilSiteLoaded(): void {
  window.addEventListener('load', (): void => {
    const LOADER = document.querySelector('.loading') as HTMLElement | null;

    if (LOADER) {
      LOADER.style.display = 'none';
    }
  });
}
