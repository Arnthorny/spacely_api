const router = require('express').Router();

const { UserController } = require('../../controllers');

router.post(
  '/users/:userId/setup-password',
  UserController.setUpInitialPassword.bind(UserController),
);
module.exports = router;

/**
 * @swagger
 * /api/v1/users/{userId}/setup-password:
 *   post:
 *     summary: User initial password setup
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: orgId
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
