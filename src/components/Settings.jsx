import React, { Component } from 'react';
import SettingsContext from './SettingsContext';
import SettingsCell from './SettingsCell';

export default class Settings extends Component {
    static contextType = SettingsContext;

    render = () => {
      const {
        wordTranslateVisible, textTranslateVisible, deleteWordVisible, hardWordVisible,
      } = this.context;

      return (<div className='settings-block'>
            <h2 className='settings-block__title'>Настройки</h2>
            <ul>
               <SettingsCell data={wordTranslateVisible} />
               <SettingsCell data={textTranslateVisible} />
               <SettingsCell data={deleteWordVisible} />
               <SettingsCell data={hardWordVisible} />
            </ul>
            </div>
      );
    }
}
