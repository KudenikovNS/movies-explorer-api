const numbersErrors = require('../utils/numbersErrors');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = numbersErrors.CCONFLICT;
  }
}

module.exports = ConflictError;
