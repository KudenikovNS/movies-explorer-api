const numbersErrors = require('../utils/numbersErrors');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = numbersErrors.ERROR_BADREQUEST;
  }
}

module.exports = BadRequestError;
