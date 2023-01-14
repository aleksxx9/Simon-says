export const getRandomNumber = () => Math.floor(Math.random() * 3 + 1);

export const timer = (ms) => new Promise((res) => setTimeout(res, ms));