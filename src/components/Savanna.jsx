import React, { useEffect, useState, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import LangApi from './LangApi';
import getRandomNumber from '../utils';
import ChooseDifficult from './ChooseDifficult';
import GameSavanna from './GameSavanna';

const Savanna = () => {
  const [listWords, setList] = useState([]);
  const [difficult, setDifficult] = useState(0);

  useEffect(() => {
    if (difficult) {
      LangApi.getWords(difficult, getRandomNumber(1, 30))
        .then((data) => data.json())
        .then((words) => setList(words));
    }
  }, [difficult]);

  return <Fragment>
    { difficult > 0 && listWords.length
      ? <GameSavanna dataListWords={listWords}/> : <ChooseDifficult setDifficult={setDifficult}/>}
  </Fragment>;
};

Savanna.propTypes = {
  difficult: PropTypes.number,
};

export default Savanna;
