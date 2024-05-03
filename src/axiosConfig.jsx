
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://greenvelvet.alwaysdata.net/pfc',
    timeout: 5000,
});

export default instance;