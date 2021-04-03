import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';
import 'assets/style.scss';
import { HashRouter } from 'react-router-dom';
// import ThemeContext from "./themeContext";
const UserContext = React.createContext('0');

ReactDOM.render(
  <UserContext.Provider value='0'>
    <HashRouter>
      <App />
    </HashRouter>
  </UserContext.Provider>,
  document.querySelector('#root'),
);
