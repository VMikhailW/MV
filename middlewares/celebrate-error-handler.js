const { CelebrateError } = require('celebrate');
const NotValidError = require('../errors/not-valid-err');

module.exports = (err, req, res, next) => {
  if (err instanceof CelebrateError) {
    next(new NotValidError('Переданы некорректные данные'));
  }
  next(err);
};
