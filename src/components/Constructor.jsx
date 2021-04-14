import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import LangApi from './LangApi';
import { getRandomNumber } from '../utils';
import ChooseDifficult from './ChooseDifficult';
import GameConstructor from './GameConstructor';
import Loader from './Loader';

import { FullScreen, useFullScreenHandle } from "react-full-screen";

const Constructor = () => {
  const [listWords, setList] = useState([]);
  const [difficult, setDifficult] = useState(-1);

  const handle = useFullScreenHandle();
  const [fsMode, fsModeSet] = useState(false);

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
        return <FullScreen handle={handle} className='FS'>
                <GameConstructor 
                  dataListWords={listWords} 
                  difficult={difficult}
                  fsMode={fsMode} 
                  fullscreen={handle.enter}/>
              </FullScreen>
      }
      return <Loader/>;
    }
    return <ChooseDifficult setDifficult={setDifficult}/>;
  };

  return setContent();
};

Constructor.propTypes = {
  difficult: PropTypes.number,
};

export default Constructor;
