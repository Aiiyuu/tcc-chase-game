/**
 * shop.ts
 *
 * The file is responsible for handling shop functionality and shop scroll animation
 */

import { throttle } from './throttling.js';
import { motorcycles } from '../scripts/config.js';
import type { Motorcycle } from '../scripts/types/config.js';

const tentacles: HTMLDivElement | null =
  document.querySelector('.shop__tentacles');
const car: HTMLDivElement | null = document.querySelector(
  '.shop__tentacles-car',
);
const motorcycleWrapper: HTMLDivElement | null =
  document.querySelector('.shop__motorcycle');

const motorcycleDust: HTMLDivElement | null = document.querySelector(
  '.shop__motorcycle-dust',
);

const coinCounter: HTMLSpanElement | null =
  document.getElementById('coin-counter');

const priceCounter: HTMLSpanElement | null =
  document.getElementById('price-counter');

const navigationItems: Element[] = Array.from(
  document.querySelectorAll('.shop__navigation-item'),
);

const unlockBtn: HTMLElement | null =
  document.getElementById('purchase-button');

const throttling_time: number = 5; // 5ms

let prevMotorcycleId: number = -1;

export function setupShop(): void {
  // Update body height to make slider work
  document.body.style.height = `${100 * (motorcycles.length + 1) + 100 * 0.5}vh`;

  updateCoinCounter();
  initializeMotorcycleStore();

  unlockBtn?.addEventListener('click', (): void => {
    if (prevMotorcycleId >= 0) {
      buyMotorcycles(prevMotorcycleId);
    }
  });
}

/**
 * Moves tentacles to the user's mouse x cord
 * @param e
 */
export function handleTentaclesMovement(e: MouseEvent): void {
  throttle((): void => {
    const xPos: number = e.clientX;

    if (!tentacles || !car) return;

    tentacles.style.left = `${xPos}px`;

    if (!car.classList.contains('shop__tentacles-car--collapsed')) {
      car.style.left = `${xPos}px`;
    }
  }, throttling_time)();
}

/**
 * Collapses the tentacles' car
 */
export function handleTentaclesCollapse(): void {
  if (car && !car.classList.contains('shop__tentacles-car--collapsed')) {
    car.classList.add('shop__tentacles-car--collapsed');
  }
}

/**
 * Initialize motorcycle shop slider
 */
export function setupShopSlider(): void {
  if (!motorcycleWrapper) return;

  throttle((): void => {
    const maxSlideScroll: number = window.innerHeight;
    const windowScrollPos: number = window.scrollY - window.innerHeight;

    if (windowScrollPos <= 0) return;

    const sliderScrollPos: number = Math.ceil(
      ((windowScrollPos % maxSlideScroll) * 100) / maxSlideScroll,
    );
    const sliderScrolledPercentage: number = Math.ceil(
      (windowScrollPos * 100) / maxSlideScroll,
    );

    const currentMotorcycleId: number = Math.ceil(
      sliderScrolledPercentage / 100,
    );

    if (prevMotorcycleId !== currentMotorcycleId - 1) {
      prevMotorcycleId = currentMotorcycleId - 1;
      updateMotorcycleObj(currentMotorcycleId - 1);
    }

    motorcycleWrapper.style.left = `${sliderScrollPos}%`;

    if (motorcycleDust) {
      motorcycleDust.style.left = `${sliderScrollPos}%`;
    }

    const sliderScrollPosPx: number = Math.round(
      (window.innerWidth * sliderScrollPos) / 100,
    );
    const wheelL: number = Math.round(2 * Math.PI * 48);
    const rotationState: number = Math.round(
      (360 * sliderScrollPosPx) / wheelL,
    );

    rotateWheels(rotationState);
  }, throttling_time)();
}

/**
 * Gets and sets coins to the coin counter
 */
function updateCoinCounter(): void {
  const bank: string | null = localStorage.getItem('bank');

  if (coinCounter && bank) {
    coinCounter.textContent = bank;
  }
}

/**
 * Initialize motorcycle store
 */
function initializeMotorcycleStore(): void {
  const purchasedMotorcycles: number[] = getPurchasedMotorcycles();

  for (let i: number = 0; i < motorcycles.length; i++) {
    if (motorcycles[i]!.price <= 0 && !purchasedMotorcycles.includes(i)) {
      purchasedMotorcycles.push(i);
    }
  }

  localStorage.setItem('purchased-motorcycles', purchasedMotorcycles.join(' '));
}

/**
 * Checks what kind of motorcycles are already purchased
 */
function getPurchasedMotorcycles(): number[] {
  const purchasedMotorcycles: string | null = localStorage.getItem(
    'purchased-motorcycles',
  );

  if (purchasedMotorcycles) {
    return purchasedMotorcycles.split(' ').map(Number);
  }

  return [];
}

/**
 * Add motorcycle to your collection
 */
function buyMotorcycles(id: number): void {
  if (motorcycleIsUnlocked(id)) return;

  const bank: number = Number(localStorage.getItem('bank') || -1);
  const motorcyclePrice: number = motorcycles[id]!.price;

  if (bank >= motorcyclePrice) {
    const purchasedMotorcycles: number[] = getPurchasedMotorcycles();
    purchasedMotorcycles.push(id);

    localStorage.setItem(
      'purchased-motorcycles',
      purchasedMotorcycles.join(' '),
    );
    localStorage.setItem('bank', String(bank - motorcyclePrice));

    updateCoinCounter();
    updateMotorcycleObj(prevMotorcycleId);
  } else {
    alert("You don't have enough money");
  }
}

/**
 * Creates HTML motorcycle object
 */
function createMotorcycleObject(obj: Motorcycle): void {
  if (!motorcycleWrapper) return;

  // Clear existing elements inside the wrapper
  motorcycleWrapper.innerHTML = '';

  const imgEl: HTMLImageElement = document.createElement('img');
  imgEl.classList.add('shop__motorcycle-obj');
  imgEl.alt = 'motorcycle';
  imgEl.src = obj.motorcycleImg;
  imgEl.style.position = 'absolute';
  imgEl.style.left = `0px`;
  imgEl.style.top = `${obj.motorcyclePosition.y}px`;

  const wheelEl1: HTMLImageElement = document.createElement('img');
  wheelEl1.classList.add('shop__motorcycle-wheel-obj');
  wheelEl1.alt = 'wheel';
  wheelEl1.src = obj.wheelImg;
  wheelEl1.style.position = 'absolute';
  wheelEl1.style.left = `${obj.wheelsPosition.x[0]! - obj.motorcyclePosition.x}px`;
  wheelEl1.style.top = `${obj.wheelsPosition.y[0]}px`;

  const wheelEl2: HTMLImageElement = document.createElement('img');
  wheelEl2.classList.add('shop__motorcycle-wheel-obj');
  wheelEl2.alt = 'wheel';
  wheelEl2.src = obj.wheelImg;
  wheelEl2.style.position = 'absolute';
  wheelEl2.style.left = `${obj.wheelsPosition.x[1]! - obj.motorcyclePosition.x}px`;
  wheelEl2.style.top = `${obj.wheelsPosition.y[1]}px`;

  const dust: HTMLDivElement = document.createElement('div');
  dust.classList.add('shop__motorcycle-dust');
  dust.style.left = `${obj.wheelsPosition.x[0]! - obj.motorcyclePosition.x}px`;
  dust.style.top = `${obj.wheelsPosition.y[0]}px`;

  setTimeout((): void => {
    const motorcycleOffset: number = imgEl.width + imgEl.offsetLeft;
    const wheelOffset: number = wheelEl2.offsetLeft + wheelEl2.width;
    const motorcycleWidth: number =
      motorcycleOffset < wheelOffset ? wheelOffset : motorcycleOffset;

    motorcycleWrapper.style.width = `${motorcycleWidth}px`;

    if (motorcycleDust) {
      motorcycleDust.style.transform = `translateX(-${window.innerHeight / 2 - motorcycleWidth / 2}px)`;
    }
  }, 100);

  motorcycleWrapper.appendChild(wheelEl1);
  motorcycleWrapper.appendChild(wheelEl2);
  motorcycleWrapper.appendChild(imgEl);
  motorcycleWrapper.appendChild(dust);
}

/**
 * Update motorcycle objects
 */
function updateMotorcycleObj(motorcycleId: number): void {
  createMotorcycleObject(motorcycles[motorcycleId]!);
  updatePrice(motorcycles[motorcycleId]!.price, motorcycleId);

  if (motorcycleIsUnlocked(motorcycleId)) {
    localStorage.setItem('selected-motorcycle', String(motorcycleId));
  }
}

/**
 * Rotates wheels
 * @param rotationState
 */
function rotateWheels(rotationState: number): void {
  if (!motorcycleWrapper) return;

  const wheels: HTMLImageElement[] = Array.from(
    motorcycleWrapper.querySelectorAll('.shop__motorcycle-wheel-obj'),
  );

  const wheel: HTMLImageElement | undefined = wheels[wheels.length - 1];
  if (wheel) {
    wheel.style.transform = `rotate(${rotationState}deg)`;
  }
}

/**
 * Updates motorcycle price
 */
function updatePrice(price: number, id: number): void {
  if (priceCounter) {
    navigationItems[0]?.classList.remove('hidden');
    navigationItems[1]?.classList.remove('hidden');
    navigationItems[2]?.classList.remove('hidden');

    if (price > 0 && !getPurchasedMotorcycles().includes(id)) {
      priceCounter.textContent = `${price}`;
      navigationItems[2]?.classList.add('hidden');
      return;
    }

    navigationItems[0]?.classList.add('hidden');
    navigationItems[1]?.classList.add('hidden');
  }
}

/**
 * Checks if the motorcycle is unlocked
 */
function motorcycleIsUnlocked(id: number): boolean {
  const purchasedMotorcycles: number[] = getPurchasedMotorcycles();
  return purchasedMotorcycles.includes(id) || motorcycles[id]!.price === 0;
}
