const router = require('express').Router();

const { OrganisationController } = require('../../controllers');
const AuthWare = require('../../middlewares/auth_middleware');

router.post(
  '/organisations',
  OrganisationController.createOrganisation.bind(OrganisationController),
);

router.post(
  '/organisations/:orgId/invitations',
  OrganisationController.userRequestOrgInvite.bind(OrganisationController),
);

// Admin only Route
router.patch(
  '/organisations/:orgId/invitations/:inviteId/approve',
  AuthWare.tokenAuthentication,
  OrganisationController.approveOrRejectInvite.bind(OrganisationController),
);

// Admin Only Route
router.patch(
  '/organisations/:orgId/invitations/:inviteId/reject',
  AuthWare.tokenAuthentication,
  OrganisationController.approveOrRejectInvite.bind(OrganisationController),
);

router.get(
  '/organisations/:orgId/invitations/tokens/:token',
  OrganisationController.checkInviteToken.bind(OrganisationController),
);

module.exports = router;
