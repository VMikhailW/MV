const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const NotValidError = require('../errors/not-valid-err');
const AuthError = require('../errors/auth-err');
const UniqueError = require('../errors/unique-err');

module.exports.getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь не найден'));
      }
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new NotValidError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    email: req.body.email,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new NotValidError('Переданы некорректные данные'));
      }
      if (err.name === 'MongoError') {
        next(new UniqueError('Этот Email уже зарегистрирован'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      user: {
        name: user.name,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError' || err.error === 'Bad Request') {
        next(new NotValidError('Переданы некорректные данные'));
      }
      if (err.name === 'MongoError') {
        next(new UniqueError('Этот Email уже зарегистрирован'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({
        user: {
          name: user.name,
          email: user.email,
        },
        token,
      });
    })
    .catch(() => next(new AuthError('Неправильный Email или пароль')));
};
