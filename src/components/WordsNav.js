import React from 'react';
import PropTypes from 'prop-types';
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
export default function WordsNav(props) {
  let arr;
  let points;
  const { active, changeVal, classString, navData, quantity } = props;

  if (navData !== undefined) {
    points = navData.map((val) => {
      const { title, value } = val;
      return (
        <li
          className={`nav-item${active === value ? ' active' : ''}`}
          key={value}
          onClick={() => changeVal(value)}
        >
          {title}
        </li>
      );
    });
  } else if (quantity !== undefined) {
    const func = (val, index) => {
      if (val) {
        return (
          <li
            className={`nav-item${active === index ? ' active' : ''}`}
            key={index}
            onClick={() => changeVal(index)}
          >
            {index + 1}
          </li>
        );
      }
      return false;
    };
    if (Array.isArray(quantity)) {
      points = quantity.map(func).filter((elem) => elem);
    } else {
      arr = new Array(quantity).fill(true);
      points = arr.map(func);
    }
  }

  return <ul className={`nav-dictionary ${classString}`}>{points}</ul>;
}

WordsNav.propTypes = {
  quantity: PropTypes.array || PropTypes.number,
  changeVal: PropTypes.func.isRequired,
  classString: PropTypes.string,
  active: PropTypes.number.isRequired,
  navData: PropTypes.array
};
