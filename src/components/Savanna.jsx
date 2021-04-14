import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import LangApi from './LangApi';
import { getRandomNumber } from '../utils';
import ChooseDifficult from './ChooseDifficult';
import GameSavanna from './GameSavanna';
import Loader from './Loader';

const Savanna = ({ listDictionary }) => {
  const [listWords, setList] = useState(listDictionary || []);
  const [difficult, setDifficult] = useState(-1);

  useEffect(() => {
    if (difficult !== -1 && !listDictionary) {
      LangApi.getWords(difficult, getRandomNumber(0, 29))
        .then((data) => data.json())
        .then((words) => setList(words));
    }
  }, [difficult]);

  const setContent = () => {
    if (difficult !== -1 || listDictionary) {
      if (listWords.length) {
        return <GameSavanna dataListWords={listWords}/>;
      }
      return <Loader/>;
    }
    return <ChooseDifficult setDifficult={setDifficult}/>;
  };

  return setContent();
};

Savanna.propTypes = {
  listDictionary: PropTypes.array,
};

export default Savanna;
