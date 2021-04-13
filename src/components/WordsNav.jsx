import React from 'react';
import PropTypes from 'prop-types';

export default function WordsNav(props) {
  let arr; let points;
  const { active, changeVal, classString } = props;
  if (props.navData !== undefined) {
    points = props.navData.map(
      (val) => {
        const { title, value } = val;
        return <li className={`nav-item${active === value ? ' active' : ''}` } key={value} onClick={() => changeVal(value)}>{title}</li>;
      },
    );
  } else if (props.quantity !== undefined) {
    const { quantity } = props;
    const func = (val, index) => {
      if (val) return <li className={`nav-item${active === index ? ' active' : ''}` } key={index} onClick={() => changeVal(index)}>{index + 1}</li>;
      return false;
    };
    if (Array.isArray(quantity)) {
      points = (quantity.map(func)).filter((elem) => elem);
    } else {
      arr = new Array(props.quantity).fill(true);
      points = arr.map(func);
    }
  }

  return (
        <ul className={`nav-dictionary ${classString}`}>
            {points}
        </ul>
  );
}

WordsNav.propTypes = {
  quantity: (PropTypes.number || PropTypes.array),
  changeVal: PropTypes.func.isRequired,
  classString: PropTypes.string,
  active: PropTypes.number.isRequired,
  navData: PropTypes.array,
};
