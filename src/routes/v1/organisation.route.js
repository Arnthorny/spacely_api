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
  '/organisations/invitations/:inviteId/approve',
  AuthWare.tokenAuthentication,
  OrganisationController.approveOrRejectInvite.bind(OrganisationController),
);

// Admin Only Route
router.patch(
  '/organisations/invitations/:inviteId/reject',
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
 *     description: After org is registered, corresponding owner(admin) account is created with credentials sent to org email
 *     tags: [Organisation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrganisationCreateRequestBodySchema'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/OrgCreation201Response'
 *       400:
 *         $ref: '#/components/responses/Generic400ResponseSchema'
 *       422:
 *         $ref: '#/components/responses/Generic422ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */

/**
 * @swagger
 * /api/v1/organisations/{orgId}/invitations:
 *   post:
 *     summary: Create an invite request against organisation
 *     tags: [Organisation]
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         description: Organisation Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInviteSignupRequestSchema'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/UserInviteSignupResponse'
 *       400:
 *         $ref: '#/components/responses/Generic400ResponseSchema'
 *       404:
 *         $ref: '#/components/responses/Generic404ResponseSchema'
 *       422:
 *         $ref: '#/components/responses/Generic422ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */

/**
 * @swagger
 * /api/v1/organisations/invitations/{inviteId}/approve:
 *   patch:
 *     summary: Approve an invite request made by user. Only for Org admins
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inviteId
 *         required: true
 *         description: Invite Request Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserInviteRequestApproveResponse'
 *       401:
 *         $ref: '#/components/responses/Generic401ResponseSchema'
 *       403:
 *         $ref: '#/components/responses/Generic403ResponseSchema'
 *       404:
 *         $ref: '#/components/responses/Generic404ResponseSchema'
 *       422:
 *         $ref: '#/components/responses/Generic422ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */

/**
 * @swagger
 * /api/v1/organisations/invitations/{inviteId}/reject:
 *   patch:
 *     summary: Reject an invite request made by user. Only for Org admins
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inviteId
 *         required: true
 *         description: Invite Request Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserInviteRequestRejectResponse'
 *       401:
 *         $ref: '#/components/responses/Generic401ResponseSchema'
 *       403:
 *         $ref: '#/components/responses/Generic403ResponseSchema'
 *       404:
 *         $ref: '#/components/responses/Generic404ResponseSchema'
 *       422:
 *         $ref: '#/components/responses/Generic422ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */

/**
 * @swagger
 * /api/v1/organisations/{orgId}/invitations/tokens/{token}:
 *   get:
 *     summary: Validate user invite token
 *     description: Endpoint to validate invite token sent to user email, on backend.
 *     tags: [Organisation]
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         description: Organisation Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token to verify invite. Will be sent in a url to user email
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5c
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserInviteRequestApproveWithTokenResponse'
 *       400:
 *         $ref: '#/components/responses/Generic400ResponseSchema'
 *       403:
 *         $ref: '#/components/responses/Generic403ResponseSchema'
 *       404:
 *         $ref: '#/components/responses/Generic404ResponseSchema'
 *       422:
 *         $ref: '#/components/responses/Generic422ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */
