const Joi = require('joi');

const joiValidateObjectId = Joi.string().trim().required().length(24);

const organisationSignupSchema = Joi.object({
  name: Joi.string().trim().required().min(1),
  owner: Joi.string().trim().required().min(1),
  email: Joi.string().email().required(),
});

const orgIdSchema = Joi.object({
  orgId: joiValidateObjectId,
});
const orgUserIdSchema = Joi.object({
  orgId: joiValidateObjectId,
  userId: joiValidateObjectId,
});

const orgInviteTokenSchema = Joi.object({
  orgId: joiValidateObjectId,
  token: Joi.string().trim().required().min(10),
});
const approveOrRejectInviteSchema = Joi.object({
  inviteId: joiValidateObjectId,
});

module.exports = {
  organisationSignupSchema,
  orgIdSchema,
  approveOrRejectInviteSchema,
  orgInviteTokenSchema,
  orgUserIdSchema,
};
