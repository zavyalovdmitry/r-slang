import React, { Component } from "react";
import SettingsContext from './SettingsContext';

export default class Profile extends Component {

  static contextType = SettingsContext;

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  render() {
    const user = this.context;
    return (
        <div className="container">
          <header className="jumbotron">
            <h3>
            </h3>
          </header>
          <p>
            <strong>Token:</strong>{" "}
            {this.context.user.token}
          </p>
          <p>
            <strong>Id:</strong>{" "}
            {this.context.user.userId}
          </p>
          <p>
            <strong>Email:</strong>{" "}
          </p>
          <strong>Name:</strong>
          <ul>
          </ul>
        </div>
    );
  }
}
