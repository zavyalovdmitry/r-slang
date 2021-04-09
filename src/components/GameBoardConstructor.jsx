import React, {
  useState, useEffect,
} from 'react';
import { PropTypes } from 'prop-types';
import { getRandomNumber } from '../utils';
import LangApi from './LangApi';

const GameBoardConstructor = ({
  dataListWords, setFinish, setResult, arrPagesInGame, difficult,
}) => {
  const [currentWord, changeCurrentWord] = useState(0);
  const [time, setTime] = useState(60);
  const [result, changeRightAnswer] = useState(0);
  const [indexTranslate, setIndexTranslate] = useState(0);
  const [points, setPointsValue] = useState(0);
  const listWord = dataListWords;
  const arrPages = arrPagesInGame;
  let timer;

  const [currentUserWord, updateUserWord] = useState(listWord[currentWord].word.split('').map(() => '_'));
  const [alphabet, changeLetterStatus] = useState([
    {letter: 'a', status: 'outgame'},
    {letter: 'b', status: 'outgame'},
    {letter: 'c', status: 'outgame'},
    {letter: 'd', status: 'outgame'},
    {letter: 'e', status: 'outgame'},
    {letter: 'f', status: 'outgame'},
    {letter: 'g', status: 'outgame'},
    {letter: 'h', status: 'outgame'},
    {letter: 'i', status: 'outgame'},
    {letter: 'j', status: 'outgame'},
    {letter: 'k', status: 'outgame'},
    {letter: 'l', status: 'outgame'},
    {letter: 'm', status: 'outgame'},
    {letter: 'n', status: 'outgame'},
    {letter: 'o', status: 'outgame'},
    {letter: 'p', status: 'outgame'},
    {letter: 'q', status: 'outgame'},
    {letter: 'r', status: 'outgame'},
    {letter: 's', status: 'outgame'},
    {letter: 't', status: 'outgame'},
    {letter: 'u', status: 'outgame'},
    {letter: 'v', status: 'outgame'},
    {letter: 'w', status: 'outgame'},
    {letter: 'x', status: 'outgame'},
    {letter: 'y', status: 'outgame'},
    {letter: 'z', status: 'outgame'}
  ]);

  const alphabetBoard = () => {
    return(
      // active - ingame - outgame - used 
      <>
      {/* {alphabet} */}
        {alphabet.map((el, i) => {
            return(<span className={'game-constructor__alphBoard-btn ' + 
                          (checkLetter(el.letter) ? 'active' : el.status)} 
                          key={i} 
                          // value={el.letter}
                          onClick={(e) => addLetter(e, el.letter)}>
              {/* {el.status === 'outgame' ? '' : el.letter} */}
              {el.letter}
            </span>
            )}
        )}
      </>
    )
  }

const checkLetter = (letter) => {
  return(
          (listWord[currentWord].word.split('').filter((el) => el === letter).length) &&
          (listWord[currentWord].word.split('').filter((el) => el === letter).length >
          currentUserWord.filter((el) => el === letter).length)
  );

  // listWord[currentWord].word
  // currentUserWord
  
  // .split('').includes(el.letter)
}

const addLetter = (e, letter) => {
  let arr = currentUserWord;
  arr[currentUserWord.indexOf('_')] = letter;
  // console.log(e.target);
  updateUserWord([...arr]);
  // console.log(currentUserWord);
}











  const getRandomIndex = () => {
    let indexWord = getRandomNumber(0, listWord.length - 1);
    while (indexWord === currentWord) {
      indexWord = getRandomNumber(0, listWord.length - 1);
    }
    return indexWord;
  };

  const setPoints = (value) => {
    if ((indexTranslate === currentWord) === !!value) {
      setPointsValue(points + arrPages.length * 10);
      changeRightAnswer(result + 1);
    }
  };

  const getNextWord = (e) => {
    if (currentWord % 10 === 0 && currentWord !== 0) {
      let indexNextPage = getRandomNumber(0, 29);
      while (arrPages.indexOf(indexNextPage) !== -1) {
        indexNextPage = getRandomNumber(0, 29);
      }
      LangApi.getWords(difficult, indexNextPage)
        .then((data) => data.json())
        .then((words) => {
          listWord.push(...words);
          arrPages.push(words[0].page);
        });
    }
    setPoints(+e.target.value);
    changeCurrentWord(currentWord + 1);
  };

  const startTimer = () => {
    // timer = setInterval(() => {
    //   setTime((timeNow) => timeNow - 1);
    // }, 1000);
  };

  const endTimer = () => {
    // clearInterval(timer);
  };

  // useEffect(() => {
  //   startTimer();
  //   return endTimer;
  // }, []);

  useEffect(() => {
    if (time === 0) {
      setResult(currentWord, result, points);
      setFinish(true);
    }
  }, [time]);

  useEffect(() => {
    const index = getRandomNumber(0, 1) ? currentWord : getRandomIndex();
    setIndexTranslate(index);
  }, [currentWord]);

  return <article className="game-sprint__board">
    <div className="game-sprint__board-inner">
      <p className="game-sprint__points">{points}</p>
      <p className="game-sprint__plus">+{arrPages.length * 10} очков за слово</p>
      <div className="game-sprint__words-block">
        {/* <p className="game-sprint__translate">{listWord[indexTranslate].wordTranslate}</p> */}
        <p className="game-sprint__translate">{listWord[currentWord].wordTranslate}</p>
        <p className="game-sprint__equal">=</p>
        <p className="game-sprint__word">{currentUserWord.map((el) => el + ' ')}</p>
      </div>
    </div>
    <div>
      {alphabetBoard()}
    </div>
    <div className="game-sprint__btn-block">
      {/* <button className="game-sprint__btn game-sprint__btn--wrong" onClick={(e) => getNextWord(e)} value={0}>не верно</button> */}
      <button className="game-sprint__btn game-sprint__btn--right" onClick={(e) => getNextWord(e)} value={1}>дальше</button>
    </div>
    <p className="timer">
      {time}
    </p>
  </article>;
};

GameBoardConstructor.propTypes = {
  dataListWords: PropTypes.array,
  setFinish: PropTypes.func,
  setResult: PropTypes.func,
  arrPagesInGame: PropTypes.array,
  difficult: PropTypes.number,
};

export default GameBoardConstructor;
