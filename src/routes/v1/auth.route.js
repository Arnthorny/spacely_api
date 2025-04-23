const router = require('express').Router();

const { AuthController } = require('../../controllers');
const AuthWare = require('../../middlewares/auth_middleware');

router.post('/auth/signin', AuthController.signInUser.bind(AuthController));
router.put(
  '/auth/password',
  AuthWare.tokenAuthenticationOptional,
  AuthController.resetUserPassword.bind(AuthController),
);

router.put(
  '/auth/password-reset-request',
  AuthController.requestUserPasswordReset.bind(AuthController),
);
router.post(
  '/auth/signout',
  AuthWare.tokenAuthentication,
  AuthController.signOutUser.bind(AuthController),
);

module.exports = router;

/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     summary: User signin
 *     description: >
 *       Endpoint to login a user to the service.
 *
 *       On the FE, a `GET` request to this endpoint is used on the admin dashboard to display all invite requests,
 *       after which the admin can decide which request to either appprove or reject.
 *
 *       This endpoint requires a bearer token to be sent in the header to authorize/authenticate a user's identity.
 *       It also requires that the user associated with that bearer token be an admin. Otherwise, a 403 is thrown
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSigninRequestSchema'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserSigninSuccessfulResponse'
 *       400:
 *         $ref: '#/components/responses/Generic400ResponseSchema'
 *       401:
 *         $ref: '#/components/responses/Generic401ResponseSchema'
 *       422:
 *         $ref: '#/components/responses/Generic422ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */

/**
 * @swagger
 * /api/v1/auth/signout:
 *   post:
 *     summary: User signout
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Endpoint to logout a user.
 *
 *       Only a signed in user can sign out. Thus this endpoint requires an auth token to verify the user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Generic200Response'
 *       401:
 *         $ref: '#/components/responses/Generic401ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */

/**
 * @swagger
 * /api/v1/auth/password:
 *   put:
 *     summary: Password reset endpoint
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Endpoint to reset a user's password.
 *
 *       The token field must be passed in request body if the request is not authenticated.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSetUpPasswordRequestSchema'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserSetUpPasswordSuccessfulResponse'
 *       400:
 *         $ref: '#/components/responses/Generic400ResponseSchema'
 *       401:
 *         $ref: '#/components/responses/Generic401ResponseSchema'
 *       422:
 *         $ref: '#/components/responses/Generic422ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */

/**
 * @swagger
 * /api/v1/auth/password-reset-request:
 *   put:
 *     summary: Request password reset
 *     description: >
 *       Endpoint to request password reset link.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of user
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Generic200Response'
 *       422:
 *         $ref: '#/components/responses/Generic422ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */
