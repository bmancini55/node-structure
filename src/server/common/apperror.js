

var util = require('util');

function AppError(msg, type) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.message = msg;
  this.type = type;
  this.name = 'Application Error';
}

util.inherits(AppError, Error);

module.exports = AppError;

AppError.createValidation = function createValidation(msg) {
  return new AppError(msg, 'validation');
}

AppError.createInvalid = function createInvalid(msg) {
  return new AppError(msg, 'invalid');
}