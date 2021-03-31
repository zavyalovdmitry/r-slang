import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';
import 'assets/style.scss';
import { HashRouter } from 'react-router-dom';
import SettingsContextProvider from './components/SettingsContext';

ReactDOM.render(
  <HashRouter>
    <SettingsContextProvider>
      <App />
    </SettingsContextProvider>
  </HashRouter>,
  document.querySelector('#root'),
);
