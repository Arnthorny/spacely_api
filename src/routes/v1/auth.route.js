const router = require('express').Router();

const { AuthController } = require('../../controllers');

router.post('/auth/signIn', AuthController.signInUser.bind(AuthController));

module.exports = router;
