const numbersErrors = require('../utils/numbersErrors');

const errorsHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || numbersErrors.ERROR_INTERNALSERVER;

  const message = statusCode === numbersErrors.ERROR_INTERNALSERVER
    ? 'На сервере что-то произашло'
    : err.message;
  res.status(statusCode).send({ message });
  next();
};

module.exports = errorsHandler;
