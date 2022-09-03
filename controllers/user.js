const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { getToken } = require('../middlewares/jwt');

const MONGO_DUBLICATE_ERROR_CODE = 11000;
const SOLT_ROUND = 10;

// Ошибки
const BadRequest = require('../error/BadRequest'); // 400
const Unauthorized = require('../error/Unauthorized'); // 401
const NotFound = require('../error/NotFound'); // 404
const ErrorConflict = require('../error/ErrorConflict'); // 409

// возвращает информацию о текущем пользователе
module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => res.send(user))
    .catch(next);
};

// обновляет профиль
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send({ user });
      } else {
        throw new NotFound('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Проверьте введенные данные'));
      } else if (err.code === 11000) {
        next(new ErrorConflict('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

// создаёт пользователя (регистрация)
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  if (!email || !password || !name) {
    throw new BadRequest('Все поля обязательны');
  }
  bcrypt.hash(password, SOLT_ROUND)
    .then((hash) => {
      User.create({
        email, password: hash, name,
      })
        .then((createUser) => {
          res.status(201).send({
            _id: createUser._id,
            name: createUser.name,
            email: createUser.email,
          });
        })
        .catch((err) => {
          if (err.code === MONGO_DUBLICATE_ERROR_CODE) {
            next(new ErrorConflict('Такой ользователь уже существует'));
          } else if (err.name === 'ValidatorError') {
            next(new BadRequest('Данные не валидны'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

// получает из запроса почту и пароль и проверяет их (вход)
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest('Не введен email или пароль');
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Не верный email или пароль');
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized('Не верный email или пароль');
          }
          const token = getToken({ _id: user._id });
          res.cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
            sameSite: true,
          });

          res.status(200).send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

// выход
module.exports.logout = (req, res, next) => {
  try {
    res.clearCookie('jwt');
    res.status(200).send({ message: 'Успешный выход из аккаунта' });
  } catch (err) {
    next(err);
  }
};
