class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = notFoundError;
    this.statusCode = 404;
  }
}

class IncorrectDataError extends Error {
  constructor(message) {
    super(message);
    this.name = incorrectDataError;
    this.statusCode = 400;
  }
}