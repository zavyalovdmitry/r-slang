import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import LangApi from './LangApi';
import { getRandomNumber } from '../utils';
import ChooseDifficult from './ChooseDifficult';
import GameConstructor from './GameConstructor';
import Loader from './Loader';

import { FullScreen, useFullScreenHandle } from "react-full-screen";

const Constructor = ({ listDictionary, inputDifficult = -1 }) => {
  const [listWords, setList] = useState(listDictionary || []);
  const [difficult, setDifficult] = useState(inputDifficult);

  const handle = useFullScreenHandle();
  const [fsMode, fsModeSet] = useState(false);

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
  listDictionary: PropTypes.array,
};

export default Constructor;
