/**
 * shop.ts
 *
 * The file is responsible for handling shop functionality and shop scroll animation
 */
import { throttle } from './throttling.js';
import { motorcycles } from '../scripts/config.js';
const tentacles = document.querySelector('.shop__tentacles');
const car = document.querySelector('.shop__tentacles-car');
const motorcycleWrapper = document.querySelector('.shop__motorcycle');
const motorcycleDust = document.querySelector('.shop__motorcycle-dust');
const coinCounter = document.getElementById('coin-counter');
const priceCounter = document.getElementById('price-counter');
const navigationItems = Array.from(document.querySelectorAll('.shop__navigation-item'));
const unlockBtn = document.getElementById('purchase-button');
const throttling_time = 5; // 5ms
let prevMotorcycleId = -1;
export function setupShop() {
    // Update body height to make slider work
    document.body.style.height = `${100 * (motorcycles.length + 1) + 100 * 0.5}vh`;
    updateCoinCounter();
    initializeMotorcycleStore();
    unlockBtn === null || unlockBtn === void 0 ? void 0 : unlockBtn.addEventListener('click', () => {
        if (prevMotorcycleId >= 0) {
            buyMotorcycles(prevMotorcycleId);
        }
    });
}
/**
 * Moves tentacles to the user's mouse x cord
 * @param e
 */
export function handleTentaclesMovement(e) {
    throttle(() => {
        const xPos = e.clientX;
        if (!tentacles || !car)
            return;
        tentacles.style.left = `${xPos}px`;
        if (!car.classList.contains('shop__tentacles-car--collapsed')) {
            car.style.left = `${xPos}px`;
        }
    }, throttling_time)();
}
/**
 * Collapses the tentacles' car
 */
export function handleTentaclesCollapse() {
    if (car && !car.classList.contains('shop__tentacles-car--collapsed')) {
        car.classList.add('shop__tentacles-car--collapsed');
    }
}
/**
 * Initialize motorcycle shop slider
 */
export function setupShopSlider() {
    if (!motorcycleWrapper)
        return;
    throttle(() => {
        const maxSlideScroll = window.innerHeight;
        const windowScrollPos = window.scrollY - window.innerHeight;
        if (windowScrollPos <= 0)
            return;
        const sliderScrollPos = Math.ceil(((windowScrollPos % maxSlideScroll) * 100) / maxSlideScroll);
        const sliderScrolledPercentage = Math.ceil((windowScrollPos * 100) / maxSlideScroll);
        const currentMotorcycleId = Math.ceil(sliderScrolledPercentage / 100);
        if (prevMotorcycleId !== currentMotorcycleId - 1) {
            prevMotorcycleId = currentMotorcycleId - 1;
            updateMotorcycleObj(currentMotorcycleId - 1);
        }
        motorcycleWrapper.style.left = `${sliderScrollPos}%`;
        if (motorcycleDust) {
            motorcycleDust.style.left = `${sliderScrollPos}%`;
        }
        const sliderScrollPosPx = Math.round((window.innerWidth * sliderScrollPos) / 100);
        const wheelL = Math.round(2 * Math.PI * 48);
        const rotationState = Math.round((360 * sliderScrollPosPx) / wheelL);
        rotateWheels(rotationState);
    }, throttling_time)();
}
/**
 * Gets and sets coins to the coin counter
 */
function updateCoinCounter() {
    const bank = localStorage.getItem('bank');
    if (coinCounter && bank) {
        coinCounter.textContent = bank;
    }
}
/**
 * Initialize motorcycle store
 */
function initializeMotorcycleStore() {
    const purchasedMotorcycles = getPurchasedMotorcycles();
    for (let i = 0; i < motorcycles.length; i++) {
        if (motorcycles[i].price <= 0 && !purchasedMotorcycles.includes(i)) {
            purchasedMotorcycles.push(i);
        }
    }
    localStorage.setItem('purchased-motorcycles', purchasedMotorcycles.join(' '));
}
/**
 * Checks what kind of motorcycles are already purchased
 */
function getPurchasedMotorcycles() {
    const purchasedMotorcycles = localStorage.getItem('purchased-motorcycles');
    if (purchasedMotorcycles) {
        return purchasedMotorcycles.split(' ').map(Number);
    }
    return [];
}
/**
 * Add motorcycle to your collection
 */
function buyMotorcycles(id) {
    if (motorcycleIsUnlocked(id))
        return;
    const bank = Number(localStorage.getItem('bank') || -1);
    const motorcyclePrice = motorcycles[id].price;
    if (bank >= motorcyclePrice) {
        const purchasedMotorcycles = getPurchasedMotorcycles();
        purchasedMotorcycles.push(id);
        localStorage.setItem('purchased-motorcycles', purchasedMotorcycles.join(' '));
        localStorage.setItem('bank', String(bank - motorcyclePrice));
        updateCoinCounter();
        updateMotorcycleObj(prevMotorcycleId);
    }
    else {
        alert("You don't have enough money");
    }
}
/**
 * Creates HTML motorcycle object
 */
function createMotorcycleObject(obj) {
    if (!motorcycleWrapper)
        return;
    // Clear existing elements inside the wrapper
    motorcycleWrapper.innerHTML = '';
    const imgEl = document.createElement('img');
    imgEl.classList.add('shop__motorcycle-obj');
    imgEl.alt = 'motorcycle';
    imgEl.src = obj.motorcycleImg;
    imgEl.style.position = 'absolute';
    imgEl.style.left = `0px`;
    imgEl.style.top = `${obj.motorcyclePosition.y}px`;
    const wheelEl1 = document.createElement('img');
    wheelEl1.classList.add('shop__motorcycle-wheel-obj');
    wheelEl1.alt = 'wheel';
    wheelEl1.src = obj.wheelImg;
    wheelEl1.style.position = 'absolute';
    wheelEl1.style.left = `${obj.wheelsPosition.x[0] - obj.motorcyclePosition.x}px`;
    wheelEl1.style.top = `${obj.wheelsPosition.y[0]}px`;
    const wheelEl2 = document.createElement('img');
    wheelEl2.classList.add('shop__motorcycle-wheel-obj');
    wheelEl2.alt = 'wheel';
    wheelEl2.src = obj.wheelImg;
    wheelEl2.style.position = 'absolute';
    wheelEl2.style.left = `${obj.wheelsPosition.x[1] - obj.motorcyclePosition.x}px`;
    wheelEl2.style.top = `${obj.wheelsPosition.y[1]}px`;
    const dust = document.createElement('div');
    dust.classList.add('shop__motorcycle-dust');
    dust.style.left = `${obj.wheelsPosition.x[0] - obj.motorcyclePosition.x}px`;
    dust.style.top = `${obj.wheelsPosition.y[0]}px`;
    setTimeout(() => {
        const motorcycleOffset = imgEl.width + imgEl.offsetLeft;
        const wheelOffset = wheelEl2.offsetLeft + wheelEl2.width;
        const motorcycleWidth = motorcycleOffset < wheelOffset ? wheelOffset : motorcycleOffset;
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
function updateMotorcycleObj(motorcycleId) {
    createMotorcycleObject(motorcycles[motorcycleId]);
    updatePrice(motorcycles[motorcycleId].price, motorcycleId);
    if (motorcycleIsUnlocked(motorcycleId)) {
        localStorage.setItem('selected-motorcycle', String(motorcycleId));
    }
}
/**
 * Rotates wheels
 * @param rotationState
 */
function rotateWheels(rotationState) {
    if (!motorcycleWrapper)
        return;
    const wheels = Array.from(motorcycleWrapper.querySelectorAll('.shop__motorcycle-wheel-obj'));
    const wheel = wheels[wheels.length - 1];
    if (wheel) {
        wheel.style.transform = `rotate(${rotationState}deg)`;
    }
}
/**
 * Updates motorcycle price
 */
function updatePrice(price, id) {
    var _a, _b, _c, _d, _e, _f;
    if (priceCounter) {
        (_a = navigationItems[0]) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
        (_b = navigationItems[1]) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
        (_c = navigationItems[2]) === null || _c === void 0 ? void 0 : _c.classList.remove('hidden');
        if (price > 0 && !getPurchasedMotorcycles().includes(id)) {
            priceCounter.textContent = `${price}`;
            (_d = navigationItems[2]) === null || _d === void 0 ? void 0 : _d.classList.add('hidden');
            return;
        }
        (_e = navigationItems[0]) === null || _e === void 0 ? void 0 : _e.classList.add('hidden');
        (_f = navigationItems[1]) === null || _f === void 0 ? void 0 : _f.classList.add('hidden');
    }
}
/**
 * Checks if the motorcycle is unlocked
 */
function motorcycleIsUnlocked(id) {
    const purchasedMotorcycles = getPurchasedMotorcycles();
    return purchasedMotorcycles.includes(id) || motorcycles[id].price === 0;
}
//# sourceMappingURL=shop.js.map
