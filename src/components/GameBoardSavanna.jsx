import React, {
  useState, Fragment, useRef, useEffect, useContext,
} from 'react';
import { PropTypes } from 'prop-types';
import LifesIndicator from './LifesIndicator';
import { getRandomNumber, shuffleArray } from '../utils';
import SettingsContext from './SettingsContext';
import LangApi from './LangApi';

const GameBoardSavanna = ({
  life, dataListWords, changeLife, setFinish, setResult,
}) => {
  const [currentWord, changeCurrentWord] = useState(0);
  const [rightAnswers, changeRightAnswers] = useState(0);
  const wordElement = useRef(null);
  const variantsBlock = useRef(null);
  const [listWords] = useState(dataListWords);
  const context = useContext(SettingsContext);
  let idInterval;
  listWords[0].wasInGame = true;
  const getNextWord = () => {
    for (let i = 0; i < listWords.length; i += 1) {
      if (!listWords[i].wasInGame) {
        changeCurrentWord(i);
        return;
      }
    }
    setFinish(true);
  };

  const changeStatistics = (action) => {
    if (context.user.userId) {
      LangApi.updateUserWords(context.user.userId,
        context.user.token, listWords[currentWord].id, action);
    }
  };

  const changeList = () => {
    listWords[currentWord].wasInGame = true;
    getNextWord();
  };

  const checkPosition = () => {
    const heightWordElement = wordElement.current.offsetHeight;
    const positionWord = wordElement.current.getBoundingClientRect().top + heightWordElement;
    const positionVariants = variantsBlock.current.getBoundingClientRect().top;

    if (positionWord > positionVariants) {
      changeLife(life - 1);
      changeList();
    }
  };

  const changePositionWord = () => {
    const top = wordElement.current.style.top || 0;
    wordElement.current.style.top = `${parseInt(top, 10) + 1}px`;
    checkPosition();
  };

  const userChoise = (index) => {
    if (index !== currentWord) {
      changeLife(life - 1);
      changeStatistics(false);
    } else {
      changeStatistics(true);
      changeRightAnswers(rightAnswers + 1);
      setResult(rightAnswers);
    }
    changeList();
  };

  const getVariants = () => {
    const variantsList = new Set([currentWord]);
    while (variantsList.size < 4) {
      variantsList.add(getRandomNumber(0, 19));
    }
    const arrVariants = shuffleArray(Array.from(variantsList));
    return arrVariants.map((el, index) => <button
    onClick={() => userChoise(el)} key={index}>{listWords[el].wordTranslate}</button>);
  };

  const startAnimation = () => {
    wordElement.current.style.top = 0;
    idInterval = setInterval(changePositionWord, 30);
  };

  const endAnimation = () => {
    clearInterval(idInterval);
  };

  useEffect(() => {
    startAnimation();
    return endAnimation;
  }, [currentWord]);

  return <Fragment>
    <LifesIndicator lifeValue={life}/>
    <div className="game-savanna__board">
        <p className="game-savanna__current-word" ref={wordElement}>{listWords[currentWord].word}</p>
        <div className="game-savanna__variants" ref={variantsBlock}>
          {getVariants()}
        </div>
    </div>
  </Fragment>;
};

GameBoardSavanna.propTypes = {
  life: PropTypes.number,
  dataListWords: PropTypes.array,
  changeLife: PropTypes.func,
  setFinish: PropTypes.func,
  setResult: PropTypes.func,
};

export default GameBoardSavanna;
