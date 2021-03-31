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
      wordTranslateVisible: { value: true, title: 'отоброжать перевод слова' },
      textTranslateVisible: { value: true, title: 'отоброжать перевод примеров' },
      deleteWordVisible: { value: true, title: 'отоброжать кнопку "удалить слово"' },
      hardWordVisible: { value: true, title: 'отоброжать кнопку "тяжёлое слово"' },
    };
  }

  changeWordTranslate = () => {
    this.setState((prevState) => ({
      wordTranslateVisible: {
        value: !prevState.wordTranslateVisible.value,
        title: prevState.wordTranslateVisible.title,
      },
    }));
  }

  changeTextTranslate = () => {
    this.setState((prevState) => ({
      textTranslateVisible: {
        value: !prevState.textTranslateVisible.value,
        title: prevState.textTranslateVisible.title,
      },
    }));
  }

  changeDeleteWord = () => {
    this.setState((prevState) => ({
      deleteWordVisible: {
        value: !prevState.deleteWordVisible.value,
        title: prevState.deleteWordVisible.title,
      },
    }));
  }

  changeHardWord = () => {
    this.setState((prevState) => ({
      hardWordVisible: {
        value: !prevState.hardWordVisible.value,
        title: prevState.hardWordVisible.title,
      },
    }));
  }

  render = () => {
    console.log('SettingsContext');
    console.log(SettingsContext);
    const {
      wordTranslateVisible, textTranslateVisible, deleteWordVisible, hardWordVisible,
    } = this.state;
    wordTranslateVisible.action = this.changeWordTranslate;
    textTranslateVisible.action = this.changeTextTranslate;
    deleteWordVisible.action = this.changeDeleteWord;
    hardWordVisible.action = this.changeHardWord;

    return (
    <SettingsContext.Provider
        value={{
          wordTranslateVisible,
          textTranslateVisible,
          deleteWordVisible,
          hardWordVisible,
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
