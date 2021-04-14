import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import LangApi from './LangApi';
import { getRandomNumber } from '../utils';
import ChooseDifficult from './ChooseDifficult';
import GameAudiobattle from './GameAudiobattle';
import Loader from './Loader';

const Audiobattle = ({ listDictionary }) => {
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
        return <GameAudiobattle dataListWords={listWords}/>;
      }
      return <Loader/>;
    }
    return <ChooseDifficult setDifficult={setDifficult}/>;
  };

  return setContent();
};

Audiobattle.propTypes = {
  listDictionary: PropTypes.array,
};

export default Audiobattle;
