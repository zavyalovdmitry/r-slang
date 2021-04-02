import axios from 'axios';

const addr = 'https://react-rs-lang.herokuapp.com';

export default axios.create({
  baseURL: `${addr}`,
  headers: {
    'Content-type': 'application/json',
  },
});
