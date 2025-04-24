const Joi = require('joi');

const joiValidateObjectId = Joi.string().trim().required().length(24);

const hubIdSchema = Joi.object({
  hubId: joiValidateObjectId,
});

module.exports = { hubIdSchema };
