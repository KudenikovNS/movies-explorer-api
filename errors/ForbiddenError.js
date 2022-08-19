const numbersErrors = require('../utils/numbersErrors');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = numbersErrors.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
