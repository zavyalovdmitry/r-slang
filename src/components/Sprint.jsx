import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import LangApi from './LangApi';
import { getRandomNumber } from '../utils';
import ChooseDifficult from './ChooseDifficult';
import GameSprint from './GameSprint';
import Loader from './Loader';

const Sprint = () => {
  const [listWords, setList] = useState([]);
  const [difficult, setDifficult] = useState(-1);

  useEffect(() => {
    if (difficult !== -1) {
      LangApi.getWords(difficult, getRandomNumber(0, 29))
        .then((data) => data.json())
        .then((words) => setList(words));
    }
  }, [difficult]);

  const setContent = () => {
    if (difficult !== -1) {
      if (listWords.length) {
        return <GameSprint dataListWords={listWords} difficult={difficult}/>;
      }
      return <Loader/>;
    }
    return <ChooseDifficult setDifficult={setDifficult}/>;
  };

  return setContent();
};

Sprint.propTypes = {
  difficult: PropTypes.number,
};

export default Sprint;
