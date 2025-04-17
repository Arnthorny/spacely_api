const Joi = require('joi');

const organisationSignupSchema = Joi.object({
  name: Joi.string().trim().required().min(1),
  owner: Joi.string().trim().required().min(1),
  email: Joi.string().email(),
});

module.exports = { organisationSignupSchema };
