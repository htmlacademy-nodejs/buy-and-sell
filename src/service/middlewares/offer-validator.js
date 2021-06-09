'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const schema = Joi.object({
  categories: Joi.array().items(
      Joi.number().integer().positive()
  ).min(1).required(),
  title: Joi.string().min(10).max(100).required(),
  description: Joi.string().min(50).max(1000).required(),
  picture: Joi.string().required(),
  type: Joi.any().valid(`OFFER`, `SALE`).required(),
  sum: Joi.number().integer().greater(100).required(),
  userId: Joi.number().integer().positive().required()
});

module.exports = (req, res, next) => {
  const newOffer = req.body;
  const {error} = schema.validate(newOffer);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
