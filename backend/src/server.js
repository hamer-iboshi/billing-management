const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const fileUpload = require('express-fileupload');

dotenv.config();
const env = process.env.NODE_ENV || 'development';

if(env === 'test'){
    process.env.MONGODB_URI = process.env.MONGODB_URI_TEST
}

const server = express();
mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true
});

server.use(cors());
server.use(fileUpload());
server.use(express.json());
server.use(routes);
server.listen(process.env.PORT);

module.exports = server;