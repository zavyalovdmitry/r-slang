export default class LangApi {
    static homeApi='https://react-rs-lang.herokuapp.com/';

    static userApiReg = 'users';

    static userApiLog = 'signin';

    static wordGoal={
      hard: 12, low: 6, del: 0, success: 0,
    };

    static querys = [
      '{"userWord.difficulty":{ "$not": {"$in": ["del","success"]}}}',
      '{"userWord.difficulty": {"$in": ["hard","low"]}}',
      '{"userWord.difficulty": {"$eq": "hard"}}',
      '{"userWord.difficulty": {"$in": ["del","success"]}}',
    ];

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

      const query = encodeURIComponent(this.querys[qry]);

      const url = `${this.homeApi}users/${userId}/aggregatedWords?${chosenGroup}page=${page}&wordsPerPage=20&filter=${query}`;
      console.log(url);
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
          const pageCount = Math.ceil(words[0].totalCount[0].count / 20);
          const data = words[0].paginatedResults;
          return { pages: pageCount, data };
        });
    }

    // action: false -not guessed, true - guessed, null - just add
    // status: false - del, true - hard, null - low
    // eslint-disable-next-line max-len
    static updateUserWords = (userId, token, wordId, action = null, status = null) => this.getUserWords(userId, token, wordId)
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
        difficulty = status === false ? 'del' : (status === true ? 'hard' : difficulty);

        if (wordIsSearched && SearchedWord.optional !== undefined) {
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

      /*static urlForSearchCount = (grExist, i, query) => {
        let filter;
        if (grExist) filter = encodeURIComponent(`{"$and":[${this.querys[query]}, {"page": ${i}}] `);
        else filter= encodeURIComponent(this.querys[query]);
        const url = `${this.homeApi}users/${userId}/aggregatedWords?${gr}${i}&wordsPerPage=1&filter=${query}`;
      }*/

      static groupCount = async (userId, token, group = null, qry = 0) => {
        const check = [];
        const query = encodeURIComponent(this.querys[qry]);
        const grExist = group !== null;
        const gr = grExist ? `group=${group}&page=` : 'group=';
        const max = grExist ? 30 : 6;
        for (let i = 0; i < max; i += 1) {
          const url = `${this.homeApi}users/${userId}/aggregatedWords?${gr}${i}&wordsPerPage=1&filter=${query}`;
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
              console.log(words);
              const pageCount = words[0].totalCount.length > 0 ? words[0].totalCount[0].count : 0;
              return pageCount > 0;
            });
        }
        const res = await Promise.all(check).then((values) => values);
        console.log(res);
        return res;
      }
}
