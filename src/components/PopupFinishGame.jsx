import React from 'react';
import { PropTypes } from 'prop-types';
import restartIcon from '../assets/image/restart.png';

const PopupFinishGame = ({ result, restart }) => <div className="finish-block">
  <h2 className="finish-title">Finish</h2>
  <p className="finish-result">{result}/20</p>
  <button onClick={restart} className="finish-btn-restart">
    <img src={restartIcon} alt=""/>
  </button>
  </div>;

PopupFinishGame.propTypes = {
  result: PropTypes.number,
  restart: PropTypes.func,
};

export default PopupFinishGame;
