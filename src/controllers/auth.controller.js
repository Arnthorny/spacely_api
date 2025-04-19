require('dotenv').config();

const { userLoginSchema } = require('../validations/auth.validation');
const { AuthService, UserService } = require('../services');

const { successRes: successResJson, ApiError } = require('../utils/responses');

class AuthController {
  static async signInUser(req, res, next) {
    try {
      const validation = userLoginSchema.validate(req.body);

      if (validation.error) {
        throw new ApiError(422, validation.error.details[0].message);
      }
      const user = await AuthService.authenticateUser(validation.value);
      const accessToken = AuthService.createAccessToken(user.id);
      const refreshToken = AuthService.createRefreshToken(user.id);

      const resObj = {
        accessToken,
        refreshToken,
        user: UserService.toJsonObj(user),
      };
      res
        .status(200)
        .json(successResJson(200, 'User signed in successfully', resObj));
    } catch (err) {
      next(err);
    }
  }
}
module.exports = AuthController;
