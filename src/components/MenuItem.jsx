import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const MenuItem = ({ dataLink }) => (
 <li className={dataLink.isAuth ? 'menu-item menu-item--auth' : 'menu-item'}>
     <NavLink
      activeStyle={{
        border: '1px solid #fff',
      }}
     to={dataLink.link}
     className='menu-link'>{dataLink.name}</NavLink>
 </li>
);

MenuItem.propTypes = {
  dataLink: PropTypes.object,
};

export default MenuItem;
