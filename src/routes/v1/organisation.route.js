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

/**
 * @swagger
 * /api/v1/organisations:
 *   post:
 *     summary: Register an organisation
 *     tags: [Organisation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrganisationCreateRequestBodySchema'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/OrgCreation201ResponseSchema'
 *       400:
 *         $ref: '#/components/responses/Generic400ResponseSchema'
 *
 *       401:
 *         $ref: '#/components/responses/Generic401ResponseSchema'
 *       422:
 *         $ref: '#/components/responses/Generic422ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */
