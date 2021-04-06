import React, { Component } from 'react';
import SettingsContext from './SettingsContext';
import SettingsCell from './SettingsCell';

export default class Settings extends Component {
    static contextType = SettingsContext;

    render = () => {
      const {
        wordTranslateVisible, textTranslateVisible, deleteWordVisible, hardWordVisible,
      } = this.context;

      return (
            <ul className='settings-block'>
               <SettingsCell data={wordTranslateVisible} />
               <SettingsCell data={textTranslateVisible} />
               <SettingsCell data={deleteWordVisible} />
               <SettingsCell data={hardWordVisible} />
            </ul>
      );
    }
}
