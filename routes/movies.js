const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getSavedFilms, createFilm, deleteFilm } = require('../controllers/movies');

router.get('/', getSavedFilms);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().messages({
      'any.required': 'Обязательное поле',
    }),
    director: Joi.string().required().messages({
      'any.required': 'Обязательное поле',
    }),
    duration: Joi.number().required().messages({
      'any.required': 'Обязательное поле',
    }),
    year: Joi.string().required().messages({
      'any.required': 'Обязательное поле',
    }),
    description: Joi.string().required().messages({
      'any.required': 'Обязательное поле',
    }),
    image: Joi.string().required().pattern(/^https?:\/\/(w{3}\.)?[\w\-.~:/?#[\]@!$&'\\()*+,;=]/).messages({
      'any.required': 'Обязательное поле',
      'string.pattern.base': 'Требуется ввести URL',
    }),
    trailer: Joi.string().required().pattern(/^https?:\/\/(w{3}\.)?[\w\-.~:/?#[\]@!$&'\\()*+,;=]/).messages({
      'any.required': 'Обязательное поле',
      'string.pattern.base': 'Требуется ввести URL',
    }),
    thumbnail: Joi.string().required().pattern(/^https?:\/\/(w{3}\.)?[\w\-.~:/?#[\]@!$&'\\()*+,;=]/).messages({
      'any.required': 'Обязательное поле',
      'string.pattern.base': 'Требуется ввести URL',
    }),
    nameRU: Joi.string().required().pattern(/^[А-Яа-я\s\w\S]{1,}$/).messages({
      'any.required': 'Обязательное поле',
      'string.pattern.base': 'Требуется ввести символы русского алфавита',
    }),
    nameEN: Joi.string().required().pattern(/^[\s\w\S]{1,}$/).messages({
      'any.required': 'Обязательное поле',
      'string.pattern.base': 'Требуется ввести символы английского алфавита',
    }),
    movieId: Joi.number().required().messages({
      'any.required': 'Обязательное поле',
    }),
  }),
}), createFilm);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().messages({
      'string.string': 'Требуется ввести строку',
    }),
  }),
}), deleteFilm);

module.exports = router;
