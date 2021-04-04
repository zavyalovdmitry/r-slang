import React from 'react';
import PropTypes from 'prop-types';

export default function WordsNav(props) {
  let arr; let points;
  const { active, changeVal, classString } = props;
  if (props.navData !== undefined) {
    points = props.navData.map(
      (val) => {
        const { title, value } = val;
        return <li className={`menu-item${active === value ? ' active' : ''}` } key={value} onClick={() => changeVal(value)}>{title}</li>;
      },
    );
  } else if (props.quantity !== undefined) {
    arr = new Array(props.quantity).fill(0);
    points = arr.map(
      (_val, index) => <li className={`menu-item${active === index ? ' active' : ''}` } key={index} onClick={() => changeVal(index)}>{index + 1}</li>,
    );
  }

  return (
        <ul className={`menu ${classString}`}>
            {points}
        </ul>
  );
}

WordsNav.propTypes = {
  quantity: PropTypes.number,
  changeVal: PropTypes.func.isRequired,
  classString: PropTypes.string,
  active: PropTypes.number.isRequired,
  navData: PropTypes.array,
};
