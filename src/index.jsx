import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';
import 'assets/style.scss';
import { HashRouter } from 'react-router-dom';
// import UserContext from "components/UserContext";
// const UserContext = React.createContext('0');
import { UserContextProvider } from "components/UserContext";

ReactDOM.render(
  <UserContextProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </UserContextProvider>,
  document.querySelector('#root'),
);
