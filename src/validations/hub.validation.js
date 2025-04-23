const Joi = require('joi');

const joiValidateObjectId = Joi.string().trim().required().length(24);

const hubIdSchema = Joi.object({
  orgId: joiValidateObjectId,
});

module.exports = { hubIdSchema };
