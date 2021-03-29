import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DictionaryCell from './DictionaryCell';
import LangApi from './LangApi';

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
    this.setState((props) => (
      { page: props.page ? props.page : 0, group: props.group ? props.group : 0 }
    ), LangApi.getWords(this.state.page, this.state.group, this.changeData));
  }

  changeData = (data) => {
    this.setState({ data });
  }

  render = () => {
    const { data } = this.state;
    const words = data.map((word) => <DictionaryCell key={word.id} data={word}/>);

    return (<article>
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
