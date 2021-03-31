import React, { Component } from 'react';
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import Main from './Main';
import Dictionary from './Dictionary';
import Savanna from './Savanna';
import Statisctics from './Statisctics';
import Audiobattle from './Audiobattle';
import Sprint from './Sprint';
import Ourgame from './Ourgame';
import Auth from './Auth';
import SettingsContext from './SettingsContext';

class App extends Component {
  constructor() {
    super();
    this.state = {
      wordTranslate: { value: true, title: 'отоброжать перевод слова' },
      textTranslate: { value: true, title: 'отоброжать перевод примеров' },
      deleteWord: { value: true, title: 'отоброжать кнопку "удалить слово"' },
      hardWord: { value: true, title: 'отоброжать кнопку "тяжёлое слово"' },
    };
  }

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

  render = () => {
    console.log('SettingsContext');
    console.log(SettingsContext);
    const {
      wordTranslate, textTranslate, deleteWord, hardWord,
    } = this.state;
    wordTranslate.action = this.changeWordTranslate;
    textTranslate.action = this.changeTextTranslate;
    deleteWord.action = this.changeDeleteWord;
    hardWord.action = this.changeHardWord;
    

    return (
    <SettingsContext.Provider
        value={{
          wordTranslate,
          textTranslate,
          deleteWord,
          hardWord,
        }}
      >
    <Header/>
    <main>
      <Switch>
        <Route path="/dictionary">
          <Dictionary/>
        </Route>
        <Route path="/savana">
          <Savanna/>
        </Route>
        <Route path="/statisctics">
          <Statisctics/>
        </Route>
        <Route path="/audiobattle">
          <Audiobattle/>
        </Route>
        <Route path="/sprint">
          <Sprint/>
        </Route>
        <Route path="/ourgame">
          <Ourgame/>
        </Route>
        <Route path="/auth">
          <Auth/>
        </Route>
        <Route path="/main">
          <Main/>
        </Route>
        <Redirect from='/' to='/main' />
      </Switch>
    </main>
    <Footer/>
  </SettingsContext.Provider>);
  }
}

export default App;
