require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { errorsHandler } = require('./middlewares/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimiter');

const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true, // make this true
  autoIndex: true, // make this also true
});

// cors
const whitelist = [
  'https://localhost:3001',
  'http://localhost:3001',
  'http://kudenikovns.diplom.nomoredomains.sbs/',
  'https://kudenikovns.diplom.nomoredomains.sbs/',
];

const CORS_CONFIG = {
  credentials: true,
  origin: (origin, callback) => {
    // allow requests with no origin
    // return callback(new Error(origin), false);
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      const message = `!The CORS policy for this origin doesn't allow access from the particular origin: ${origin}`;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  },
};

app.use(cors(CORS_CONFIG));
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(cookieParser()); // подключаем парсер кук как мидлвэр
app.use(requestLogger); // подключаем логгер запросов
app.use(express.json());

app.use(limiter);
app.use(router);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  // console.log(`server listen port ${PORT}`);
});
