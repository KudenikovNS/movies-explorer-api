/* Подключение компонентов */
const mongoose = require('mongoose');
const { isURL } = require('validator');

/* Схема для фильмов */
const movieSchema = new mongoose.Schema({
  /* Схема для страны создания фильма */
  country: {
    type: String,
    required: true,
  },
  /* Схема для режиссера фильма */
  director: {
    type: String,
    required: true,
  },
  /* Схема для длительности фильма */
  duration: {
    type: Number,
    required: true,
  },
  /* Схема для года выпуска фильма */
  year: {
    type: String,
    required: true,
  },
  /* Схема для описания фильма */
  description: {
    type: String,
    required: true,
  },
  /* Схема для постер к фильму */
  image: {
    type: String,
    validate: isURL,
  },
  /* Схема для трейлера к фильму */
  trailerLink: {
    type: String,
    validate: isURL,
  },
  /* Схема для миниатюрного изображения постера к фильму */
  thumbnail: {
    type: String,
    validate: isURL,
  },
  /* Схема для _id пользователя, который сохранил фильм */
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  /* Схема для id фильма, который содержится в ответе сервиса MoviesExplorer */
  movieId: {
    type: Number,
    required: true,
  },
  /* Схема для названия фильма на русском языке */
  nameRU: {
    type: String,
    required: true,
  },
  /* Схема для названия фильма на английском языке */
  nameEN: {
    type: String,
    required: true,
  },
});

/* Создаем и экспортируем модель фльмов */
module.exports = mongoose.model('movie', movieSchema);
