/* eslint-disable max-len */
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
import Constructor from './Constructor';
import SettingsContext from './SettingsContext';
import Register from './Register';
import Login from './Login';
import Profile from './Profile';
import LangApi from './LangApi';
import Loader from './Loader';

class App extends Component {
  constructor() {
    super();
    this.state = {
      wordTranslateVisible: { value: true, title: 'отоброжать перевод слова' },
      textTranslateVisible: { value: true, title: 'отоброжать перевод примеров' },
      deleteWordVisible: { value: true, title: 'отоброжать кнопку "удалить слово"' },
      hardWordVisible: { value: true, title: 'отоброжать кнопку "тяжёлое слово"' },
      user: {
        userId: false,
        token: null,
        refreshToken: null,
      },
      dataForGame: null,
    };
  }

  componentDidMount = () => {
    if (sessionStorage.getItem('auth') !== null) {
      const { userId, token, refreshToken } = JSON.parse(sessionStorage.getItem('auth'));
      this.SetlogInUser(userId, token, refreshToken);
    } else this.SetlogInUser(null, null, null);
  }

  saveSettings = () => {
    const { userId, token } = this.state.user;
    if (userId && token) {
      const optional = {
        wordTranslateVisible: this.state.wordTranslateVisible.value,
        textTranslateVisible: this.state.textTranslateVisible.value,
        deleteWordVisible: this.state.deleteWordVisible.value,
        hardWordVisible: this.state.hardWordVisible.value,
      };
      LangApi.setUserSettings(userId, token, optional);
    }
  }

  loadSettings = () => {
    const { userId, token } = this.state.user;
    LangApi.getUserSettings(userId, token)
      .then(
        (settings) => {
          if (settings) {
            const {
              wordTranslateVisible, textTranslateVisible, deleteWordVisible, hardWordVisible,
            } = settings.optional;
            this.setState((prevState) => ({
              wordTranslateVisible: {
                value: wordTranslateVisible,
                title: prevState.wordTranslateVisible.title,
              },
              textTranslateVisible: {
                value: textTranslateVisible,
                title: prevState.textTranslateVisible.title,
              },
              deleteWordVisible: {
                value: deleteWordVisible,
                title: prevState.deleteWordVisible.title,
              },
              hardWordVisible: {
                value: hardWordVisible,
                title: prevState.hardWordVisible.title,
              },
            }));
          }
        },
      );
  }

  changeWordTranslate = () => {
    this.setState((prevState) => ({
      wordTranslateVisible: {
        value: !prevState.wordTranslateVisible.value,
        title: prevState.wordTranslateVisible.title,
      },
    }), () => this.saveSettings());
  }

  changeTextTranslate = () => {
    this.setState((prevState) => ({
      textTranslateVisible: {
        value: !prevState.textTranslateVisible.value,
        title: prevState.textTranslateVisible.title,
      },
    }), () => this.saveSettings());
  }

  changeDeleteWord = () => {
    this.setState((prevState) => ({
      deleteWordVisible: {
        value: !prevState.deleteWordVisible.value,
        title: prevState.deleteWordVisible.title,
      },
    }), () => this.saveSettings());
  }

  changeHardWord = () => {
    this.setState((prevState) => ({
      hardWordVisible: {
        value: !prevState.hardWordVisible.value,
        title: prevState.hardWordVisible.title,
      },
    }), () => this.saveSettings());
  }

  SetlogInUser = (userId, token, refreshToken) => {
    this.setState({ user: { userId, token, refreshToken } },
      () => this.loadSettings());
  }

  setDataForGame = (dataForGame) => {
    this.setState({ dataForGame });
  }

  render = () => {
    const {
      // eslint-disable-next-line max-len
      wordTranslateVisible, textTranslateVisible, deleteWordVisible, hardWordVisible, user, dataForGame,
    } = this.state;
    wordTranslateVisible.action = this.changeWordTranslate;
    textTranslateVisible.action = this.changeTextTranslate;
    deleteWordVisible.action = this.changeDeleteWord;
    hardWordVisible.action = this.changeHardWord;
    user.logIn = this.SetlogInUser;

    return (
       <SettingsContext.Provider
        value={{
          wordTranslateVisible,
          textTranslateVisible,
          deleteWordVisible,
          hardWordVisible,
          user,
          setDataForGame: this.setDataForGame,
        }}
      >
        <Header />
       { user.userId !== false
         ? <main>
          <Switch>
            <Route path="/dictionary">
              <Dictionary />
            </Route>
            <Route path="/savana">
              <Savanna />
            </Route>

            <Route path="/selectedSavana">
              <Savanna listDictionary={dataForGame} inputDifficult={dataForGame && dataForGame[0] ? dataForGame[0].group : -1} />
            </Route>
            <Route path="/selectedAudiobattle">
              <Audiobattle listDictionary={dataForGame} inputDifficult={dataForGame && dataForGame[0] ? dataForGame[0].group : -1} />
            </Route>
            <Route path="/selectedSprint">
              <Sprint listDictionary={dataForGame} inputDifficult={dataForGame && dataForGame[0] ? dataForGame[0].group : -1} />
            </Route>
            <Route path="/selectedConstructor">
              <Constructor listDictionary={dataForGame} inputDifficult={dataForGame && dataForGame[0] ? dataForGame[0].group : -1} />
            </Route>

            <Route path="/statisctics">
              <Statisctics />
            </Route>
            <Route path="/audiobattle">
              <Audiobattle />
            </Route>
            <Route path="/sprint">
              <Sprint />
            </Route>
            <Route path="/constructor">
              <Constructor />
            </Route>
            <Route exact path="/register" component={Register}>
              {/* <Register/> */}
            </Route>
            <Route exact path="/auth" component={Login}>
              {/* <Login/> */}
            </Route>
            <Route exact path="/profile" component={Profile}>
              {/* <Profile/> */}
            </Route>
            <Route path="/">
              <Main />
            </Route>
            <Redirect from='/' to='/main' />
          </Switch>
        </main>
         : <Loader /> }<Footer />
      </SettingsContext.Provider>);
  }
}

export default App;
