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

const resetPasswordTokenSchema = Joi.object({
  password: joiRegularRequiredStr,
  confirmPassword: Joi.ref('password'),
  token: Joi.string().trim().min(10),
});

const resetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = {
  setInitialPasswordSchema,
  userLoginSchema,
  resetPasswordTokenSchema,
  resetEmailSchema,
};
