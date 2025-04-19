const { setInitialPasswordSchema } = require('../validations/auth.validation');
const { userIdSchema } = require('../validations/user.validation');
const { UserService, InvitationService } = require('../services');

const { successRes: successResJson, ApiError } = require('../utils/responses');

class UserController {
  static async setUpInitialPassword(req, res, next) {
    try {
      const validationPasswordSetup = setInitialPasswordSchema.validate(
        req.body,
      );
      const validationOrgUserId = userIdSchema.validate(req.params);
      const allValErr = [
        validationOrgUserId.error,
        validationPasswordSetup.error,
      ];
      allValErr.forEach((err) => {
        if (err) {
          throw new ApiError(422, err.details[0].message);
        }
      });

      const { password, token } = validationPasswordSetup.value;
      const { orgId, userId } = validationOrgUserId.value;
      const invite = await InvitationService.validateInviteToken(
        token,
        orgId,
        userId,
      );
      const user = await UserService.setUserPassword(
        password,
        invite.user,
        true,
      );

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
module.exports = UserController;
