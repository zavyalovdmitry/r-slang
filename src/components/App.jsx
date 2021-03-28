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
import Statisctics from './Statisctics';
import Audiobattle from './Audiobattle';
import Sprint from './Sprint';
import Ourgame from './Ourgame';
import Auth from './Auth';

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
        <Route path="/statisctics">
          <Statisctics/>
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
        <Route path="/auth">
          <Auth/>
        </Route>
        <Route path="/main">
          <Main/>
        </Route>
        <Redirect from='/' to='/main' />
      </Switch>
    </main>
    <Footer/>
  </Fragment>
);

export default App;
