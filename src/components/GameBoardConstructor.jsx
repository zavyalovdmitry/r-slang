import React, {
  useState, useEffect, useContext
} from 'react';
import { PropTypes } from 'prop-types';
import { getRandomNumber } from '../utils';
import SettingsContext from './SettingsContext';
import LangApi from './LangApi';

const GameBoardConstructor = ({
  dataListWords, setFinish, setResult, arrPagesInGame, difficult,
}) => {
  const [currentWord, changeCurrentWord] = useState(0);
  const [time, setTime] = useState(90);
  const [result, changeRightAnswer] = useState(0);
  const [indexTranslate, setIndexTranslate] = useState(0);
  const [points, setPointsValue] = useState(0);
  const context = useContext(SettingsContext);
  const [pointsSeries, updatePointsSeries] = useState([]);

  const listWord = dataListWords;
  const arrPages = arrPagesInGame;
  let timer;

  const [currentUserWord, updateUserWord] = useState(['_']);
  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g' ,'h', 'i', 'j', 'k', 'l',
                    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  const alphabetBoard = () => {
    return(
      <>
        {alphabet.map((el, i) => {
            return(<span className={'game-constructor__alphBoard-btn ' + 
                          (checkLetter(el) ? 'active' : 'outgame')} 
                          key={i}
                          onClick={checkLetter(el) ? (e) => addLetter(e, el) : null}
                    >
              {el}
            </span>
            )}
        )}
      </>
    )
  }

  // useEffect(() => {
  //   document.addEventListener('keydown', 
  //     (e) => checkLetter(e.key) ? addLetter(e, e.key) : null
  //   );
  // }, []);

  const changeStatistics = (action) => {
    if (context.user.userId) {
      LangApi.updateUserWords(context.user.userId,
        context.user.token, listWord[currentWord].id, action, null, 'game-4');
    }
  };

  const checkLetter = (letter) => {
    return(
            listWord[currentWord].word.split('').filter((el) => el === letter).length >
            currentUserWord.filter((el) => el === letter).length
    );
  }

  const addLetter = (e, letter) => {
    let arr = currentUserWord;
    arr[currentUserWord.indexOf('_')] = letter;
    updateUserWord([...arr]);
    console.log(currentUserWord);
  }

  useEffect(() => {
    updateUserWord(listWord[currentWord].word.split('').map(() => '_'))
  }, [currentWord]);

  const getRandomIndex = () => {
    let indexWord = getRandomNumber(0, listWord.length - 1);
    while (indexWord === currentWord) {
      indexWord = getRandomNumber(0, listWord.length - 1);
    }
    return indexWord;
  };

  const setPoints = () => {
    if (listWord[currentWord].word === currentUserWord.join('')) {
      setPointsValue(points + arrPages.length * 10);
      changeRightAnswer(result + 1);
      changeStatistics(true);
    } else {
      changeStatistics(false);
    }
    updatePointsSeries([...pointsSeries, listWord[currentWord].word === currentUserWord.join('')]);
    console.log(listWord[currentWord].word);
    console.log(currentUserWord.join(''));
    console.log(pointsSeries);
  };

  const delLetter = (e) => {
    let arr = currentUserWord;
    arr[currentUserWord.indexOf('_') - 1] = '_';
    updateUserWord([...arr]);
  }

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
    setPoints();
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
      <p className="game-sprint__plus">двойной клик для перехода в полный экран</p>
      <div className="game-sprint__words-block">
        <p className="game-sprint__translate">{listWord[currentWord].wordTranslate}</p>
        <p className="game-sprint__equal">=</p>
        <p className="game-sprint__word">{currentUserWord.map((el) => el + ' ')}</p>
      </div>
    </div>
    <div>
      {alphabetBoard()}
    </div>
    <div className="game-sprint__btn-block">
      <button className="game-sprint__btn game-sprint__btn--wrong" onClick={(e) => delLetter(e)}>{'удалить букву'}</button>
      <button className="game-sprint__btn game-sprint__btn--right" onClick={(e) => getNextWord(e)}>{'следующее слово'}</button>
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
