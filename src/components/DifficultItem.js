import React from 'react';
import { PropTypes } from 'prop-types';

const DifficultItem = ({ difficultValue, setDifficult }) => (
  <li className="choose-difficult__item">
    <button
      className="choose-difficult__btn"
      onClick={() => setDifficult(difficultValue)}
      type="button"
    >
      {difficultValue + 1}
    </button>
  </li>
);

DifficultItem.propTypes = {
  difficultValue: PropTypes.number,
  setDifficult: PropTypes.func
};

export default DifficultItem;
