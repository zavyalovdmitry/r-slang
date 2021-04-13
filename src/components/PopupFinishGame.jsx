import React from 'react';
import { PropTypes } from 'prop-types';
import restartIcon from '../assets/image/restart.png';

const PopupFinishGame = ({
  result, restart, wordsInGame, points, pointsSeries, listWord
}) => <div className="finish-block">
  <h2 className="finish-title">Игра окончена</h2>
  {points > -1 ? <p className="finish-point">{points} очков</p> : null}
  <button onClick={restart} className="finish-btn-restart">
    <img src={restartIcon} alt=""/>
  </button>
  <p className="finish-result">{result}/{wordsInGame || 20}</p>
  {pointsSeries.map((el, i) => 
    // <p key={i}>{listWord[i].word}:{el ? '&#10004;' : '&#10006;'}</p>
    <p key={i}>{listWord[i].word}{' : '}{el ? 'верно' : 'неверно'}</p>
  )}
  </div>;

PopupFinishGame.propTypes = {
  result: PropTypes.number,
  restart: PropTypes.func,
  wordsInGame: PropTypes.number,
  points: PropTypes.number,
};

export default PopupFinishGame;
