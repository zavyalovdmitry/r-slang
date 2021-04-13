import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import LangApi from './LangApi';
import DictionaryCell from './DictionaryCell';
import WordsNav from './WordsNav';
import Settings from './Settings';
import SettingsContext from './SettingsContext';
import Loader from './Loader';

class Dictionary extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      page: 0,
      pages: 30,
      group: 0,
      groups: 6,
      section: 0,
      messag: null,
    };
  }

  static contextType = SettingsContext;

  componentDidMount = () => {
    const { userId, token } = this.context.user;
    if (userId !== null && token !== null) {
      this.quantityGroups();
    }
    this.changeGroupAndPage(this.props.page, this.props.group);
  }

  // подсчёт групп
  quantityGroups = (group = 0, page = 0) => {
    const { userId, token } = this.context.user;
    LangApi.groupCount(userId, token, false, this.state.section)
      .then(
        (groups) => {
          if (groups[group]) this.quantityPages(group, page, groups);
          else this.quantityPages(group.indexOf(true), 0, groups);
        },
      );
  }

  // подсчёт страниц
  quantityPages = (group, page, groups) => {
    const { userId, token } = this.context.user;
    LangApi.groupCount(userId, token, group, this.state.section)
      .then(
        (pages) => {
          this.setState(() => ({ pages, groups, data: [] }), () => {
            if (pages[page]) this.changeGroupAndPage(group, page);
            else this.changeGroupAndPage(group, page.indexOf(true));
          });
        },
      );
  }

  // добавить обработчик страниц сюда
  changeGroupAndPage = (groupCh = null, pageCh = null) => {
    const page = (pageCh !== null) ? pageCh : this.state.page;
    const group = (groupCh !== null) ? groupCh : this.state.group;
    const { section } = this.state;
    const { userId, token } = this.context.user;
    const auth = (userId !== null && token !== null);
    if (auth) {
      LangApi.getUserWordsWithFilter(userId, token, section, group, page)
        .then(
          (words) => {
            /* LangApi.groupCount(userId, token, 0, this.state.section); */
            const { data } = words;
            this.setState({ data, page, group });
          },
        );
    } else {
      LangApi.getWords(group, page)
        .then((words) => words.json())
        .then((data) => this.setState({ data, page, group }));
    }
  }

  // добавить обработчик групп сюда
  changeSection = (section) => {
    this.setState({
      section, groups: 0, pages: 0, data: [],
    }, () => this.quantityGroups(0, 0));
  }

  changeData = (data) => {
    this.setState({ data });
  }

  // status: false - del, true - hard
  changeWordStatus = (wordId, status) => {
    const { userId, token } = this.context.user;
    LangApi.updateUserWords(userId, token, wordId, null, status)
      .then(() => this.changeGroupAndPage());
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
    <button onClick={ this.quantityGroupAndPage }>
        quantityGroupAndPage test
      </button>
      <button onClick={
        // eslint-disable-next-line max-len
        () => LangApi.updateGameStatistic(userId, token, 'game-1', [false, true, true, true, true, false, true])
        }>
      updateGameStatistic test
      </button>
      {this.state.data.length ? <Fragment>
        <Settings />
        {auth && <WordsNav navData={sections} active ={section} classString="sections" changeVal={this.changeSection} />}
        {section < 6
        && <Fragment>
              <WordsNav quantity={this.state.groups} active={group} classString="group" changeVal={this.changeGroupAndPage} />
              <WordsNav quantity={this.state.pages} active={page} classString="page" changeVal={this.changeGroupAndPage.bind(this, this.state.group)} />
            </Fragment>}
        <div className="words-wrap">
          {words}
        </div>
        {auth && <WordsNav navData={sections} active ={section} classString="sections" changeVal={this.changeSection} />}
        {section < 6
        && <Fragment>
              <WordsNav quantity={this.state.groups} active={group} classString="group" changeVal={this.changeGroupAndPage} />
              <WordsNav quantity={this.state.pages} active={page} classString="page" changeVal={this.changeGroupAndPage.bind(this, this.state.group)} />
            </Fragment>}
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
