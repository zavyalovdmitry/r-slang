import React from 'react';
import { PropTypes } from 'prop-types';
import restartIcon from '../assets/image/restart.png';
import right from '../assets/image/right.png';
import wrong from '../assets/image/wrong.png';
/* eslint-disable */
const PopupFinishGame = ({ result, restart, wordsInGame, points, pointsSeries, listWord }) => (
  <div className="finish-block">
    <h2 className="finish-title">Игра окончена</h2>
    {points > -1 ? <p className="finish-point">{points} очков</p> : null}
    <button type="button" onClick={restart} className="finish-btn-restart">
      <img src={restartIcon} alt="" />
    </button>
    <p className="finish-result">
      {result}/{wordsInGame || 20}
    </p>
    <div className="gameResults">
      {pointsSeries !== undefined
        ? pointsSeries.map((el, i) => (
          <span className="gameResult" key={i}>
            <img src={el ? right : wrong} width="25" alt="results" />
            {` ${listWord[i].word}`}
            {' = '}
            {listWord[i].wordTranslate}
          </span>
        ))
        : ''
      }
    </div>
  </div>
);

PopupFinishGame.propTypes = {
  result: PropTypes.number,
  restart: PropTypes.func,
  wordsInGame: PropTypes.number,
  points: PropTypes.number
};

export default PopupFinishGame;
