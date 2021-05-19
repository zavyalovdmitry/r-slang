import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React, { Component } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import { isEmail } from 'validator';
import LangApi from './LangApi';
import TestEnter from './TestEnter';
/* eslint-disable */
const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Данное поле обязательно для заполнения!
      </div>
    );
  }
};

const email = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        Неверный формат email.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        Имя пользователя должно содержать от 3 да 20 символов.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (!/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,40}$/.test(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        Пароль должен содержать от 6 да 40 символов и состоять из букв и цифр.
      </div>
    );
  }
};

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: '',
      email: '',
      password: '',
      successful: false,
      message: ''
    };
  }

  handleRegister(e) {
    const { username, email, password } = this.state;
    const { history } = this.props;

    e.preventDefault();

    this.setState({
      message: '',
      successful: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      LangApi.user(
        {
          name: username,
          email,
          password
        },
        LangApi.userApiReg
      ).then(
        (response) => {
          this.setState({
            message: 'Вы зарегистрированы!',
            successful: true
          });
          history.push('/');
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: 'Такой пользователь уже существует!'
          });
        }
      );
    }
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
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
    const { message, successful, password, email, username } = this.state;

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
              onSubmit={this.handleRegister}
              ref={(c) => {
                this.form = c;
              }}
            >
              {!successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="username">Имя</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="username"
                      value={username}
                      onChange={this.onChangeUsername}
                      validations={[required, vusername]}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="email"
                      value={email}
                      onChange={this.onChangeEmail}
                      validations={[required, email]}
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
                      validations={[required, vpassword]}
                    />
                  </div>

                  <div className="form-group">
                    <button type="button" className="btn btn-primary btn-block">
                      Регистрация
                    </button>
                  </div>
                </div>
              )}

              {message && (
                <div className="form-group">
                  <div
                    className={successful ? 'alert alert-success' : 'alert alert-danger'}
                    role="alert"
                  >
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
