import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import LifesIndicator from './LifesIndicator';
import getRandomNumber from '../utils';

const GameSavanna = ({ dataListWords }) => {
  const [life, changeLife] = useState(5);
  // const [isFinish, setFinish] = useState(false);
  // const [listWords, changeListWords] = useState(dataListWords);
  const listWords = dataListWords;
  const [currentWord, changeCurrentWord] = useState(0);
  listWords[0].wasInGame = true;
  const getNextWord = () => {
    for (let i = 0; i < listWords.length; i += 1) {
      if (!listWords[i].wasInGame) {
        changeCurrentWord(i);
      }
    }
  };

  const changeList = () => {
    listWords[currentWord].wasInGame = true;
    getNextWord();
  };

  const getVariants = () => {
    const variantsList = new Set([currentWord]);
    while (variantsList.size < 4) {
      variantsList.add(getRandomNumber(0, 19));
    }
    const arrVariants = Array.from(variantsList);
    return arrVariants.map((el, index) => <button
    onClick={() => changeList()} key={index}>{listWords[el].wordTranslate}</button>);
  };

  return <article className="game-savanna">
    {/* {isFinish ? <PopupFinishGame/> : null} */}
    <LifesIndicator lifeValue={life}/>
    <div className="game-savanna__board">
        <p className="game-savanna__current-word">{listWords[currentWord].word}</p>
        <div className="game-savanna__variants">
          {getVariants()}
        </div>
    </div>
  </article>;
};

GameSavanna.propTypes = {
  dataListWords: PropTypes.array,
};

export default GameSavanna;
