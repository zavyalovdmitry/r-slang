export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const shuffleArray = (array) => {
  array.sort(() => Math.random() - 0.5);
  return array;
};

export const playSound = (path) => {
  const sound = new Audio(`https://react-rs-lang.herokuapp.com/${path}`);
  sound.play();
};

export const PATH_API = 'https://react-rs-lang.herokuapp.com/';

export const shuffle = (array) => {
  const newArr = array;
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};
