import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';
import 'assets/style.scss';
import { HashRouter } from 'react-router-dom';

ReactDOM.render(
  <HashRouter>
      <App />
  </HashRouter>,
  document.querySelector('#root'),
);
