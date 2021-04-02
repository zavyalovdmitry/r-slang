export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const shuffleArray = (array) => {
  array.sort(() => Math.random() - 0.5);
  return array;
};
