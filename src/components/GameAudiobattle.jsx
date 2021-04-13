import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import PopupFinishGame from './PopupFinishGame';
import GameBoardAudiobattle from './GameBoardAudiobattle';

const GameAudiobattle = ({ dataListWords }) => {
  const [isFinish, setFinish] = useState(false);
  const [result, setResult] = useState(0);

  const [pointsSeries, updatePointsSeries] = useState([]);
  const [listWord, setListWord] = useState([]);

  let listWords = JSON.parse(JSON.stringify(dataListWords));

  const restart = () => {
    setFinish(false);
    setResult(0);
    listWords = JSON.parse(JSON.stringify(dataListWords));
  };

  return <article className="h100 game game-audio">
    { isFinish ? <PopupFinishGame
    result={result}
    restart={restart}/>
      : <GameBoardAudiobattle
    dataListWords={listWords}
    setFinish={setFinish}
    setResult={setResult}/> }
  </article>;
};

GameAudiobattle.propTypes = {
  dataListWords: PropTypes.array,
};

export default GameAudiobattle;
