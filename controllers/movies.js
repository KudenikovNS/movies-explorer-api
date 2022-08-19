const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/AuthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');
const numbersErrors = require('../utils/numbersErrors');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    owner,
    movieId,
  })
    .then((movie) => res.status(numbersErrors.CREATED_GOOD).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            `${Object.values(err.errors)
              .map((error) => error.message)
              .join(', ')}`,
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => Movie.find({})
  .then((movies) => res.status(numbersErrors.GOOD).send(movies))
  .catch(next);

module.exports.deleteMovie = (req, res, next) => {
  const currentUser = req.user._id;
  const movieId = req.params._id;

  return Movie.findById(movieId)
    .orFail(new NotFoundError(`Фильм с id ${movieId} не можем найти`))
    .then((movie) => {
      if (!movie.owner.equals(currentUser)) {
        throw new ForbiddenError('Вы не можете удалите этот фильм');
      }
      return movie.remove().then(() => {
        res.status(numbersErrors.GOOD).send({ data: movie });
      }).catch((err) => {
        next(err);
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestError('Некорректный id'),
        );
      } else {
        next(err);
      }
    });
};
