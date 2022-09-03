const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');
const {
  validateMovie,
  validateDeleteMovie,
} = require('../middlewares/validation');

router.get('/', getMovies); // возвращает все сохранённые текущим  пользователем фильмы
router.post('/', validateMovie, createMovie); // создаёт фильм
router.delete('/:movieId', validateDeleteMovie, deleteMovie); // удаляет сохранённый фильм по id

module.exports = router;
