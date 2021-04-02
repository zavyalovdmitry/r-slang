// import React, { Component } from 'react';


// ////////////////////////////////////////////////////////////////http-common
// import axios from 'axios';
// // import http from 'http-common';

// const addr = 'https://react-rs-lang.herokuapp.com';
// const http = axios.create({
// //   baseURL: `${addr}/api`,
//   baseURL: `${addr}`,
//   headers: {
//     'Content-type': 'application/json',
//   },
// });
//  ////////////////////////////////////////////////////////////////


// class Profile extends Component {


// ////////////////////////////////////////////////////////////////
//    constructor(props) {
//       super(props);
//       this.state = {
//          words: ['1', '2'],
//       }
//    };

//    componentDidMount() {
//       this.getCountry();
//       // this.getAll();
//       // this.getPlaces();
//    }

// // const CountryDataService = {
//    // getAll = () => {
//    //   return http.get('/words');
//    // }
 
//    // get = (id) => {
//    //   return http.get(`/words/${id}`);
//    // }
// // };

//    getCountry = () => {
//       // CountryDataService.get(this.props.id)
//       // CountryDataService.getAll()
//       // this.getAll()
//       http.get('/words')
//          .then((response) => {
//             this.setState({
//                words: response.data,
//                // dataLoaded: true,
//             });
//             console.log(response.data);
//          })
//          .catch((e) => {
//             console.log(e);
//          });
//    }
// ////////////////////////////////////////////////////////////////


//    render() {
//       return(
//       <article>
//          Your profile<br></br>
//          {this.state.words[0].textExample}


//       </article>
//    )}
// };

// export default Profile;



import React, { Component } from "react";
import AuthService from "../services/auth.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser()
    };
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>
            <strong>{currentUser.username}</strong> Profile
          </h3>
        </header>
        <p>
          <strong>Token:</strong>{" "}
          {currentUser.accessToken.substring(0, 20)} ...{" "}
          {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
        </p>
        <p>
          <strong>Id:</strong>{" "}
          {currentUser.id}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {currentUser.email}
        </p>
        <strong>Authorities:</strong>
        <ul>
          {currentUser.roles &&
            currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
        </ul>
      </div>
    );
  }
}
