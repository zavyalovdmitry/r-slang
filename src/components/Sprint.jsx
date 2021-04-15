import React, { useEffect, useState, useContext } from 'react';
import { PropTypes } from 'prop-types';
import LangApi from './LangApi';
import { getRandomNumber } from '../utils';
import ChooseDifficult from './ChooseDifficult';
import GameSprint from './GameSprint';
import Loader from './Loader';
import SettingsContext from './SettingsContext';

const Sprint = ({ listDictionary, inputDifficult = -1 }) => {
  const [listWords, setList] = useState(listDictionary || []);
  const [difficult, setDifficult] = useState(inputDifficult);
  const context = useContext(SettingsContext);
  useEffect(() => {
    if (difficult !== -1 && !listDictionary) {
      if (!context.user.userId) {
        LangApi.getWords(difficult, getRandomNumber(0, 29))
          .then((data) => data.json())
          .then((words) => setList(words));
      } else {
        LangApi.getRandomPageForGame(context.user.userId,
          context.user.token, 1, difficult, 30).then((words) => {
          setList(words.data);
        });
      }
    }
  }, [difficult]);

  const setContent = () => {
    if (difficult !== -1 || listDictionary) {
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
  listDictionary: PropTypes.array,
};

export default Sprint;
