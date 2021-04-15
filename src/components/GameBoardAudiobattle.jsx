/* eslint-disable no-underscore-dangle */
import React, {
  useState, Fragment, useEffect, useRef, useContext,
} from 'react';
import { PropTypes } from 'prop-types';
import {
  getRandomNumber, shuffleArray, playSound, PATH_API,
} from '../utils';
import sound from '../assets/image/sound.png';
import arrow from '../assets/image/next-arrow.png';
import SettingsContext from './SettingsContext';
import LangApi from './LangApi';

const GameBoardAudiobattle = ({
  dataListWords, setFinish, setResult,
}) => {
  const [currentWord, changeCurrentWord] = useState(0);
  const [rightAnswers, changeRightAnswers] = useState(0);
  const [listWords] = useState(dataListWords);
  const [isChoose, changeConditionChoose] = useState(false);
  const variantsBlock = useRef(null);
  const context = useContext(SettingsContext);
  listWords[0].wasInGame = true;

  const changeStatistics = (action) => {
    if (context.user.userId) {
      LangApi.updateUserWords(context.user.userId,
        context.user.token, listWords[currentWord]._id, action, null, 'game-3');
    }
  };

  const getVariants = () => {
    const variantsList = new Set([currentWord]);
    while (variantsList.size < 5) {
      variantsList.add(getRandomNumber(0, 19));
    }
    const arrVariants = shuffleArray(Array.from(variantsList));
    return arrVariants;
  };

  const [currentVariants, changeStateVariants] = useState(getVariants());

  const changeVariants = () => {
    changeStateVariants(getVariants());
  };

  const getNextWord = () => {
    for (let i = 0; i < listWords.length; i += 1) {
      if (!listWords[i].wasInGame) {
        changeCurrentWord(i);
        return;
      }
    }
    setFinish(true);
  };

  const changeList = () => {
    listWords[currentWord].wasInGame = true;
    getNextWord();
    changeConditionChoose(false);
  };

  const cleanVariantsStyle = () => {
    const arrVariatsElem = variantsBlock.current.querySelectorAll('button');
    arrVariatsElem.forEach((el) => {
      el.classList.remove('right', 'wrong');
    });
  };

  const userChoise = (e, index) => {
    if (index === currentWord) {
      changeStatistics(true);
      e.target.classList.add('right');
      changeRightAnswers(rightAnswers + 1);
    } else {
      changeStatistics(false);
      e.target.classList.add('wrong');
    }
    changeConditionChoose(true);
  };

  useEffect(() => {
    playSound(listWords[currentWord].audio);
    changeVariants();
    cleanVariantsStyle();
  }, [currentWord]);

  useEffect(() => {
    setResult(rightAnswers);
  }, [rightAnswers]);

  return <Fragment>
    <div className="game-audio__board">
    <div className="word-info">
      {isChoose ? <div className="word-info__inner"><div className="word-info__img-wrap">
              <img src={`${PATH_API}${listWords[currentWord].image}`} alt=""/>
            </div>
            <div className="word-info__gap">
              <button className="sound" onClick={() => playSound(listWords[currentWord].audio)}>
              <img src={sound} alt="sound"/>
              </button>
              <p className="word-info__text">{listWords[currentWord].word}</p>
            </div>
            </div>
        : <button className="sound" onClick={() => playSound(listWords[currentWord].audio)}>
          <img src={sound} alt="sound"/>
        </button>}
        </div>

        <div className={isChoose ? 'game-audio__variants disabled' : 'game-audio__variants'} ref={variantsBlock}>
          {currentVariants.map((el, index) => <button
    onClick={(e) => userChoise(e, el)} key={index}>{listWords[el].wordTranslate}</button>)}
        </div>
        <button className={isChoose ? 'game-audio__btn game-audio__btn--next' : 'game-audio__btn'} onClick={changeList}>
          {isChoose ? <img src={arrow} alt="next"/> : 'не знаю'}
        </button>
    </div>
  </Fragment>;
};

GameBoardAudiobattle.propTypes = {
  dataListWords: PropTypes.array,
  changeLife: PropTypes.func,
  setFinish: PropTypes.func,
  setResult: PropTypes.func,
};

export default GameBoardAudiobattle;
