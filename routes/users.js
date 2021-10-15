const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getProfile, updateProfile } = require('../controllers/users');

router.get('/me', getProfile);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'any.required': 'Обязательное поле',
      'string.email': 'Требуется ввести адрес электронной почты',
    }),
    name: Joi.string().required().min(2).max(30)
      .pattern(/^[A-Za-zА-Яа-я\s]{1,}$/)
      .messages({
        'any.required': 'Обязательное поле',
        'string.length': 'Требуется ввести от 2 до 30 символов',
        'string.pattern.base': 'Требуется ввести символы русского или английского алфавита',
      }),
  }),
}), updateProfile);

module.exports = router;
