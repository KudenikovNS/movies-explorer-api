const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleError = require('./middlewares/handleError');
const router = require('./routes');

const { PORT = 3000, DB_CONNECT = 'mongodb://localhost:27017/moviesdb' } = process.env;

const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'https://kudenikovns.diplom.nomoredomains.sbs/',
    'https://kudenikovns.diplom.nomoredomains.sbs/',
  ],
  credentials: true,
};
app.use('*', cors(options)); // доступность cors

app.use(cookieParser()); // куки
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_CONNECT); // подключение к базе

app.use(requestLogger); // логгер запросов

app.use(helmet());

app.use(limiter);

app.use('/', router); // все роуты

app.use(errorLogger); // логгер запросов с ошибками

app.use(errors()); // ошибки от celebrate

app.use(handleError); // ЦО

app.listen(PORT);
