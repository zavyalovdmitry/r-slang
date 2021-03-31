import React from 'react';
import PropTypes from 'prop-types';

export default function SettingsCell(props) {
  const {
    value, title, action,
  } = props.data;

  return (
    <li>
    <label>{title}
        <input type="checkbox" onClick={action} checked={value} />
    </label>
</li>
  );
}

SettingsCell.propTypes = {
  data: PropTypes.object.isRequired,
};
