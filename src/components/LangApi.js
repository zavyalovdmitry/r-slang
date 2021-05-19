import { getRandomNumber } from '../utils';

export default class LangApi {
  static homeApi = 'https://zavyalovdmitry-rslang.herokuapp.com/';

  static userApiReg = 'users';

  static userApiLog = 'signin';

  static wordGoal = {
    hard: 10,
    low: 5,
    del: 1000,
    success: 1000
  };

  static gameStatisticsExample = () => ({
    learnedWords: 0,
    serries: 0,
    outputsWords: 0,
    trues: 0
  });

  static optionalStatisticsExample = () => {
    const optional = {};
    optional.learnedWords = 0;
    for (let i = 1; i <= 4; i += 1) optional[`game-${i}`] = this.gameStatisticsExample();
    return optional;
  };

  static statisticExample = () => {
    const data = {
      learnedWords: 0,
      optional: {}
    };
    data.optional[this.dateFormat(new Date())] = this.optionalStatisticsExample();
    return data;
  };

  static querys = [
    '',
    '"userWord.difficulty":{ "$not": {"$in": ["del","success"]}}',
    '"userWord.difficulty": {"$eq": "hard"}',
    '"userWord.difficulty": {"$in": ["del","success"]}',
    '"userWord.difficulty": {"$eq": "low"}'
  ];

  static queryIn = (array) => `{"$in": [${array.join(',')}]}`;

  static queryNot = (value) => `{ "$not": ${value}}`;

  static queryEq = (value) => `{ "$eq": ${value}}`;

  static queryAnd = (array) => `{"$and":[{${array.join(',')}}]}`;

  static getWordById = (id, func) => {
    if (id !== null) {
      let queryParam = 'words';
      queryParam += `/${id}`;
      fetch(`${this.homeApi}${queryParam}`)
        .then((d) => d.json())
        .then((data) => func(data));
    }
  };

  static getWords = (group = 0, page = 0) => {
    let queryParam = 'words';
    if (group !== null || page !== null) {
      queryParam += '?';
      queryParam += (group ? `group=${group}&` : '') + (page ? `page=${page}` : '');
    }
    return fetch(`${this.homeApi}${queryParam}`);
  };

  static user = async (user, url) => {
    const rawResponse = await fetch(this.homeApi + url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    const content = await rawResponse.json();
    return content;
  };

  static getUserInfo = async (userId, token) => {
    const url = `${this.homeApi}users/${userId}`;

    // console.log(token);

    return fetch(url, {
      method: 'GET',
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  };

  static getUserWords = (userId, token, wordId = '') => {
    const url = `${this.homeApi}users/${userId}/words${wordId ? `/${wordId}` : ''}`;
    return fetch(url, {
      method: 'GET',
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
  };

  static getUserWordsWithFilter = (
    userId,
    token,
    qry = 0,
    group = null,
    page = 0,
    pageOfAll = false,
    perPage = 20
  ) => {
    const chosenGroup = group === null ? '' : `group=${group}&`;
    const query = !pageOfAll
      ? encodeURIComponent(this.queryAnd([this.querys[qry], `"page": ${this.queryEq(page)}`]))
      : encodeURIComponent(`{${this.querys[qry]}}`);
    const pageOfResult = !pageOfAll ? '' : `page=${page}&`;
    const url = `${this.homeApi}users/${userId}/aggregatedWords?${chosenGroup}${pageOfResult}wordsPerPage=${perPage}&filter=${query}`;
    return fetch(url, {
      method: 'GET',
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })
      .then((data) => data.json())
      .then((words) => {
        const data = words[0].paginatedResults;
        const dataQuantity = words[0].totalCount[0] ? words[0].totalCount[0].count : 0;
        return { data, dataQuantity };
      });
  };

  static getRandomPageForGame = async (userId, token, qry = 0, group = null, perPage = 15) => {
    const selectedGroup = qry !== 2 ? group : null;

    const res = await this.getUserWordsWithFilter(
      userId,
      token,
      qry,
      selectedGroup,
      0,
      true,
      perPage
    ).then(async (dataCheck) => {
      const { dataQuantity } = dataCheck;
      if (qry === 2 && dataQuantity < perPage) {
        const additionalDates = perPage - dataQuantity;
        const retData = await Promise.all([
          dataQuantity
            ? this.getUserWordsWithFilter(userId, token, qry, selectedGroup, 0, true, perPage)
            : [],
          this.getUserWordsWithFilter(
            userId,
            token,
            4,
            selectedGroup,
            0,
            true,
            additionalDates
          ).then((secondDataCheck) => {
            if (secondDataCheck.dataQuantity === 0) return false;
            const page = getRandomNumber(
              0,
              Math.ceil(secondDataCheck.dataQuantity / additionalDates) - 1
            );
            return this.getUserWordsWithFilter(
              userId,
              token,
              4,
              selectedGroup,
              page,
              true,
              additionalDates
            );
          })
        ]);
        const returnData = retData[0]
          ? retData[1]
            ? retData[0].data.concat(retData[1].data)
            : retData[0].data
          : retData[1]
          ? retData[1].data
          : false;
        return { data: returnData };
      }
      const page = getRandomNumber(0, Math.ceil(dataCheck.dataQuantity / perPage) - 1);
      return this.getUserWordsWithFilter(userId, token, qry, selectedGroup, page, true, perPage);
    });
    return res;
  };

  static updateUserWords = (userId, token, wordId, action = null, status = null, game = null) =>
    this.getUserWords(userId, token, wordId)
      .then((data) => {
        if (data.status === 200) return data.json();
        return undefined;
      })
      .then((SearchedWord) => {
        const wordIsSearched = SearchedWord !== undefined;
        let series;
        let global;
        let wrong;
        const method = wordIsSearched ? 'PUT' : 'POST';

        let difficulty =
          wordIsSearched && SearchedWord.difficulty !== undefined ? SearchedWord.difficulty : 'low';

        if (status !== null) {
          if (status) {
            difficulty = difficulty === 'del' || difficulty === 'success' ? 'low' : 'del';
          } else {
            difficulty = difficulty === 'hard' ? 'low' : 'hard';
          }
          series = 0;
          global = 0;
          wrong = 0;
        } else if (wordIsSearched && SearchedWord.optional !== undefined) {
          series = SearchedWord.optional.series !== undefined ? SearchedWord.optional.series : 0;
          global = SearchedWord.optional.global !== undefined ? SearchedWord.optional.global : 0;
          wrong = SearchedWord.optional.wrong !== undefined ? SearchedWord.optional.wrong : 0;
        } else {
          series = 0;
          global = 0;
          wrong = 0;
        }

        if (action !== null) {
          global += 1;
          if (action === true) {
            series += 1;
            if (
              series >= this.wordGoal[difficulty] &&
              difficulty !== 'del' &&
              difficulty !== 'success'
            ) {
              difficulty = 'success';
              series = 0;
              if (game !== null) this.updateGameStatistic(userId, token, game, null, true);
            }
          } else {
            series = 0;
            wrong += 1;
          }
        }
        const word = {
          difficulty,
          optional: {
            global,
            series,
            wrong
          }
        };
        return fetch(`${this.homeApi}users/${userId}/words/${wordId}`, {
          method,
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(word)
        });
      });

  static groupCount = async (userId, token, group = false, qry = 0) => {
    const check = [];
    const max = group !== false ? 30 : 6;
    for (let i = 0; i < max; i += 1) {
      const url = this.urlForSearchCount(userId, group, i, qry);
      check[i] = fetch(url, {
        method: 'GET',
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      })
        .then((data) => data.json())
        .then((words) => {
          const pageCount = words[0].totalCount.length > 0 ? words[0].totalCount[0].count : 0;
          return pageCount > 0;
        });
    }
    const res = await Promise.all(check).then((values) => values);
    return res;
  };

  static urlForSearchCount = (userId, group, i, qry) => {
    let filter;
    let grQuery;

    if (group !== false) {
      filter = encodeURIComponent(this.queryAnd([this.querys[qry], `"page": ${this.queryEq(i)}`]));
      grQuery = `group=${group}`;
    } else {
      filter = encodeURIComponent(`{${this.querys[qry]}}`);
      grQuery = `group=${i}`;
    }
    return `${this.homeApi}users/${userId}/aggregatedWords?${grQuery}&wordsPerPage=1&filter=${filter}`;
  };

  static getGameStatistic = (userId, token) => {
    const url = `${this.homeApi}users/${userId}/statistics`;
    return fetch(url, {
      method: 'GET',
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    }).then((data) => {
      if (data.status === 200) return data.json();
      const ret = this.statisticExample();
      return ret;
    });
  };

  static dateFormat = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  static updateGameStatistic = (userId, token, game, answersArr = null, learnedWord = false) => {
    const date = this.dateFormat(new Date());
    this.getGameStatistic(userId, token).then((statistic) => {
      if (answersArr !== null || learnedWord) {
        const data = { learnedWords: statistic.learnedWords, optional: statistic.optional };

        if (data.optional[date] === undefined) {
          data.optional[date] = this.optionalStatisticsExample();
        }

        if (answersArr !== null) {
          let seriesActual = 0;
          let truesActual = 0;
          const answers = answersArr.length;
          for (let i = 0, currentSeries = 0; i < answers; i += 1) {
            if (answersArr[i]) {
              currentSeries += 1;
              truesActual += 1;
            } else {
              if (seriesActual < currentSeries) {
                seriesActual = currentSeries;
              }
              currentSeries = 0;
            }
            if (i === answers - 1) {
              seriesActual = seriesActual < currentSeries ? currentSeries : seriesActual;
            }
          }
          const { serries, outputsWords, trues } =
            data.optional[date] !== undefined && data.optional[date][game] !== undefined
              ? data.optional[date][game]
              : { serries: 0, outputsWords: 0, trues: 0 };
          seriesActual = seriesActual > serries ? seriesActual : serries;
          truesActual += trues;
          data.optional[date][game].serries = seriesActual;
          data.optional[date][game].trues = truesActual;
          data.optional[date][game].outputsWords = outputsWords + answers;
        } else if (learnedWord) {
          data.learnedWords += 1;
          data.optional[date].learnedWords += 1;
          data.optional[date][game].learnedWords += 1;
        }
        const url = `${this.homeApi}users/${userId}/statistics`;
        fetch(url, {
          method: 'PUT',
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      }
    });
  };

  static getUserSettings = (userId, token) => {
    const url = `${this.homeApi}users/${userId}/settings`;
    return fetch(url, {
      method: 'GET',
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    }).then((answer) => (answer.status === 200 ? answer.json() : undefined));
  };

  static setUserSettings = (userId, token, optional) => {
    this.getUserSettings(userId, token).then((settings) => {
      let newSettings = {};
      if (settings) {
        newSettings.optional = optional;
        newSettings.wordsPerDay = settings.wordsPerDay;
      } else {
        newSettings = {
          wordsPerDay: 1,
          optional
        };
      }
      const url = `${this.homeApi}users/${userId}/settings`;
      fetch(url, {
        method: 'PUT',
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSettings)
      });
    });
  };
}
