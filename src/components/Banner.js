import React from 'react';
import Logo from './Logo';
import arrow from '../assets/image/arrow.png';

const Banner = () => (
  <article className="banner">
    <div className="banner-logo">
      <Logo />
    </div>
    <h2 className="banner-sub-title">Говори правильно!</h2>
    <div className="banner-content-text">
      <p className="banner-text banner-text--cross-out">Герара хир</p>
      <p className="banner-text">Get out of here</p>
    </div>
    <a href="#advantages" className="banner-link">
      <img src={arrow} alt="go" />
    </a>
  </article>
);

export default Banner;
