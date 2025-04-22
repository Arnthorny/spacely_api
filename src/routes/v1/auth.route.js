const router = require('express').Router();

const { AuthController } = require('../../controllers');

router.post('/auth/signin', AuthController.signInUser.bind(AuthController));

module.exports = router;

/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     summary: User signin
 *     description: >
 *       Endpoint to login a user to the.
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
