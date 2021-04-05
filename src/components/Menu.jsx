import React from 'react';
import MENU from '../constants';
import MenuItem from './MenuItem';

const Menu = () => (
  <ul className='menu'>
      {MENU.map((el, index) => 
        (sessionStorage.auth && el.isAuth) ? 
        '' :
        (!sessionStorage.auth && el.isUsers) ?
        '' :
        <MenuItem key={index} dataLink={el}/>)}
  </ul>
);

export default Menu;
