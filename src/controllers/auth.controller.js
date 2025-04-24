require('dotenv').config();

const {
  userLoginSchema,
  resetPasswordTokenSchema,
  resetEmailSchema,
} = require('../validations');
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
        user: await UserService.toJsonObj(user),
      };
      res
        .status(200)
        .json(successResJson(200, 'User signed in successfully', resObj));
    } catch (err) {
      next(err);
    }
  }

  static async signOutUser(req, res, next) {
    try {
      // TODO Logout logic. Invalidate auth token
      res.status(200).json(successResJson(200, 'User signed out successfully'));
    } catch (err) {
      next(err);
    }
  }

  static async requestUserPasswordReset(req, res, next) {
    try {
      const validateEmailSchema = resetEmailSchema.validate(req.body);

      if (validateEmailSchema.error) {
        throw new ApiError(422, validateEmailSchema.error.details[0].message);
      }

      const { email } = validateEmailSchema.value;

      const user = await UserService.filterBy({ email }, true);

      if (user) {
        UserService.sendPasswordResetEmail(user);
      }
      res
        .status(200)
        .json(
          successResJson(
            200,
            'Password reset link will be sent to registered email',
          ),
        );
    } catch (err) {
      next(err);
    }
  }

  static async resetUserPassword(req, res, next) {
    try {
      const validateResetPasswordSchema = resetPasswordTokenSchema.validate(
        req.body,
      );

      if (validateResetPasswordSchema.error) {
        throw new ApiError(
          422,
          validateResetPasswordSchema.error.details[0].message,
        );
      }

      const { password, token } = validateResetPasswordSchema.value;

      const user =
        req.user || (await AuthService.verifyResetPasswordToken(token));

      if (!user) throw new ApiError(404, 'User account not found');
      await UserService.setUserPassword(password, undefined, false, user);

      const resObj = UserService.toJsonObj(user);

      res
        .status(200)
        .json(successResJson(200, 'User password reset successfully', resObj));
    } catch (err) {
      next(err);
    }
  }
}
module.exports = AuthController;
