import React, { Component } from 'react';

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import SettingsContext from './SettingsContext';
import LangApi from './LangApi';
import TestEnter from './TestEnter';
/* eslint-disable */
const required = (value) => {
  const message = !value ? (
    <div className="alert alert-danger" role="alert">
      Данное поле обязательно для заполнения!
    </div>
  ) : null;
  return message;
};

export default class Login extends Component {
  static contextType = SettingsContext;

  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      email: '',
      password: '',
      loading: false,
      message: ''
    };
  }

  handleLogin(e) {
    const { email, password } = this.state;
    const { user } = this.context;
    const { history } = this.props;

    e.preventDefault();

    this.setState({
      message: '',
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      LangApi.user(
        {
          email,
          password
        },
        LangApi.userApiLog
      ).then(
        (loginData) => {
          sessionStorage.removeItem('auth');
          sessionStorage.setItem('auth', JSON.stringify(loginData));
          user.logIn(loginData.userId, loginData.token);
          history.push('/profile');
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
          this.setState({
            loading: false,
            message: 'Неверный email или пароль.'
          });
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  render() {
    const { history } = this.props;
    const { email, password, loading, message } = this.state;

    return (
      <>
        <div className="col-md-12">
          <div className="card card-container">
            <img
              src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
              alt="profile-img"
              className="profile-img-card"
            />

            <Form
              history={history}
              onSubmit={this.handleLogin}
              ref={(c) => {
                this.form = c;
              }}
            >
              <div className="form-group">
                <label htmlFor="username">Email</label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={this.onChangeEmail}
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={this.onChangePassword}
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading && <span className="spinner-border spinner-border-sm" />}
                  <span>Вход</span>
                </button>
              </div>

              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
              <CheckButton
                style={{ display: 'none' }}
                ref={(c) => {
                  this.checkBtn = c;
                }}
              />
            </Form>
          </div>
        </div>
        <TestEnter />
      </>
    );
  }
}
