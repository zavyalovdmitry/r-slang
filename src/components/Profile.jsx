import React, { Component } from "react";
import SettingsContext from './SettingsContext';

export default class Profile extends Component {

  static contextType = SettingsContext;

  // getCurrentUser() {
  //   return JSON.parse(localStorage.getItem('user'));
  // }

  logOut = () => {
    sessionStorage.removeItem('auth');
    this.props.history.push("/");
    window.location.reload();
  }

  render() {
    const user = this.context;
    // console.log(this.context.user);
    // console.log(sessionStorage.auth ? 'in' : 'out')
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />
          {/* <div className="jumbotron">
            <h3>
            </h3>
          </div> */}
          {/* <p>
            <strong>Token:</strong>{" "}
            {this.context.user.token}
          </p> */}
          <p>
            <strong>Id:</strong>{" "}
            {this.context.user.userId}
          </p>
          <p>
            <strong>Email:</strong>{" "}
          </p>
          <strong>Имя:</strong>
          <div className="form-group">
            <button className="btn btn-primary btn-block" onClick={this.logOut}>Выход</button>
          </div>
        </div>
      </div>
    );
  }
}
