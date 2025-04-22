const router = require('express').Router();

const { OrganisationController } = require('../../controllers');
const AuthWare = require('../../middlewares/auth_middleware');

router.post(
  '/organisations',
  OrganisationController.createOrganisation.bind(OrganisationController),
);

router.get(
  '/organisations',
  OrganisationController.retrieveOrganisations.bind(OrganisationController),
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

router.get(
  '/organisations/invitations',
  AuthWare.tokenAuthentication,
  OrganisationController.getAllInviteRequests.bind(OrganisationController),
);

router.get(
  '/organisations/invitations/:inviteId',
  AuthWare.tokenAuthentication,
  OrganisationController.getSpecificInviteRequests.bind(OrganisationController),
);

router.get(
  '/organisations/:orgId',
  OrganisationController.getSpecificOrganisation.bind(OrganisationController),
);

module.exports = router;

/**
 * @swagger
 * /api/v1/organisations:
 *   post:
 *     summary: Register an organisation
 *     description: >
 *       Endpoint to create a new organisation
 *
 *
 *       After org is registered on the frontend, a request is made to this endpoint and a corresponding owner(admin)
 *       account is created. The credentials of the newly created admin account is sent to the organisation's email.
 *
 *
 *       These credentials can then be used to sign in to the admin dashboard and thus perform authorised requests.
 *
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
 * /api/v1/organisations:
 *   get:
 *     summary: Get list of organisations
 *     description: >
 *       Endpoint to retrieve list of organisations
 *
 *
 *       This endpoint uses an optional `search` parameter to filter the list of organiations that
 *       will be retrieved. If this parameter is not passed or is passed but left empty, a list
 *       of all organisations are retrieved
 *     tags: [Organisation]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         description: Search parameter to filter organisations by their name.
 *         schema:
 *           type: string
 *           example: ALX
 *     responses:
 *       200:
 *         $ref: '#/components/responses/OrganisationRetrieveListSchema'
 *       422:
 *         $ref: '#/components/responses/Generic422ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */

/**
 * @swagger
 * /api/v1/organisations/{orgId}:
 *   get:
 *     summary: Get details of specific organisation.
 *     description: >
 *       Endpoint to retrieve specific organisation using `orgId`
 *
 *
 *       This endpoint uses the orgId path parameter to find a specific organisation. If the `orgId`
 *       is not found, throw a 404.
 *
 *
 *     tags: [Organisation]
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         description: Organisation Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SpecificOrganisationResponseSchema'
 *       404:
 *         $ref: '#/components/responses/Generic404ResponseSchema'
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
 *     description: >
 *       Endpoint to request an invite from a sepcific organisation
 *
 *
 *       On the frontend, this endpoint is used when a user wants to gain first-time access to the service.
 *       They need to get an invite from an existing organisation, and this endpoint is used
 *       to create/send out such invite requests
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
 *     description: >
 *       Endpoint for admin to approve an invite requeest
 *
 *
 *       On the frontend, this endpoint is used in the admin's dashboard by an admin to accept an invite request.
 *
 *
 *       This endpoint requires a bearer token to be sent in the header to authorize/
 *       authenticate a user's identity. This bearer token is got from the response to a successful
 *       signin request and is usually stored in the `accessToken`key in the `data` object of that response.
 *
 *
 *       The endpoint also requires that valid requests can only be made by admins of an organisation.
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
 *     description: >
 *       Endpoint for admin to reject an invite requeest
 *
 *
 *       On the frontend, this endpoint is used at the admin's dashboard by an admin to reject an invite request.
 *
 *
 *       This endpoint requires a bearer token to be sent in the header to authorize/
 *       authenticate a user's identity. This bearer token is got from the response to a successful
 *       signin request and is usually stored in the `accessToken`key in the `data` object of that response.
 *
 *
 *       The endpoint also requires that valid requests can only be made by admins of an organisation.
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
 *     description: >
 *       Endpoint to validate invite token sent to user email.
 *
 *
 *       On the frontend, a `GET` request to this endpoint is used to verify an invite token. The response of a successful
 *       verification request contains a userId field in its data object. The value of this field is subsequently used as the
 *       path parameter in making a request to the password setup endpoint (/api/v1/users/:userId/setup-password),
 *       in order for the user to set their password for the first time
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

/**
 * @swagger
 * /api/v1/organisations/invitations/{inviteId}:
 *   get:
 *     summary: Get specific invite tied to admin's organisation.
 *     tags: [Admin]
 *     description: >
 *       Endpoint to get specific invite request made against an organisation.
 *
 *
 *       On the frontend, a `GET` request to this endpoint is used in the admin dashboard to display a specific invite request,
 *       after which the admin can decide whether to appprove, reject or ignore the request.
 *
 *
 *       This endpoint requires a bearer token to be sent in the header to authorize/
 *       authenticate a user's identity.
 *       It also requires that the user associated with that bearer token be an admin. Otherwise, a 403 is thrown
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inviteId
 *         required: true
 *         description: Invite Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SpecificInviteResponseSchema'
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
 * /api/v1/organisations/invitations:
 *   get:
 *     summary: Get all invites tied to admin's organisation.
 *     tags: [Admin]
 *     description: >
 *       Endpoint to get all invite requests made against an organisation.
 *
 *
 *       On the frontend, a `GET` request to this endpoint is used on the admin dashboard to display all invite requests,
 *       after which the admin can decide which request to either appprove or reject.
 *
 *
 *       This endpoint requires a bearer token to be sent in the header to authorize/authenticate a user's identity.
 *       It also requires that the user associated with that bearer token be an admin. Otherwise, a 403 is thrown
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AllInvitesResponseSchema'
 *       401:
 *         $ref: '#/components/responses/Generic401ResponseSchema'
 *       403:
 *         $ref: '#/components/responses/Generic403ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */
