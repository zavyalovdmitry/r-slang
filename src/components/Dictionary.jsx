import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import LangApi from './LangApi';
import DictionaryCell from './DictionaryCell';
import WordsNav from './WordsNav';
import Settings from './Settings';
import SettingsContext from './SettingsContext';
import Loader from './Loader';

class Dictionary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 0,
      pages: 30,
      group: 0,
      section: 0,
      refresh: false,
    };
  }

  static contextType = SettingsContext;

  componentDidMount = () => {
    this.changeGroupAndPage(this.props.page, this.props.group);
  }

  changeGroupAndPage = (groupCh = null, pageCh = null) => {
    this.setState((state) => ({
      page: (pageCh !== null) ? pageCh : state.page,
      group: (groupCh !== null) ? groupCh : state.group,
    }),
    () => {
      const { group, page, section } = this.state;
      const { userId, token } = this.context.user;
      const auth = (userId !== null && token !== null);
      console.log(auth);
      if (auth) {
        LangApi.getUserWordsWithFilter(userId, token, section, group, page)
          .then(
            (words) => {
              const { pages, data } = words;
              console.log(pages);
              console.log(data);
              this.setState({ data, pages });
            },
          );
      } else {
        LangApi.getWords(group, page)
          .then((data) => data.json())
          .then((words) => this.changeData(words));
      }
    });
  }

  changeSection = (section) => {
    this.setState({ section }, () => this.changeGroupAndPage(0, 0));
  }

  changeData = (data) => {
    this.setState({ data });
  }

  // status: false - del, true - hard
  changeWordStatus = (wordId, status) => {
    const { userId, token } = this.context.user;
    LangApi.updateUserWords(userId, token, wordId, null, status)
      .then(() => this.context.user.changeUserWords())
      .then(() => this.changeGroupAndPage);
  }

  render = () => {
    const { userId, token } = this.context.user;
    const auth = (userId !== null && token !== null);

    // разделы словаря
    const sections = [
      { title: 'слова', value: 0 },
      { title: 'изучаемые слова', value: 1, difficulty: ['low', 'hard'] },
      { title: 'сложные слова', value: 2, difficulty: ['hard'] },
      { title: 'удалённые слова', value: 3, difficulty: ['del', 'success'] },
    ];

    const {
      data, page, group, section,
    } = this.state;

    // список выводимых слов
    let words;
    if (auth) {
      words = data.map((word) => {
        const { difficulty } = word.userWord !== undefined ? word.userWord : { difficulty: null };
        console.log(difficulty);
        const classStyle = difficulty;
        // eslint-disable-next-line no-underscore-dangle
        return <DictionaryCell key={word._id}
                              data={word}
                              classStyle={classStyle}
                              // eslint-disable-next-line no-underscore-dangle
                              changeWordStatus = {this.changeWordStatus.bind(this, word._id) } />;
      });
    } else words = data.map((word) => <DictionaryCell key={word.id} data={word}/>);

    return <article>
      {this.state.data.length ? <Fragment>
        <Settings />
        {auth && <WordsNav navData={sections} active ={section} classString="sections" changeVal={this.changeSection} />}
        {section === 0
        && <Fragment>
              <WordsNav quantity={6} active={group} classString="group" changeVal={this.changeGroupAndPage} />
              <WordsNav quantity={30} active={page} classString="page" changeVal={this.changeGroupAndPage.bind(this, this.state.group)} />
            </Fragment>}
        <div className="words-wrap">
          {words}
        </div>
        {auth && <WordsNav navData={sections} active ={section} classString="sections" changeVal={this.changeSection} />}
        {section === 0
        && <Fragment>
              <WordsNav quantity={6} active={group} classString="group" changeVal={this.changeGroupAndPage} />
              <WordsNav quantity={30} active={page} classString="page" changeVal={this.changeGroupAndPage.bind(this, this.state.group)} />
            </Fragment>}
      <button onClick={ () => LangApi.groupCount(userId, token, 0, this.state.section) }>
        query test
      </button>
      </Fragment>
        : <Loader/>}
      </article>;
  }
}

export default Dictionary;

Dictionary.propTypes = {
  group: PropTypes.number,
  page: PropTypes.number,
};
