import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import PopupFinishGame from './PopupFinishGame';
import GameBoardSavanna from './GameBoardSavanna';

const GameSavanna = ({ dataListWords }) => {
  const [life, changeLife] = useState(5);
  const [isFinish, setFinish] = useState(false);
  const [result, setResult] = useState(0);

  const [pointsSeries, updatePointsSeries] = useState([]);
  const [listWord, setListWord] = useState([]);

  let listWords = JSON.parse(JSON.stringify(dataListWords));
  const restart = () => {
    setFinish(false);
    changeLife(5);
    setResult(0);
    listWords = JSON.parse(JSON.stringify(dataListWords));
  };

  return (
    <article className="h100 game game-savanna">
      {life === 0 || isFinish ? (
        <PopupFinishGame result={result} restart={restart} wordsInGame={listWords.length} />
      ) : (
        <GameBoardSavanna
          life={life}
          dataListWords={listWords}
          changeLife={changeLife}
          setFinish={setFinish}
          setResult={setResult}
        />
      )}
    </article>
  );
};

GameSavanna.propTypes = {
  dataListWords: PropTypes.array
};

export default GameSavanna;
