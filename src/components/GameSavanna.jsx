import React, { useState } from 'react';
import { PropTypes } from 'prop-types';

import PopupFinishGame from './PopupFinishGame';
import GameBoardSavanna from './GameBoardSavanna';

const GameSavanna = ({ dataListWords }) => {
  const [life, changeLife] = useState(5);
  const [isFinish, setFinish] = useState(false);

  return <article className="game-savanna">
    { life === 0 || isFinish ? <PopupFinishGame/> : <GameBoardSavanna life={life}
    dataListWords={dataListWords}
    changeLife={changeLife}
    setFinish={setFinish}/> }
  </article>;
};

GameSavanna.propTypes = {
  dataListWords: PropTypes.array,
};

export default GameSavanna;
