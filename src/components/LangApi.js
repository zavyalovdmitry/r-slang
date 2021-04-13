export default class LangApi {
    static homeApi='https://react-rs-lang.herokuapp.com/';

    static userApiReg = 'users';

    static userApiLog = 'signin';

    static wordGoal={
      hard: 10, low: 5, del: 1000, success: 1000,
    };

    static gameStatisticsExample = () => (
      {
        learnedWords: 0,
        serries: 0,
        outputsWords: 0,
        trues: 0,
      }
    )

    static optionalStatisticsExample = () => {
      const optional = {};
      optional.learnedWords = 0;
      for (let i = 1; i <= 4; i += 1) optional[`game-${i}`] = this.gameStatisticsExample();
      return optional;
    }

    static statisticExample = (date) => {
      const data = {
        learnedWords: 0,
        optional: {},
      };
      data.optional[data] = this.optionalStatisticsExample(date);
      return data;
    };

    static querys = [
      '"userWord.difficulty":{ "$not": {"$in": ["del","success"]}}',
      '"userWord.difficulty": {"$in": ["hard","low"]}',
      '"userWord.difficulty": {"$eq": "hard"}',
      '"userWord.difficulty": {"$in": ["del","success"]}',
    ];

    static queryIn = (array) => `{"$in": [${array.join(',')}]}`;

    static queryNot = (value) => `{ "$not": ${value}}`;

    static queryEq = (value) => `{ "$eq": ${value}}`;

    static queryAnd = (array) => `{"$and":[{${array.join(',')}}]}`

    static getWordById = (id, func) => {
      if (id !== null) {
        let queryParam = 'words';
        queryParam += `/${id}`;
        fetch(`${this.homeApi}${queryParam}`).then((d) => d.json()).then((data) => func(data));
      }
    }

    static getWords = (group = 0, page = 0) => {
      let queryParam = 'words';
      if (group !== null || page !== null) {
        queryParam += '?';
        queryParam += (group ? `group=${group}&` : '') + (page ? `page=${page}` : '');
      }
      return fetch(`${this.homeApi}${queryParam}`);
    }

    static user = async (user, url) => {
      const rawResponse = await fetch(this.homeApi + url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const content = await rawResponse.json();
      return (content);
    }

    static getUserInfo = async (userId, token) => {
      const url = `${this.homeApi}users/${userId}`;
      return fetch(url,
        {
          method: 'GET',
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
    };

    static getUserWords = (userId, token, wordId = '') => {
      const url = `${this.homeApi}users/${userId}/words${wordId ? `/${wordId}` : ''}`;
      return fetch(url,
        {
          method: 'GET',
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
    }

    static getUserWordsWithFilter = (userId, token, qry = 0, group = null, page = 0) => {
      // 0 - слова , 1- изучаемын, 2 - сложные,3 - удалённые
      const chosenGroup = group === null ? '' : `group=${group}&`;
      const queryForPageOfAll = qry !== 5;
      const query = queryForPageOfAll ? encodeURIComponent(this.queryAnd([this.querys[qry], `"page": ${this.queryEq(page)}`])) : encodeURIComponent(`{${this.querys[qry]}}`);
      const pageOfResult = queryForPageOfAll ? '' : `page=${page}&`;
      const url = `${this.homeApi}users/${userId}/aggregatedWords?${chosenGroup}${pageOfResult}wordsPerPage=20&filter=${query}`;
      return fetch(url,
        {
          method: 'GET',
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
        .then((data) => data.json())
        .then((words) => {
          /* console.log(words[0]);
            console.log(words[0].totalCount[0].count); // колличество таких элементов всего
          console.log(words[0].paginatedResults); // массив значений */
          const pageCount = 0;
          const data = words[0].paginatedResults;
          return { pages: pageCount, data };
        });
    }

    // action: false -not guessed, true - guessed, null - just add
    // status: false - del, true - hard, null - low
    // eslint-disable-next-line max-len
    static updateUserWords = (userId, token, wordId, action = null, status = null, game = null) => this.getUserWords(userId, token, wordId)
      .then(
        (data) => {
          if (data.status === 200) return data.json();
          return undefined;
        },
      )
      .then((SearchedWord) => {
        const wordIsSearched = SearchedWord !== undefined;

        let series; let global; let wrong;
        const method = wordIsSearched ? 'PUT' : 'POST';

        let difficulty = (wordIsSearched && SearchedWord.difficulty !== undefined) ? SearchedWord.difficulty : 'low';
        // eslint-disable-next-line no-nested-ternary
        if (status !== null) {
          if (status) difficulty = difficulty === 'del' ? 'low' : 'del';
          else difficulty = difficulty === 'hard' ? 'low' : 'hard';
          series = 0;
          global = 0;
          wrong = 0;
        } else if (wordIsSearched && SearchedWord.optional !== undefined) {
          // eslint-disable-next-line max-len
          series = (SearchedWord.optional.series !== undefined)
            ? SearchedWord.optional.series : 0;
          // eslint-disable-next-line max-len
          global = (SearchedWord.optional.global !== undefined)
            ? SearchedWord.optional.global : 0;
          // eslint-disable-next-line max-len
          wrong = (SearchedWord.optional.wrong !== undefined)
            ? SearchedWord.optional.wrong : 0;
        } else {
          series = 0; global = 0; wrong = 0;
        }

        if (action !== null) {
          global += 1;
          if (action === true) {
            series += 1;
            if (series >= this.wordGoal[difficulty] && (difficulty !== 'del' && difficulty !== 'success')) {
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
          // eslint-disable-next-line quote-props
          'difficulty': difficulty,
          optional: {
            global,
            series,
            wrong,
          },
        };
        // обновление данных в базе (слово пользователя)
        return fetch(`${this.homeApi}users/${userId}/words/${wordId}`, {
          method,
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(word),
        });
      })

      static groupCount = async (userId, token, group = false, qry = 0) => {
        const check = [];
        const max = group !== false ? 30 : 6;
        for (let i = 0; i < max; i += 1) {
          const url = this.urlForSearchCount(userId, group, i, qry);
          check[i] = fetch(url,
            {
              method: 'GET',
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
            })
            .then((data) => data.json())
            .then((words) => {
              const pageCount = words[0].totalCount.length > 0 ? words[0].totalCount[0].count : 0;
              return pageCount > 0;
            });
        }
        const res = await Promise.all(check).then((values) => values);
        return res;
      }

      // for groupCount()
      static urlForSearchCount = (userId, group, i, qry) => {
        let filter; let grQuery;
        if (group !== false) {
          filter = encodeURIComponent(this.queryAnd([this.querys[qry], `"page": ${this.queryEq(i)}`]));
          grQuery = `group=${group}`;
        } else {
          filter = encodeURIComponent(`{${this.querys[qry]}}`);
          grQuery = `group=${i}`;
        }
        return `${this.homeApi}users/${userId}/aggregatedWords?${grQuery}&wordsPerPage=1&filter=${filter}`;
      }

      static getGameStatistic = (userId, token, date = this.dateFormat(new Date())) => {
        const url = `${this.homeApi}users/${userId}/statistics`;
        return fetch(url, {
          method: 'GET',
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
          .then(
            (data) => {
              if (data.status === 200) return data.json();
              const ret = this.statisticExample(date);
              return ret;
            },
          );
      }

      static dateFormat = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      // eslint-disable-next-line max-len
      static updateGameStatistic = (userId, token, game, answersArr = null, learnedWord = false) => {
        const date = this.dateFormat(new Date());
        this.getGameStatistic(userId, token, date)
          .then((statistic) => {
            if (answersArr !== null || learnedWord) {
              const data = { learnedWords: statistic.learnedWords, optional: statistic.optional };
              // eslint-disable-next-line max-len
              if (data.optional[date] === undefined) data.optional[date] = this.optionalStatisticsExample();

              if (answersArr !== null) {
                let seriesActual = 0;
                let truesActual = 0;
                const answers = answersArr.length;
                for (let i = 0, currentSeries = 0; i < answers; i += 1) {
                  if (answersArr[i]) {
                    currentSeries += 1;
                    truesActual += 1;
                  } else {
                    if (seriesActual < currentSeries) seriesActual = currentSeries;
                    currentSeries = 0;
                  }
                  // eslint-disable-next-line max-len
                  if (i === answers - 1) seriesActual = seriesActual < currentSeries ? currentSeries : seriesActual;
                }
                // eslint-disable-next-line max-len
                const { serries, outputsWords, trues } = (data.optional[date] !== undefined && data.optional[date][game] !== undefined)
                  ? data.optional[date][game]
                  : { serries: 0, outputsWords: 0, trues: 0 };
                seriesActual = seriesActual > serries ? seriesActual : serries;
                truesActual += trues;
                data.optional[date][game].serries = seriesActual;
                data.optional[date][game].trues = truesActual;
                data.optional[date][game].outputsWords = outputsWords + answers;
              } else if (learnedWord) {
                data.learnedWord += 1;
                data.optional[date][game].learnedWords += 1;
              }
              const url = `${this.homeApi}users/${userId}/statistics`;
              fetch(url, {
                method: 'PUT',
                withCredentials: true,
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              });
            }
          });
      }
}
