/* Подключение компонентов */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthorizedError = require('../errors/AuthorizedError');

/* Схема для пользователей */
const userSchema = new mongoose.Schema(
  {
    /* Схема для адреса электронной почты */
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(v) {
          return validator.isEmail(v);
        },
      },
    },
    /* Схема для пароля */
    password: {
      type: String,
      required: true,
      select: false,
    },
    /* Схема для имени */
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
  },
);

/* Поиск пользователя по почте и паролю */
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  const errorMessage = 'Неправильные почта или пароль';
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizedError(errorMessage));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizedError(errorMessage));
          }
          return user;
        });
    });
};

/* Создаем и экспортируем модель пользователя */
module.exports = mongoose.model('user', userSchema);
