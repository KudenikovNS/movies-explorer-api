/* Подключение компонентов */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const errorsHandler = require('./middlewares/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');

/* PORT для сервера */
const { PORT = 3000 } = process.env;

/* Приложение express */
const app = express();

/* Подключение БД */
mongoose.connect('mongodb://localhost:27017/moviesdb');

/* Добавление обработчиков */
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors);
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

/* Для подклбчения сервера */
app.listen(PORT);
