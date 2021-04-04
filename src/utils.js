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
