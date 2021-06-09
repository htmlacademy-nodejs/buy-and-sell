'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorOfferMessage = {
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  TITLE_MIN: `Заголовок содержит меньше 10 символов`,
  TITLE_MAX: `Заголовок не может содержать более 100 символов`,
  DESCRIPTION_MIN: `Описание содержит меньше 50 символов`,
  DESCRIPTION_MAX: `Заголовок не может содержать более 1000 символов`,
  PICTURE: `Изображение не выбрано или тип изображения не поддерживается`,
  TYPE: `Не выбран ни один тип объявления`,
  SUM: `Сумма не может быть меньше 100`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const schema = Joi.object({
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorOfferMessage.CATEGORIES
      })
  ).min(1).required(),
  title: Joi.string().min(10).max(100).required().messages({
    'string.min': ErrorOfferMessage.TITLE_MIN,
    'string.max': ErrorOfferMessage.TITLE_MAX
  }),
  description: Joi.string().min(50).max(1000).required().messages({
    'string.min': ErrorOfferMessage.DESCRIPTION_MIN,
    'string.max': ErrorOfferMessage.DESCRIPTION_MAX
  }),
  picture: Joi.string().required().messages({
    'string.empty': ErrorOfferMessage.PICTURE
  }),
  type: Joi.any().valid(`OFFER`, `SALE`).required().messages({
    'any.required': ErrorOfferMessage.TYPE
  }),
  sum: Joi.number().integer().min(100).required().messages({
    'number.min': ErrorOfferMessage.SUM
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorOfferMessage.USER_ID
  })
});

module.exports = (req, res, next) => {
  const newOffer = req.body;
  const {error} = schema.validate(newOffer, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
