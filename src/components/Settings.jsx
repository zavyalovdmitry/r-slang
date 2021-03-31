import React, { Component } from 'react';
import SettingsContext from './SettingsContext';
import SettingsCell from './SettingsCell';

export default class Settings extends Component {
    static contextType = SettingsContext;

    render = () => {
      console.log('this.context');
      console.log(this.context);
      console.log('SettingsContext');
      console.log(SettingsContext);
      /* const {
        wordTranslate, textTranslate, deleteWord, hardWord,
      } = this.context.value; */

      return (
            <ul className='menu'>
               <li>123</li>
               {
                   /* <SettingsCell data={wordTranslate} />
               <SettingsCell data={textTranslate} />
               <SettingsCell data={deleteWord} />
               <SettingsCell data={hardWord} /> */
               }
            </ul>
      );
    }
}
