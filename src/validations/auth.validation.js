const Joi = require('joi');

const joiRegularRequiredStr = Joi.string().trim().required().min(1);

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: joiRegularRequiredStr,
});

const setInitialPasswordSchema = Joi.object({
  token: Joi.string().trim().required().min(10),
  password: joiRegularRequiredStr,
  confirmPassword: Joi.ref('password'),
});

module.exports = { setInitialPasswordSchema, userLoginSchema };
