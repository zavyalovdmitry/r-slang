import React from 'react';

const Whowe = () => (
  <article className="whowe">
    <h2 className="whowe-title">Кто мы?</h2>
    <p className="whowe-sub-title">Мы гениальные и скромные разработчики:</p>
    <div className="whowe-content">
      <a href="https://github.com/antoniosk10" className="whowe-item sliding-button">
        <h3>Anton Skorobogaty</h3>
        <p>Дизайн, общая структура, разработка компонентов</p>
      </a>
      <a href="https://github.com/fpastl" className="whowe-item sliding-button">
        <h3>Stas Smoliar</h3>
        <p>Разработка учебника, разработка компонентов</p>
      </a>
      <a href="https://github.com/zavyalovdmitry" className="whowe-item sliding-button">
        <h3>Dmitry Zavyalov</h3>
        <p>Авторизация, бэкэнд, разработка компонентов</p>
      </a>
    </div>
  </article>
);

export default Whowe;
