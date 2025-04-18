require('dotenv').config();

const {
  userLoginSchema,
  setInitialPasswordSchema,
} = require('../validations/auth.validation');
const { orgIdSchema } = require('../validations/organisation.validation');
const { AuthService, UserService, InvitationService } = require('../services');

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
        .status(201)
        .json(successResJson(201, 'User signed in successfully', resObj));
    } catch (err) {
      next(err);
    }
  }

  static async setUpInitialPassword(req, res, next) {
    try {
      const validationPasswordSetup = setInitialPasswordSchema.validate(
        req.body,
      );
      const validationOrgId = orgIdSchema.validate(req.params);

      const allValErr = [validationOrgId.error, validationPasswordSetup.error];
      allValErr.forEach((err) => {
        if (err) {
          throw new ApiError(422, err.details[0].message);
        }
      });

      const { password, token } = validationPasswordSetup.value;

      const { orgId } = validationOrgId.value;

      const invite = await InvitationService.validateInviteToken(token, orgId);
      const user = await UserService.setUserPassword(password, invite.user);

      InvitationService.updateInvite('used', invite);

      const resObj = UserService.toJsonObj(user);
      res
        .status(200)
        .json(successResJson(200, 'User password set successfully', resObj));
    } catch (err) {
      next(err);
    }
  }
}
module.exports = AuthController;
