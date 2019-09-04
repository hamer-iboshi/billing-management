import axios from 'axios';
const dotenv = require('dotenv');

dotenv.config();

const api = axios.create({
    baseURL: process.env.BASE_URL
});

export default api;