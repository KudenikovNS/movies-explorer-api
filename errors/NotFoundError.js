const numbersErrors = require('../utils/numbersErrors');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = numbersErrors.ERROR_NOTFOUND;
  }
}

module.exports = NotFoundError;
