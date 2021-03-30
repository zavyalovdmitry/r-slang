import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DictionaryCell from './DictionaryCell';
import LangApi from './LangApi';
import WordsNav from './WordsNav';

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
    const { data } = this.state;
    const words = data.map((word) => <DictionaryCell key={word.id} data={word}/>);

    return (<article>
    <WordsNav quantity={6} classString="group" changeVal={this.changeGroupAndPage} />
    <WordsNav quantity={30} classString="page" changeVal={this.changeGroupAndPage.bind(this, this.state.group)} />
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
