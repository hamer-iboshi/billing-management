const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const fileUpload = require('express-fileupload');

dotenv.config();

const server = express();
mongoose.connect(process.env.DB_CONN,{
    useNewUrlParser: true
});

server.use(cors());
server.use(fileUpload());
server.use(express.json());
server.use(routes);
server.listen(process.env.PORT);