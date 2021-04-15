import React, { Component } from "react";
import SettingsContext from './SettingsContext';
import LangApi from './LangApi';

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
    // sessionStorage.clear();
    sessionStorage.removeItem('auth');
    this.props.history.push("/");
    window.location.reload();
    // this.context.user.userId
    // this.context.user.token
  }

  getUserData = () => {
  LangApi.getUserInfo(this.context.user.userId, 
                      this.context.user.token)
          .then((data) => data.json())
          .then((userData) => {
            this.setState({
              userData: userData
            })
          });  
  }

  render() {
    this.getUserData();

    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />
          <p>
            <strong>Id:</strong>{" "}
            {this.context.user.userId}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            {this.state.userData.email}
          </p>
          <p>
            <strong>Имя:</strong>{" "}
            {this.state.userData.name}
          </p>
          <div className="form-group">
            <button className="btn btn-primary btn-block" onClick={this.logOut}>Выход</button>
          </div>
        </div>
      </div>
    );
  }
}
