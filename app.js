const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const { limiter } = require('./utils/configuration');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, ADRESBD = 'mongodb://localhost:27017/moviesdb' } = process.env;
const app = express();

app.use(cookieParser());

app.use(cors({
  origin: 'kudenikovns.diplom.nomoredomains.sbs',
  credentials: true,
}));

mongoose.connect(ADRESBD);

app.use(requestLogger);

app.use(limiter);

app.use(helmet());
app.use('/', router);
app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
