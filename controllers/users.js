const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const AuthorizedError = require('../errors/AuthorizedError');
const numbersErrors = require('../utils/numbersErrors');
const ConflictError = require('../errors/ConflictError');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;

  return bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(numbersErrors.CREATED_GOOD).send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            `${Object.values(err.errors)
              .map((error) => error.message)
              .join(', ')}`,
          ),
        );
      } else if (err.code === 11000) {
        next(
          new ConflictError('Такой email уже зарегистрирован'),
        );
      } else {
        next(err);
      }
    });
};

module.exports.getMe = (req, res, next) => {
  const id = req.user._id;

  return User.findById(id)
    .orFail(new NotFoundError(`Пользователя с id ${id} не можем найти`))
    .then((user) => res.status(numbersErrors.GOOD).send(user))
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

module.exports.updateProfile = (req, res, next) => User.findByIdAndUpdate(
  req.user._id,
  {
    name: req.body.name,
    email: req.body.email,
  },
  { new: true, runValidators: true },
)
  .orFail(new NotFoundError(`Пользователя с id ${req.user._id} не можем найти`))
  .then((user) => res.status(numbersErrors.GOOD).send(user))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(
        new BadRequestError(
          `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        ),
      );
    } else if (err.code === 11000) {
      next(
        new ConflictError('Такой email уже зарегистрирован'),
      );
    } else {
      next(err);
    }
  });

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'jwtsecret');
      res.cookie('token', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: 'none',
        // secure: true,
      }).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === numbersErrors.NOTAUTHORIZED_CODE) {
        next(
          new AuthorizedError('Неправильные почта или пароль'),
        );
      } else {
        next(err);
      }
    });
};

module.exports.logout = (req, res, next) => {
  try {
    res.clearCookie('token').send({ message: 'Вы покинули личный кабинет' });
  } catch (err) {
    next(err);
  }
};
