export default class LangApi {
    static homeApi='https://react-rs-lang.herokuapp.com/';

    static getWordById = (id, func) => {
      if (id !== null) {
        let queryParam = 'words';
        queryParam += `/${id}`;
        fetch(`https://react-rs-lang.herokuapp.com/${queryParam}`).then((d) => d.json()).then((data) => func(data));
      }
    }

    static getWords = (group = 0, page = 0, func) => {
      let queryParam = 'words';
      if (group !== null || page !== null) {
        queryParam += '?';
        queryParam += (group ? `group=${group}` : '') + (page ? `page=${page}` : '');
      }
      fetch(`https://react-rs-lang.herokuapp.com/${queryParam}`).then((d) => d.json()).then((data) => func(data));
    }
}
