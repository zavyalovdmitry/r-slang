import React, { useEffect, useState, useContext } from 'react';
import { PropTypes } from 'prop-types';
import PopupFinishGame from './PopupFinishGame';
import GameBoardConstructor from './GameBoardConstructor';
import LangApi from './LangApi';
import { getRandomNumber } from '../utils';
import Loader from './Loader';
import SettingsContext from './SettingsContext';

const GameConstructor = ({
  dataListWords, difficult, fsMode, fullscreen,
}) => {
  const [isFinish, setFinish] = useState(false);
  const [result, setResult] = useState(0);
  const [wordsInGame, setWordsInGame] = useState(0);
  const [points, setPointsValue] = useState(0);

  const [pointsSeries, updatePointsSeries] = useState([]);
  const [listWord, setListWord] = useState([]);

  const context = useContext(SettingsContext);

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

  useEffect(() => {
    document.getElementById('game-constructor-field').addEventListener('dblclick', fullscreen);
    // return endTimer;
  }, []);

  const setResultSprint = (words, rightAnswers, pointsGame, pointsSeries, listWord) => {
    setResult(rightAnswers);
    setWordsInGame(words);
    setPointsValue(pointsGame);
    updatePointsSeries(pointsSeries);
    setListWord(listWord);
  };

  const setContent = () => {
    if (!isFinish) {
      if (arrPagesInGame.length) {
        return <GameBoardConstructor
        dataListWords={listWords}
        setFinish={setFinish}
        setResult={setResultSprint}
        arrPagesInGame={arrPagesInGame}
        difficult={difficult}/>;
      }
      return <Loader/>;
    }
    LangApi.updateGameStatistic(context.user.userId, context.user.token, 'game-4', pointsSeries);
    return <PopupFinishGame
    wordsInGame={wordsInGame}
    result={result}
    restart={restart}
    points={points}
    pointsSeries={pointsSeries}
    listWord={listWord}/>;
  };

  return <article className="h100 game game-constructor" id="game-constructor-field">
    {setContent()}
  </article>;
};

GameConstructor.propTypes = {
  dataListWords: PropTypes.array,
  difficult: PropTypes.number,
};

export default GameConstructor;
