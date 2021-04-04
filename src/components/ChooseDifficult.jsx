import React from 'react';
import { PropTypes } from 'prop-types';
import DifficultItem from './DifficultItem';

const ChooseDifficult = ({ setDifficult }) => {
  const difficultList = new Array(6).fill(0).map((el, index) => index);

  return <article className="h100 choose-difficult">
    <h2 className="choose-difficult__title">Выбери сложность игры:</h2>
    <ul className="choose-difficult__list">
      {difficultList.map((el, index) => <DifficultItem
        difficultValue={el} key={index} setDifficult={setDifficult}/>)}
    </ul>
</article>;
};

ChooseDifficult.propTypes = {
  setDifficult: PropTypes.func,
};

export default ChooseDifficult;
