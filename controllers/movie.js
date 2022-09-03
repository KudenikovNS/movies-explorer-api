const Movie = require('../models/movie');

// Ошибки
const BadRequest = require('../error/BadRequest'); // 400
const NotFound = require('../error/NotFound'); // 404
const Forbidden = require('../error/Forbidden'); // 403

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Проверьте введенные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(() => new NotFound('Фильм не найден'))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id.toString()) {
        return Movie.findByIdAndRemove(movieId)
          .then(() => res.send({ message: 'Фильм удален' }));
      }
      return next(new Forbidden('У вас нет прав для удаления этого фильма'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Проверьте введенные данные'));
      } else {
        next(err);
      }
    });
};
