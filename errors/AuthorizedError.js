const numbersErrors = require('../utils/numbersErrors');

class AuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = numbersErrors.NOTAUTHORIZED_CODE;
  }
}

module.exports = AuthorizedError;
