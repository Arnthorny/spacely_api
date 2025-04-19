const Joi = require('joi');

const joiRegularRequiredStr = Joi.string().trim().required().min(1);
const joiValidateObjectId = Joi.string().trim().required().length(24);

const userSignupSchema = Joi.object({
  fullName: joiRegularRequiredStr,
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required().trim().min(8),
  role: Joi.string().trim().required().min(2).invalid('admin'),
});

const userIdSchema = Joi.object({
  userId: joiValidateObjectId,
});

module.exports = { userSignupSchema, userIdSchema };
