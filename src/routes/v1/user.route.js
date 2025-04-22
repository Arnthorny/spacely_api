const router = require('express').Router();

const { UserController } = require('../../controllers');

router.patch(
  '/users/:userId/setup-password',
  UserController.setUpInitialPassword.bind(UserController),
);
module.exports = router;

/**
 * @swagger
 * /api/v1/users/{userId}/setup-password:
 *   patch:
 *     summary: User initial password setup
 *     description: >
 *       Endpoint to setup initial user password, using validated invite token.
 * 
 * 
 *       After the user clicks the invite link sent to their mail, they are directed to page which shows
 *       a form on which they can set their passwords.
 * 
 * 
 *       That form makes a request to this endpoint with the token and the user set password in order that the user account might be activated.
 *       Ideally, a request should first be made to validate the token.
 * 
 * 
 *       The success of that reqeust is what grants a user access to the page where they can set their password. It is also what allows the
 *       frontend to get the userId that is required to complete this request.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User Id
 *         schema:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSetUpPasswordRequestSchema'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserSetUpPasswordSuccessfulResponse'
 *       404:
 *         $ref: '#/components/responses/Generic401ResponseSchema'
 *       422:
 *         $ref: '#/components/responses/Generic422ResponseSchema'
 *       500:
 *         $ref: '#/components/responses/Generic500ResponseSchema'
 */
