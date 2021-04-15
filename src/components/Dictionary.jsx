/* eslint-disable no-underscore-dangle */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import LangApi from './LangApi';
import DictionaryCell from './DictionaryCell';
import WordsNav from './WordsNav';
import Settings from './Settings';
import SettingsContext from './SettingsContext';
import Loader from './Loader';
import { shuffle } from '../utils';
import MenuItem from './MenuItem';

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

  quantityPages = (group, page, groups) => {
    const { userId, token } = this.context.user;
    LangApi.groupCount(userId, token, group, this.state.section)
      .then(
        (pages) => {
          this.setState(() => ({
            pages, groups,
          }), () => {
            if (pages[page]) this.changeGroupAndPage(group, page);
            else this.changeGroupAndPage(group, page.indexOf(true));
          });
        },
      );
  }

  changeGroupAndPage = (groupCh = null, pageCh = null) => {
    const page = (pageCh !== null) ? pageCh : this.state.page;
    const group = (groupCh !== null) ? groupCh : this.state.group;
    const { section } = this.state;
    const { userId, token } = this.context.user;
    const auth = (userId !== null && token !== null);
    this.setState(
      { page, group, data: [] },
      () => {
        if (auth) {
          LangApi.getUserWordsWithFilter(userId, token, section, group, page)
            .then((words) => {
              const { data } = words;
              if (section !== 3) this.dataForGame(data);
              this.setState({ data });
            });
        } else {
          LangApi.getWords(group, page)
            .then((words) => words.json())
            .then((data) => this.setState({ data, page, group }));
        }
      },
    );
  }

  changeSection = (section) => {
    this.setState({
      section, groups: 0, pages: 0, data: [],
    }, () => this.quantityGroups(0, 0));
  }

  changeData = (data) => {
    this.setState({ data });
  }

  changeWordStatus = (wordId, status) => {
    const { userId, token } = this.context.user;
    LangApi.updateUserWords(userId, token, wordId, null, status)
      .then(() => this.changeGroupAndPage());
  }

  dataForGame = async (data) => {
    const { length } = data;
    if (length < 15) {
      const { section } = this.state;
      const { userId, token } = this.context.user;
      // eslint-disable-next-line max-len
      const additionalData = await LangApi.getRandomPageForGame(userId, token, section, this.state.group, 30)
        .then((words) => {
          if (words.data) {
            const addData = words.data;
            const dataId = [];
            addData.forEach((element) => {
              dataId.push(element._id);
            });
            // eslint-disable-next-line max-len
            data.forEach((element) => (!dataId.includes(element._id) ? addData.push(element) : false));
            return addData;
          }
          return false;
        });
      if (additionalData) return this.context.setDataForGame(shuffle(additionalData));
      return this.context.setDataForGame(shuffle(data));
    }
    return this.context.setDataForGame(shuffle(data));
  }

  render = () => {
    const { userId, token } = this.context.user;
    const auth = (userId !== null && token !== null);

    const sections = [
      { title: 'слова', value: 0 },
      { title: 'изучаемые слова', value: 1, difficulty: ['low', 'hard'] },
      { title: 'сложные слова', value: 2, difficulty: ['hard'] },
      { title: 'удалённые слова', value: 3, difficulty: ['del', 'success'] },
    ];
    const games = [
      {
        name: 'Спринт',
        link: 'selectedSprint',
      },
      {
        name: 'Саванна',
        link: '/selectedSavana',
      },
      {
        name: 'Аудиовызов',
        link: '/selectedAudiobattle',
      },
      {
        name: 'Конструктор',
        link: 'selectedConstructor',
      },
    ];
    const menuGames = games.map((el, index) => (<MenuItem key={`g-${index}`} dataLink={el} />));

    const {
      data, page, group, section,
    } = this.state;

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
          changeWordStatus={this.changeWordStatus.bind(this, word._id)} />;
      });
    } else words = data.map((word) => <DictionaryCell key={word.id} data={word} />);

    return <article>
      <button onClick={this.dataForGame}>try</button>
      {this.state.data.length ? <Fragment>
        <Settings />
        {auth && <WordsNav navData={sections} active={section} classString="sections" changeVal={this.changeSection} />}
        <Fragment>
          <WordsNav quantity={this.state.groups} active={group} classString="group" changeVal={this.changeGroupAndPage} />
          <WordsNav quantity={this.state.pages} active={page} classString="page" changeVal={this.changeGroupAndPage.bind(this, this.state.group)} />
        </Fragment>

        {(section < 3 && data.length > 0)
          && <Fragment>
              <ul className='nav-dictionary bg-black'>
                {menuGames}
              </ul>
          </Fragment>
        }

        <div className={`words-wrap group-${group}`}>
          {words}
        </div>
        <Fragment>
          <WordsNav quantity={this.state.pages} active={page} classString="page" changeVal={this.changeGroupAndPage.bind(this, this.state.group)} />
          <WordsNav quantity={this.state.groups} active={group} classString="group" changeVal={this.changeGroupAndPage} />
        </Fragment>
        {auth && <WordsNav navData={sections} active={section} classString="sections" changeVal={this.changeSection} />}
      </Fragment>
        : <Loader />}
    </article>;
  }
}

export default Dictionary;

Dictionary.propTypes = {
  group: PropTypes.number,
  page: PropTypes.number,
};
