import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import PopupFinishGame from './PopupFinishGame';
import GameBoardSprint from './GameBoardSprint';
import LangApi from './LangApi';
import { getRandomNumber } from '../utils';
import Loader from './Loader';

const GameSprint = ({ dataListWords, difficult }) => {
  const [isFinish, setFinish] = useState(false);
  const [result, setResult] = useState(0);
  const [wordsInGame, setWordsInGame] = useState(0);
  const [points, setPointsValue] = useState(0);
  let listWords = JSON.parse(JSON.stringify(dataListWords));
  const [arrPagesInGame, changeArrPages] = useState([listWords[0].page]);

  const restart = () => {
    setFinish(false);
    setResult(0);
    changeArrPages([]);
    LangApi.getWords(difficult, getRandomNumber(0, 29))
      .then((data) => data.json())
      .then((words) => {
        listWords = words;
        changeArrPages([listWords[0].page]);
      });
  };

  const setResultSprint = (words, rightAnswers, pointsGame) => {
    setResult(rightAnswers);
    setWordsInGame(words);
    setPointsValue(pointsGame);
  };

  const setContent = () => {
    if (!isFinish) {
      if (arrPagesInGame.length) {
        return <GameBoardSprint
        dataListWords={listWords}
        setFinish={setFinish}
        setResult={setResultSprint}
        arrPagesInGame={arrPagesInGame}
        difficult={difficult}/>;
      }
      return <Loader/>;
    }
    return <PopupFinishGame
    wordsInGame={wordsInGame}
    result={result}
    restart={restart}
    points={points}/>;
  };

  return <article className="h100 game game-sprint">
    {setContent()}
  </article>;
};

GameSprint.propTypes = {
  dataListWords: PropTypes.array,
  difficult: PropTypes.number,
};

export default GameSprint;
