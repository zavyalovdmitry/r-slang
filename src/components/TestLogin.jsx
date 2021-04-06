import React, { Component, Fragment } from 'react';
import LangApi from './LangApi';
import SettingsContext from './SettingsContext';

export default class TestLogin extends Component {
  static contextType = SettingsContext;

  login = () => {
    const login = 'test@test.by';
    const password = 'test1234';
    LangApi.TestLogIn(login, password).then((data) => data.json())
      .then((loginData) => {
        sessionStorage.removeItem('auth');
        sessionStorage.setItem('auth', JSON.stringify(loginData));
        this.context.user.logIn(loginData.userId, loginData.token);
      });
  }

    render = () => {
      const userKeys = JSON.parse(sessionStorage.getItem('auth'));
      return (
        <Fragment>
      <button onClick={this.login} >TEST LOGIN</button>
            <button
            onClick={() => LangApi.updateUserWords(userKeys.userId, userKeys.token, '5e9f5ee35eb9e72bc21af543', '', true) } >
              TEST QUERY
            </button>
            <button
            onClick={() => LangApi.getUserWordsWithFilter(userKeys.userId, userKeys.token, 1, 0) } >
              TEST getuserwordfilter
            </button>
            </Fragment>);
    }
}
