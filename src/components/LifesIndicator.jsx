import React from 'react';
import { PropTypes } from 'prop-types';
import heart from '../assets/image/heart.svg';
import heartFill from '../assets/image/heart-fill.svg';

const LifesIndicator = ({ lifeValue }) => {
  const arrEmpty = new Array(5 - lifeValue).fill(null);
  const arrFill = new Array(lifeValue).fill(null);

  return <div className="game-savanna__life">
    {arrFill.map((el, index) => <img key={index} src={heartFill} alt="empty-life"/>)}
    {arrEmpty.map((el, index) => <img key={index} src={heart} alt="empty-life"/>)}
  </div>;
};

LifesIndicator.propTypes = {
  lifeValue: PropTypes.number,
};

export default LifesIndicator;
