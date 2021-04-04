import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import LangApi from './LangApi';
import DictionaryCell from './DictionaryCell';
import WordsNav from './WordsNav';
import Settings from './Settings';
import SettingsContext from './SettingsContext';

class Dictionary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 0,
      group: 0,
      section: 0,
    };
  }

  static contextType = SettingsContext;

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

  changeSection = (section) => {
    this.setState({ section });
  }

  changeData = (data) => {
    this.setState({ data });
  }

  // status: false - del, true - hard
  changeWordStatus = (wordId, status) => {
    const { userId, token } = this.context.user;
    LangApi.updateUserWords(userId, token, wordId, '', status)
      .then(() => this.forceUpdate());
  }

  render = () => {
    const auth = (this.context.user.userId !== null && this.context.user.token !== null);

    // разделы словаря
    const sections = [
      { title: 'слова', value: 0 },
      { title: 'изучаемые слова', value: 1 },
      { title: 'сложные слова', value: 2 },
      { title: 'удалённые слова', value: 3 },
    ];

    const {
      data, page, group, section,
    } = this.state;

    // список выводимых слов
    let words;
    if (auth) {
      const { userWords } = this.context.user;
      words = data.map((word) => {
        const findedWord = userWords.find(
          (userWord) => userWord.wordId === word.id,
        );
        let classStyle = null;
        // проверка наличая пользовательского статуса для слова
        if (findedWord !== undefined) {
          const { difficulty } = findedWord;
          if (difficulty === 'del') return null;
          classStyle = difficulty;
        }
        return <DictionaryCell key={word.id}
                              data={word}
                              classStyle={classStyle}
                              changeWordStatus = {this.changeWordStatus.bind(this, word.id) } />;
      });
    } else words = data.map((word) => <DictionaryCell key={word.id} data={word}/>);

    return (<article>
    <Settings />
    {auth
    && <WordsNav navData={sections} active ={section} classString="sections" changeVal={this.changeSection} />
    }
    {section === 0
    && <Fragment>
        <WordsNav quantity={6} active={group} classString="group" changeVal={this.changeGroupAndPage} />
        <WordsNav quantity={30} active={page} classString="page" changeVal={this.changeGroupAndPage.bind(this, this.state.group)} />
    </Fragment>
    }
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
