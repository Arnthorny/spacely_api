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

const orgSearchParamSchema = Joi.object({
  search: Joi.string().trim().min(0),
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

const retrieveOrgInvitesParam = Joi.object({
  status: Joi.string().trim().valid('pending', 'approved', 'rejected'),
});

module.exports = {
  organisationSignupSchema,
  orgIdSchema,
  approveOrRejectInviteSchema,
  orgInviteTokenSchema,
  orgUserIdSchema,
  orgSearchParamSchema,
  retrieveOrgInvitesParam,
};
