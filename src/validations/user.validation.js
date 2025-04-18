const Joi = require('joi');

const joiRegularRequiredStr = Joi.string().trim().required().min(1);

const userSignupSchema = Joi.object({
  fullname: joiRegularRequiredStr,
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().trim().min(8),
  role: Joi.string().trim().required().min(2),
});

module.exports = { userSignupSchema };
