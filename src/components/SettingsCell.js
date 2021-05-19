import React from 'react';
import PropTypes from 'prop-types';

export default function SettingsCell(props) {
  const { data } = props;
  const { value, title, action } = data;

  return (
    <li>
      <label htmlFor="settings">
        {title}
        <input type="checkbox" onChange={action} checked={value} />
      </label>
    </li>
  );
}

SettingsCell.propTypes = {
  data: PropTypes.object.isRequired
};
