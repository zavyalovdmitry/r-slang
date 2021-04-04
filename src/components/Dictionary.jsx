import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LangApi from './LangApi';
import DictionaryCell from './DictionaryCell';
import WordsNav from './WordsNav';
import Settings from './Settings';

class Dictionary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 0,
      group: 0,
    };
  }

  componentDidMount = () => {
    this.changeGroupAndPage(this.props.page, this.props.group);
    if (sessionStorage.getItem('auth') !== null) {
      const { userId, token } = JSON.parse(sessionStorage.getItem('auth'));
      this.setState({ userId, token });
    }
  }

  changeGroupAndPage = (group = null, page = null) => {
    this.setState((state) => ({
      page: (page !== null) ? page : state.page,
      group: (group !== null) ? group : state.group,
    }),
    () => LangApi.getWords(this.state.group, this.state.page)
      .then((data) => data.json())
      .then((words) => this.changeData(words)));
  }

  changeData = (data) => {
    this.setState({ data });
  }

  render = () => {
    const { data, page, group } = this.state;

    /* if() */

    const words = data.map((word) => <DictionaryCell key={word.id} data={word}/>);

    return (<article>
    <Settings />
    <WordsNav quantity={6} active={group} classString="group" changeVal={this.changeGroupAndPage} />
    <WordsNav quantity={30} active={page} classString="page" changeVal={this.changeGroupAndPage.bind(this, this.state.group)} />
         Dictionary
         {words}
      </article>);
  }
}

export default Dictionary;

Dictionary.propTypes = {
  group: PropTypes.number,
  page: PropTypes.number,
};
