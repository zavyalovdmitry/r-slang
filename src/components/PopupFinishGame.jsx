import React from 'react';
import { PropTypes } from 'prop-types';
import restartIcon from '../assets/image/restart.png';

const PopupFinishGame = ({
  result, restart, wordsInGame, points,
}) => <div className="finish-block">
  <h2 className="finish-title">Finish</h2>
  {points > -1 ? <p className="finish-point">{points} очков</p> : null}
  <p className="finish-result">{result}/{wordsInGame || 20}</p>
  <button onClick={restart} className="finish-btn-restart">
    <img src={restartIcon} alt=""/>
  </button>
  </div>;

PopupFinishGame.propTypes = {
  result: PropTypes.number,
  restart: PropTypes.func,
  wordsInGame: PropTypes.number,
  points: PropTypes.number,
};

export default PopupFinishGame;
