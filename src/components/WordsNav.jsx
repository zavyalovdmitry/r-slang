import React from 'react';
import PropTypes from 'prop-types';

export default function WordsNav(props) {
  const {
    quantity,
    classString,
    changeVal,
    active,
  } = props;
  const arr = new Array(quantity).fill(0);
  const points = arr.map(
    (_val, index) => <li className={`menu-item${active === index ? ' active' : ''}` } key={index} onClick={() => changeVal(index)}>{index + 1}</li>,
  );

  return (
        <ul className={`menu ${classString}`}>
            {points}
        </ul>
  );
}

WordsNav.propTypes = {
  quantity: PropTypes.number.isRequired,
  changeVal: PropTypes.func.isRequired,
  classString: PropTypes.string.isRequired,
  active: PropTypes.number.isRequired,
};
