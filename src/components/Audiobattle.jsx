import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import LangApi from './LangApi';
import { getRandomNumber } from '../utils';
import ChooseDifficult from './ChooseDifficult';
import GameAudiobattle from './GameAudiobattle';
import Loader from './Loader';

const Audiobattle = () => {
  const [listWords, setList] = useState([]);
  const [difficult, setDifficult] = useState(0);

  useEffect(() => {
    if (difficult) {
      LangApi.getWords(difficult, getRandomNumber(1, 29))
        .then((data) => data.json())
        .then((words) => setList(words));
    }
  }, [difficult]);

  const setContent = () => {
    if (difficult) {
      if (listWords.length) {
        return <GameAudiobattle dataListWords={listWords}/>;
      }
      return <Loader/>;
    }
    return <ChooseDifficult setDifficult={setDifficult}/>;
  };

  return setContent();
};

Audiobattle.propTypes = {
  difficult: PropTypes.number,
};

export default Audiobattle;
