/* eslint-disable no-underscore-dangle */
import React, {
  useState, useEffect, useContext,
} from 'react';
import { PropTypes } from 'prop-types';
import { getRandomNumber } from '../utils';
import LangApi from './LangApi';
import SettingsContext from './SettingsContext';

const GameBoardSprint = ({
  dataListWords, setFinish, setResult, arrPagesInGame, difficult,
}) => {
  const [currentWord, changeCurrentWord] = useState(0);
  const [time, setTime] = useState(60);
  const [result, changeRightAnswer] = useState(0);
  const [indexTranslate, setIndexTranslate] = useState(0);
  const [points, setPointsValue] = useState(0);
  const listWord = dataListWords;
  const arrPages = arrPagesInGame;
  const context = useContext(SettingsContext);
  let timer;
  const [pointsSeries, updatePointsSeries] = useState([]);

  const changeStatistics = (action) => {
    if (context.user.userId) {
      LangApi.updateUserWords(context.user.userId,
        context.user.token, listWord[currentWord]._id, action, null, 'game-1');
    }
  };

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
      changeStatistics(true);
      updatePointsSeries([...pointsSeries, true]);
    } else {
      changeStatistics(false);
      updatePointsSeries([...pointsSeries, false]);
    }
  };

  const getNextWord = (e) => {
    console.log(currentWord);
    if (currentWord % 10 === 0 && currentWord !== 0) {
      let indexNextPage = getRandomNumber(0, 29);
      while (arrPages.indexOf(indexNextPage) !== -1) {
        indexNextPage = getRandomNumber(0, 29);
      }
      if (context.user.userId) {
        LangApi.getRandomPageForGame(context.user.userId,
          context.user.token, 2, difficult, 30).then((words) => {
          console.log(words.data);
          listWord.push(...words.data);
          arrPages.push(words[0].page);
        });
      } else {
        LangApi.getWords(difficult, indexNextPage)
          .then((data) => data.json())
          .then((words) => {
            listWord.push(...words);
            console.log(words);
            arrPages.push(words[0].indexNextPage);
          });
      }
    }
    setPoints(+e.target.value);
    changeCurrentWord(currentWord + 1);
  };

  const startTimer = () => {
    timer = setInterval(() => {
      setTime((timeNow) => timeNow - 1);
    }, 1000);
  };

  const endTimer = () => {
    clearInterval(timer);
  };

  useEffect(() => {
    startTimer();
    return endTimer;
  }, []);

  useEffect(() => {
    if (time === 0) {
      setResult(currentWord, result, points, pointsSeries, listWord);
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
        <p className="game-sprint__word">{listWord[currentWord].word}</p>
        <p className="game-sprint__equal">=</p>
        <p className="game-sprint__translate">{listWord[indexTranslate].wordTranslate}</p>
      </div>
    </div>
    <div className="game-sprint__btn-block">
      <button className="game-sprint__btn game-sprint__btn--wrong" onClick={(e) => getNextWord(e)} value={0}>не верно</button>
      <button className="game-sprint__btn game-sprint__btn--right" onClick={(e) => getNextWord(e)} value={1}>верно</button>
    </div>
    <p className="timer">
      {time}
    </p>
  </article>;
};

GameBoardSprint.propTypes = {
  dataListWords: PropTypes.array,
  setFinish: PropTypes.func,
  setResult: PropTypes.func,
  arrPagesInGame: PropTypes.array,
  difficult: PropTypes.number,
};

export default GameBoardSprint;
