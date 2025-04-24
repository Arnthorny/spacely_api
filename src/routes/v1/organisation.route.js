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
  '/organisations/hubs',
  AuthWare.tokenAuthentication,
  OrganisationController.getAllOrgHubs.bind(OrganisationController),
);

router.get(
  '/organisations/hubs/:hubId',
  AuthWare.tokenAuthentication,
  OrganisationController.getSpecificOrgHub.bind(OrganisationController),
);

router.get(
  '/organisations/hubs/:hubId/workspaces',
  AuthWare.tokenAuthentication,
  OrganisationController.getAllHubWorkspaces.bind(OrganisationController),
);

router.post(
  '/organisations/hubs/:hubId/workspaces/:workspaceId/bookings',
  AuthWare.tokenAuthentication,
  OrganisationController.createWorkspaceBooking.bind(OrganisationController),
);

// Update a booking
router.patch(
  '/organisations/hubs/:hubId/workspaces/:workspaceId/bookings/:bookingId',
  AuthWare.tokenAuthentication,
  OrganisationController.updateWorkspaceBooking.bind(OrganisationController),
);

// Cancel a booking
router.patch(
  '/organisations/hubs/:hubId/workspaces/:workspaceId/bookings/:bookingId/cancel',
  AuthWare.tokenAuthentication,
  OrganisationController.cancelWorkspaceBooking.bind(OrganisationController),
);

router.patch(
  '/organisations/hubs/:hubId/workspaces/checkIn/:code',
  AuthWare.tokenAuthentication,
  OrganisationController.checkInWorkspaceBooking.bind(OrganisationController),
);

// Keep as last route due to express routing rules
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
 *     parameters:
 *       - in: path
 *         name: status
 *         description: Status of invite request. Filter by status if given.
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
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

/**
 * @swagger
 * /api/v1/organisations/hubs:
 *   get:
 *     summary: Get all hubs tied to an organisation.
 *     tags: [Hub]
 *     description: >
 *       Endpoint to get all hubs added by an organisation.
 *
 *       On the frontend, a `GET` request to this endpoint is used on the user dashboard to display all hubs tied to a user's organisation.
 *
 *       A user can then select which of the hubs they'd like to book from.
 *
 *
 *       This endpoint requires a bearer token to be sent in the header to authorize/authenticate a user's identity.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/HubRetrieveListResponseSchema'
 *       401:
 *         $ref: '#/components/responses/Generic401ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */

/**
 * @swagger
 * /api/v1/organisations/hubs/{hubId}:
 *   get:
 *     summary: Get specific hub tied to admin's organisation.
 *     tags: [Hub]
 *     description: >
 *       Endpoint to get specific hub tied to an organisation.
 *
 *
 *       On the frontend, a `GET` request to this endpoint is used on the user dashboard to get info about a specific hub,
 *
 *
 *       This endpoint requires a bearer token to be sent in the header to authorize/authenticate a user's identity.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hubId
 *         required: true
 *         description: Hub Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         $ref: '#/components/responses/HubRetrieveSingleResponseSchema'
 *       401:
 *         $ref: '#/components/responses/Generic401ResponseSchema'
 *       404:
 *         $ref: '#/components/responses/Generic404ResponseSchema'
 *       422:
 *         $ref: '#/components/responses/Generic422ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */

/**
 * @swagger
 * /api/v1/organisations/hubs/{hubId}/workspaces:
 *   get:
 *     summary: Get workspace bookings for given hub on given day.
 *     tags: [Workspace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: day
 *         required: true
 *         description: Day for which to retrieve workspace details
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2017-07-21T17:32:28Z
 *       - in: path
 *         name: hubId
 *         required: true
 *         description: Hub Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *     description: >
 *       Endpoint to get details on every workspace in a hub for a given `day`.
 *
 *
 *       On the frontend, a `GET` request to this endpoint is sent on the user dashboard to populate
 *       the calendar grid with information about every workspace in that hub for that given day
 *
 *
 *       This endpoint requires a bearer token to be sent in the header to authorize/authenticate a user's identity.
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AllWorkspacesAndBookingsForDayResponseSchema'
 *       401:
 *         $ref: '#/components/responses/Generic401ResponseSchema'
 *       404:
 *         $ref: '#/components/responses/Generic404ResponseSchema'
 *       422:
 *         $ref: '#/components/responses/Generic422ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */

/**
 * @swagger
 * /api/v1/organisations/hubs/{hubId}/workspaces/{workspaceId}/bookings:
 *   post:
 *     summary: Creates a booking for a user at a given hub
 *     description: >
 *       Endpoint to request a booking space from a hub in a user's organisation
 *
 *
 *       On the frontend, this endpoint is used when a user wants to create a booking from the FE.
 *
 *
 *       This endpoint requires a bearer token to be sent in the header to authorize/authenticate a user's identity.
 *     tags: [Workspace]
 *     parameters:
 *       - in: path
 *         name: hubId
 *         required: true
 *         description: Hub Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         description: Workspace Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateBookingSchema'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/BookingCreationSingleResponseSchema'
 *       400:
 *         $ref: '#/components/responses/Generic400ResponseSchema'
 *       401:
 *         $ref: '#/components/responses/Generic401ResponseSchema'
 *       404:
 *         $ref: '#/components/responses/Generic404ResponseSchema'
 *       422:
 *         $ref: '#/components/responses/Generic422ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */

/**
 * @swagger
 * /api/v1/organisations/hubs/{hubId}/workspaces/{workspaceId}/bookings/{bookingId}:
 *   patch:
 *     summary: Edit a user booking.
 *     tags: [Workspace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hubId
 *         required: true
 *         description: Hub Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         description: Workspace Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *       - in: path
 *         name: bookingId
 *         required: true
 *         description: Booking Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *     description: >
 *       Endpoint for a user to edit a booking request
 *
 *
 *       On the frontend, this endpoint is used on the user's dashboard and allows a user edit a booking they had erstwhile made.
 *
 *
 *       This endpoint requires a bearer token to be sent in the header to authorize/authenticate a user's identity.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateBookingSchema'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/BookingRetrieveSingleResponseSchema'
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
 * /api/v1/organisations/hubs/{hubId}/workspaces/{workspaceId}/bookings/{bookingId}/cancel:
 *   patch:
 *     summary: Cancel a user booking.
 *     tags: [Workspace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hubId
 *         required: true
 *         description: Hub Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         description: Workspace Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *       - in: path
 *         name: bookingId
 *         required: true
 *         description: Booking Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *     description: >
 *       Endpoint for a user to cancel their booking request
 *
 *
 *       This endpoint requires a bearer token to be sent in the header to authorize/authenticate a user's identity.
 *     responses:
 *       200:
 *         $ref: '#/components/responses/BookingRetrieveSingleResponseSchema'
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
 * /api/v1/organisations/hubs/{hubId}/workspaces/checkIn/{code}:
 *   patch:
 *     summary: Check a user into a workspace at a specific hub.
 *     tags: [Workspace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hubId
 *         required: true
 *         description: Hub Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *       - in: path
 *         name: code
 *         required: true
 *         description: 8 Alphanumeric digit code
 *         schema:
 *           type: string
 *           example: w260d85s
 *     description: >
 *       Endpoint for an admin to check a user into a workspace.
 *       On the FE, this may be implemented as a route that simply
 *       sends a request to this endpoint. If a 200 is returned, show a brief popup that says a user is checked in.
 *
 *
 *       This endpoint requires a bearer token to be sent in the header to authorize/authenticate a user's identity.
 *       It is only available to an admin
 *     responses:
 *       200:
 *         $ref: '#/components/responses/BookingRetrieveSingleResponseSchema'
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
