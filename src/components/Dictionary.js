import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LangApi from './LangApi';
import DictionaryCell from './DictionaryCell';
import WordsNav from './WordsNav';
import Settings from './Settings';
import SettingsContext from './SettingsContext';
import Loader from './Loader';
import { shuffle } from '../utils';
import MenuItem from './MenuItem';
/* eslint-disable */
class Dictionary extends Component {
  static contextType = SettingsContext;

  constructor() {
    super();
    // this.contextType = SettingsContext;
    this.state = {
      data: [],
      page: 0,
      pages: 30,
      group: 0,
      groups: 6,
      section: 1
    };
  }

  componentDidMount = () => {
    const { user } = this.context;
    const { userId, token } = user;
    const pagePosition = JSON.parse(sessionStorage.getItem('pagePosition'));

    if (userId !== null && token !== null) {
      if (pagePosition) {
        const { section, page, group } = pagePosition;
        this.setState({ section, page, group }, () => this.quantityGroups(group, page));
      } else {
        this.quantityGroups();
      }
    } else {
      let { page } = this.props;
      let { group } = this.props;
      if (pagePosition && pagePosition.section === 1) {
        page = pagePosition.page;
        group = pagePosition.group;
      }
      this.changeGroupAndPage(group, page);
    }
  };

  quantityGroups = (group = 0, page = 0) => {
    const { user } = this.context;
    const { userId, token } = user;
    const { section } = this.state;
    LangApi.groupCount(userId, token, false, section).then((groups) => {
      if (groups[group]) this.quantityPages(group, page, groups);
      else this.quantityPages(group.indexOf(true), 0, groups);
    });
  };

  quantityPages = (group, page, groups) => {
    const { user } = this.context;
    const { userId, token } = user;
    const { section } = this.state;

    LangApi.groupCount(userId, token, group, section).then((pages) => {
      this.setState(
        () => ({ pages, groups }),
        () => {
          if (pages[page]) {
            this.changeGroupAndPage(group, page);
          } else {
            this.changeGroupAndPage(group, pages.indexOf(true));
          }
        }
      );
    });
  };

  changeGroupAndPage = (groupCh = null, pageCh = null) => {
    const { section, group: groupState } = this.state;
    const page = pageCh !== null ? pageCh : 0;
    const group = groupCh !== null ? groupCh : groupState;
    const { user } = this.context;
    const { userId, token } = user;
    const auth = userId !== null && token !== null;

    this.setState({ page, group, data: [] }, () => {
      if (auth) {
        sessionStorage.setItem('pagePosition', JSON.stringify({ section, group, page }));
        LangApi.getUserWordsWithFilter(userId, token, section, group, page).then((words) => {
          const { data } = words;
          if (section !== 3) this.dataForGame(data);
          this.setState({ data });
        });
      } else {
        LangApi.getWords(group, page)
          .then((words) => words.json())
          .then((data) => this.setState({ data, page, group }, () => this.dataForGame(data)));
      }
    });
  };

  changeSection = (section) => {
    this.setState({ section, groups: 0, pages: 0, data: [] }, () => this.quantityGroups(0, 0));
  };

  changeData = (data) => {
    this.setState({ data });
  };

  changeWordStatus = (wordId, status) => {
    const { group, page } = this.state;
    const { user } = this.context;
    const { userId, token } = user;
    LangApi.updateUserWords(userId, token, wordId, null, status).then(() => {
      this.quantityGroups(group, page);
    });
  };

  dataForGame = async (data) => {
    const { length } = data;
    const { user, setDataForGame } = this.context;
    const { userId, token } = user;
    const { section, group } = this.state;

    if (length < 15) {
      const additionalData = await LangApi.getRandomPageForGame(
        userId,
        token,
        section,
        group,
        30
      ).then((words) => {
        if (words.data) {
          const addData = words.data;
          const dataId = [];
          addData.forEach((element) => {
            dataId.push(element._id);
          });
          data.forEach((element) =>
            !dataId.includes(element._id) ? addData.push(element) : false
          );
          return addData;
        }
        return false;
      });
      if (additionalData) {
        return setDataForGame(shuffle(additionalData));
      }
      return setDataForGame(shuffle(data));
    }
    return setDataForGame(shuffle(data));
  };

  render = () => {
    const { user } = this.context;
    const { userId, token } = user;
    const auth = userId !== null && token !== null;

    const sections = [
      { title: 'изучаемые слова', value: 1 },
      { title: 'сложные слова', value: 2 },
      { title: 'удалённые и изученные слова', value: 3 }
    ];
    const games = [
      {
        name: 'Спринт',
        link: 'selectedSprint'
      },
      {
        name: 'Саванна',
        link: '/selectedSavana'
      },
      {
        name: 'Аудиовызов',
        link: '/selectedAudiobattle'
      },
      {
        name: 'Конструктор',
        link: 'selectedConstructor'
      }
    ];
    const menuGames = games.map((el, index) => <MenuItem key={`g-${index}`} dataLink={el} />);

    const { data, page, pages, group, groups, section } = this.state;

    let words;
    if (auth) {
      words = data.map((word) => {
        const { difficulty } = word.userWord !== undefined ? word.userWord : { difficulty: null };
        const classStyle = difficulty;
        return (
          <DictionaryCell
            key={word._id}
            data={word}
            classStyle={classStyle}
            changeWordStatus={this.changeWordStatus.bind(this, word._id || word.id)}
          />
        );
      });
    } else {
      words = data.map((word) => <DictionaryCell key={word.id} data={word} />);
    }

    return (
      <article>
        {data.length ? (
          <>
            <Settings />
            {auth && (
              <WordsNav
                navData={sections}
                active={section}
                classString="sections"
                changeVal={this.changeSection}
              />
            )}
            <>
              <WordsNav
                quantity={groups}
                active={group}
                classString="group"
                changeVal={this.changeGroupAndPage}
              />
              <WordsNav
                quantity={pages}
                active={page}
                classString="page"
                changeVal={this.changeGroupAndPage.bind(this, group)}
              />
            </>

            {section < 3 && data.length > 0 && (
              <>
                <ul className="nav-dictionary bg-black">{menuGames}</ul>
              </>
            )}

            <div className={`words-wrap group-${group}`}>{words}</div>
            <>
              <WordsNav
                quantity={pages}
                active={page}
                classString="page"
                changeVal={this.changeGroupAndPage.bind(this, group)}
              />
              <WordsNav
                quantity={groups}
                active={group}
                classString="group"
                changeVal={this.changeGroupAndPage}
              />
            </>
            {auth && (
              <WordsNav
                navData={sections}
                active={section}
                classString="sections"
                changeVal={this.changeSection}
              />
            )}
          </>
        ) : (
          <Loader />
        )}
      </article>
    );
  };
}

export default Dictionary;

Dictionary.propTypes = {
  group: PropTypes.number,
  page: PropTypes.number
};
