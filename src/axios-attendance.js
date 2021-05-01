import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://attendance-68c8a-default-rtdb.firebaseio.com/',
});

export default instance;
