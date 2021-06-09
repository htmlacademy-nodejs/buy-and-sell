'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const schema = Joi.object({
  name: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+/).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)),
  avatar: Joi.string().required()
});

module.exports = (service) => async (req, res, next) => {
  const newUser = req.body;
  const {error} = schema.validate(newUser);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  const userByEmail = await service.findByEmail(req.body.email);

  if (userByEmail) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Email is already in use`);
  }

  return next();
};
