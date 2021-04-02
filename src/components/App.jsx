import React, { Fragment } from 'react';
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
import Statistics from './Statistics';
import Audiobattle from './Audiobattle';
import Sprint from './Sprint';
import Ourgame from './Ourgame';

import Register from './Register';
import Login from './Login';
import Profile from './Profile';

const App = () => (
  <Fragment>
    <Header/>
    <main>
      <Switch>
        <Route path="/dictionary">
          <Dictionary/>
        </Route>
        <Route path="/savana">
          <Savanna/>
        </Route>      
        <Route path="/Statistics">
          <Statistics/>
        </Route>
        <Route path="/audiobattle">
          <Audiobattle/>
        </Route>
        <Route path="/sprint">
          <Sprint/>
        </Route>
        <Route path="/ourgame">
          <Ourgame/>
        </Route>
        <Route path="/main">
          <Main/>
        </Route>

        <Route path="/register">
          <Register/>
        </Route>
        <Route path="/login">
          <Login/>
        </Route>
        <Route path="/profile">
          <Profile/>
        </Route>  

        <Redirect from='/' to='/main' />
      </Switch>
    </main>
    <Footer/>
  </Fragment>
);

export default App;
