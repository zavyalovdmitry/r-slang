export default class LangApi {
    static homeApi='https://react-rs-lang.herokuapp.com/';

    static wordGoal={
      hard: 12, low: 6, del: 0, success: 0,
    };

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

    static TestLogIn = (email, password) => {
      const signin = {
        email,
        password,
      };
      return fetch(`${this.homeApi}signin`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signin),
      });
    }

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
        if (!(wordIsSearched && SearchedWord.error !== undefined)) {
          let series; let global; let wrong;
          const method = wordIsSearched ? 'PUT' : 'POST';
          if (wordIsSearched && SearchedWord.optional !== undefined) {
            // eslint-disable-next-line max-len
            series = (SearchedWord.optional.series !== undefined && SearchedWord.optional.series >= 0)
              ? SearchedWord.optional.series : 0;
            // eslint-disable-next-line max-len
            global = (SearchedWord.optional.global !== undefined && SearchedWord.optional.global >= 0)
              ? SearchedWord.optional.global : 0;
            // eslint-disable-next-line max-len
            wrong = (SearchedWord.optional.wrong !== undefined && SearchedWord.optional.wrong >= 0)
              ? SearchedWord.optional.wrong : 0;
          } else {
            series = 0; global = 0; wrong = 0;
          }

          // eslint-disable-next-line no-nested-ternary
          let difficulty = (wordIsSearched
                && SearchedWord.difficulty !== undefined
                && Object.prototype.hasOwnProperty.call(this.wordGoal, SearchedWord.difficulty))
            // eslint-disable-next-line no-nested-ternary
            ? SearchedWord.difficulty : (status === null ? 'low' : (status ? 'hard' : 'del'));

          if (action !== null) {
            global += 1;
            if (action) {
              series += 1;
              if (series >= this.wordGoal[difficulty] && (difficulty !== 'del' || difficulty !== 'success')) {
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
          fetch(`${this.homeApi}users/${userId}/words/${wordId}`, {
            method,
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(word),
          });
        }
      })
}
