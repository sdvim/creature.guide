export const lerp = (x, y, a) => x * (1 - a) + y * a;

export const easeInExpo = (x) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10));

export const easeInCirc = (x) => 1 - Math.sqrt(1 - Math.pow(x, 2));

export const easeInSine = (x) => 1 - Math.cos((x * Math.PI) / 2);

export const randomInt = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min);