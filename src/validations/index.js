const hubSchemas = require('./hub.validation');
const authSchemas = require('./auth.validation');
const userSchemas = require('./user.validation');
const organisationSchemas = require('./organisation.validation');
const invitationSchemas = require('./invitation.validation');
const workspaceSchemas = require('./workspace.validation');

const allSchemas = {
  ...hubSchemas,
  ...authSchemas,
  ...userSchemas,
  ...organisationSchemas,
  ...invitationSchemas,
  ...workspaceSchemas,
};

module.exports = allSchemas;
