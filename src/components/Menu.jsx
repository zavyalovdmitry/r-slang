import React from 'react';
import MENU from '../constants';
import MenuItem from './MenuItem';

const Menu = () => (
  <ul className='menu'>
      {MENU.map((el, index) => <MenuItem key={index} dataLink={el}/>)}
  </ul>
);

export default Menu;
