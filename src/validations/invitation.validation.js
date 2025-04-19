const Joi = require('joi');

const joiValidateObjectId = Joi.string().trim().required().length(24);

const inviteIdSchema = Joi.object({
  inviteId: joiValidateObjectId,
});

module.exports = { inviteIdSchema };
