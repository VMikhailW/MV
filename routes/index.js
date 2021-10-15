const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'any.required': 'Обязательное поле',
      'string.email': 'Требуется ввести адрес электронной почты',
    }),
    password: Joi.string().required().min(8).messages({
      'any.required': 'Обязательное поле',
      'string.min': 'Требуется ввести минимум 8 символов',
    }),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'any.required': 'Обязательное поле',
      'string.email': 'Требуется ввести адрес электронной почты',
    }),
    password: Joi.string().required().min(8).messages({
      'any.required': 'Обязательное поле',
      'string.min': 'Требуется ввести минимум 8 символов',
    }),
    name: Joi.string().required().min(2).max(30)
      .pattern(/^[A-Za-zА-Яа-я\s]{1,}$/)
      .messages({
        'any.required': 'Обязательное поле',
        'string.length': 'Требуется ввести от 2 до 30 символов',
        'string.pattern.base': 'Требуется ввести символы русского или английского алфавита',
      }),
  }),
}), createUser);

router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);

router.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
