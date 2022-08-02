require('dotenv').config();
const jwt = require('jsonwebtoken');

const AuthorizedError = require('../errors/AuthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) throw new AuthorizedError('Требуется авторизация!');

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'jwtsecret');
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next(
        new AuthorizedError('Требуется авторизация'),
      );
    } else {
      next(err);
    }
  }
  req.user = payload;
  next();
};
