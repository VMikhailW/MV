const Movie = require('../models/movie');
const NotValidError = require('../errors/not-valid-err');
const NotFoundError = require('../errors/not-found-err');
const RootError = require('../errors/root-err');

module.exports.getSavedFilms = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createFilm = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((film) => res.send(film))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError' || err.error === 'Bad Request') {
        next(new NotValidError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.deleteFilm = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) throw new NotFoundError('Данные не найдены');
      if (!movie.owner.equals(req.user._id)) throw new RootError('Ошибка доступа');
      movie.remove()
        .then(() => res.send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new NotValidError('Переданы некорректные данные'));
      }
      next(err);
    });
};
