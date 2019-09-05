import axios from 'axios';
const dotenv = require('dotenv');

dotenv.config();

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

export default api;