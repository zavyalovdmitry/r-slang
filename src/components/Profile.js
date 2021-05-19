import React, { Component } from 'react';
import SettingsContext from './SettingsContext';
import LangApi from './LangApi';
import Loader from './Loader';

/* eslint-disable */

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        name: '',
        email: ''
      }
    };
  }

  static contextType = SettingsContext;

  logOut = () => {
    const { history } = this.props;

    sessionStorage.removeItem('auth');
    history.push('/main');
    window.location.reload();
  };

  getUserData = async () => {
    const { user } = this.context;
    const { userId, token } = user;

    let api = await LangApi.getUserInfo(userId, token)
    let data = api.status === 401 ? this.logOut() : api.json();
    let userData = await data;
    
    this.setState({ userData });
  };

  render() {
    this.getUserData();

    const { user } = this.context;
    const { userId } = user;
    const { userData } = this.state;
    const { email, name } = userData;

    return (
      <div className="col-md-12">
        {name ? (
          <div className="card card-container">
            <img
              src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
              alt="profile-img"
              className="profile-img-card"
            />
            <p>
              <strong>Id:</strong>
              {` ${userId}`}
            </p>
            <p>
              <strong>Email:</strong>
              {` ${email}`}
            </p>
            <p>
              <strong>Имя:</strong>
              {` ${name}`}
            </p>
            <div className="form-group">
              <button type="button" className="btn btn-primary btn-block" onClick={this.logOut}>
                Выход
              </button>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}
