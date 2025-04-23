const Joi = require('joi');

const findWorkspaceRequestSchema = Joi.object({
  status: Joi.string().trim().valid('free'),
  startTime: Joi.date().min(Date.now()),
  endTime: Joi.date().min(Date.now()),
}).with('startTime', 'endTime');

module.exports = { findWorkspaceRequestSchema };
