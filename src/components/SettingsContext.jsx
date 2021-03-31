import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const SettingsContext = React.createContext();

export default class SettingsContextProvider extends Component {
  state = {
    wordTranslate: { value: true, title: 'отоброжать перевод слова' },
    textTranslate: { value: true, title: 'отоброжать перевод примеров' },
    deleteWord: { value: true, title: 'отоброжать кнопку "удалить слово"' },
    hardWord: { value: true, title: 'отоброжать кнопку "тяжёлое слово"' },
  };

  changeWordTranslate = () => {
    this.setState((prevState) => ({
      wordTranslate: {
        value: !prevState.wordTranslate.value,
        title: prevState.wordTranslate.title,
      },
    }));
  }

  changeTextTranslate = () => {
    this.setState((prevState) => ({
      textTranslate: {
        value: !prevState.textTranslate.value,
        title: prevState.textTranslate.title,
      },
    }));
  }

  changeDeleteWord = () => {
    this.setState((prevState) => ({
      deleteWord: {
        value: !prevState.deleteWord.value,
        title: prevState.deleteWord.title,
      },
    }));
  }

  changeHardWord = () => {
    this.setState((prevState) => ({
      hardWord: {
        value: !prevState.hardWord.value,
        title: prevState.hardWord.title,
      },
    }));
  }

  render() {
    const {
      wordTranslate, textTranslate, deleteWord, hardWord,
    } = this.state;
    wordTranslate.action = this.changeWordTranslate;
    textTranslate.action = this.changeTextTranslate;
    deleteWord.action = this.changeDeleteWord;
    hardWord.action = this.changeHardWord;
    console.log('SettingsContext');
    console.log(SettingsContext);
    return (
      <SettingsContext.Provider
        value={{
          wordTranslate,
          textTranslate,
          deleteWord,
          hardWord,
        }}
      >
        {this.props.children}
      </SettingsContext.Provider>
    );
  }
}

SettingsContextProvider.propTypes = {
  children: PropTypes.object,
};
