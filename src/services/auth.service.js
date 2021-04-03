import axios from "axios";
import React, { Component } from "react";
// import http from '../http-common'

const API_URL = "https://react-rs-lang.herokuapp.com/";

class AuthService extends Component {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password,
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register = async user => {
    const rawResponse = await fetch(API_URL + 'users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    const content = await rawResponse.json();
  
    console.log(content);
  };

  // register(username, email, password) {
  //   return axios.post(API_URL + "user", {
  //     username,
  //     email,
  //     password,
  //   });
  // }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default AuthService;
