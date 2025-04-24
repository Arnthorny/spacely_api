const Joi = require('joi');

const joiValidateObjectId = Joi.string().trim().required().length(24);

const getWorkspacesSchema = Joi.object({
  day: Joi.date(),
  // status: Joi.string().trim().valid('pending', 'checkedIn', 'cancelled'),
});

const createWorkspaceBookingParamsSchema = Joi.object({
  hubId: joiValidateObjectId,
  workspaceId: joiValidateObjectId,
});

const createWorkspaceBookingBodySchema = Joi.object({
  description: Joi.string().trim().required().min(1),
  startTime: Joi.date().min(Date.now()).required(),
  endTime: Joi.date().min(Date.now()).required(),
});

const editWorkspaceBookingParamsSchema = Joi.object({
  hubId: joiValidateObjectId,
  workspaceId: joiValidateObjectId,
  bookingId: joiValidateObjectId,
});

const editWorkspaceBookingBodySchema = Joi.object({
  description: Joi.string().trim().min(1),
  startTime: Joi.date().min(Date.now()),
  endTime: Joi.date().min(Date.now()),
});

const checkInBookingParamSchema = Joi.object({
  hubId: joiValidateObjectId,
  code: Joi.string().length(8).alphanum(),
});
module.exports = {
  getWorkspacesSchema,
  createWorkspaceBookingParamsSchema,
  createWorkspaceBookingBodySchema,
  editWorkspaceBookingParamsSchema,
  editWorkspaceBookingBodySchema,
  checkInBookingParamSchema
};
