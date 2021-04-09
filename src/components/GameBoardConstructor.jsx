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

  const alphabet = [
    {letter: 'A', status: 'outgame'},
    {letter: 'B', status: 'outgame'},
    {letter: 'C', status: 'outgame'},
    {letter: 'D', status: 'outgame'},
    {letter: 'E', status: 'outgame'},
    {letter: 'F', status: 'outgame'},
    {letter: 'G', status: 'outgame'},
    {letter: 'H', status: 'outgame'},
    {letter: 'I', status: 'outgame'},
    {letter: 'J', status: 'outgame'},
    {letter: 'K', status: 'outgame'},
    {letter: 'L', status: 'outgame'},
    {letter: 'M', status: 'outgame'},
    {letter: 'N', status: 'outgame'},
    {letter: 'O', status: 'outgame'},
    {letter: 'P', status: 'outgame'},
    {letter: 'Q', status: 'outgame'},
    {letter: 'R', status: 'outgame'},
    {letter: 'S', status: 'outgame'},
    {letter: 'T', status: 'outgame'},
    {letter: 'U', status: 'outgame'},
    {letter: 'V', status: 'outgame'},
    {letter: 'W', status: 'outgame'},
    {letter: 'X', status: 'outgame'},
    {letter: 'Y', status: 'outgame'},
    {letter: 'Z', status: 'outgame'}
  ];

  const alphabetBoard = () => {
    return(
      // active - ingame - outgame - used 
      <>
      {/* {alphabet} */}
        {alphabet.map((el, i) => {
            return(<span className={'game-constructor__alphBoard-btn ' + el.status} key={i}>
              {el.letter}
            </span>
            )}
        )}
      </>
    )
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
        <p className="game-sprint__translate">{listWord[indexTranslate].wordTranslate}</p>
        <p className="game-sprint__equal">=</p>
        <p className="game-sprint__word">{listWord[currentWord].word.split('').map((el) => '_ ')}</p>
      </div>
    </div>
    <div>
      {alphabetBoard()}
    </div>
    {/* <div className="game-sprint__btn-block">
      <button className="game-sprint__btn game-sprint__btn--wrong" onClick={(e) => getNextWord(e)} value={0}>не верно</button>
      <button className="game-sprint__btn game-sprint__btn--right" onClick={(e) => getNextWord(e)} value={1}>верно</button>
    </div> */}
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
