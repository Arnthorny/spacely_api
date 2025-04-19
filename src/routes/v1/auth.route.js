const router = require('express').Router();

const { AuthController } = require('../../controllers');

router.post('/auth/signIn', AuthController.signInUser.bind(AuthController));

module.exports = router;

/**
 * @swagger
 * /api/v1/auth/signIn:
 *   post:
 *     summary: User signin
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
