const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const limiter = require('./middlewares/limit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleError = require('./middlewares/handleError');
const router = require('./routes');

const { PORT = 3000, DB_CONNECT = 'mongodb://localhost:27017/moviesdb' } = process.env;

const app = express();

app.use(cors);

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
