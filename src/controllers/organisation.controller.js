require('dotenv').config();
const { basename } = require('path');

const {
  organisationSignupSchema,
  orgIdSchema,
  approveOrRejectInviteSchema,
  orgInviteTokenSchema,
} = require('../validations/organisation.validation');

const { userSignupSchema } = require('../validations/user.validation');
const {
  UserService,
  OrganisationService,
  InvitationService,
} = require('../services');

const { successRes: successResJson, ApiError } = require('../utils/responses');

class OrganisationController {
  static async createOrganisation(req, res, next) {
    try {
      const validation = organisationSignupSchema.validate(req.body);

      if (validation.error) {
        throw new ApiError(422, validation.error.details[0].message);
      }
      const org = await OrganisationService.createOrg(validation.value);
      const resObj = OrganisationService.toJsonObj(org);

      // TODO: Send email containing admin login details
      res
        .status(201)
        .json(
          successResJson(
            201,
            'Organisation created successfully. Check mail for credentials',
            resObj,
          ),
        );
    } catch (err) {
      next(err);
    }
  }

  static async userRequestOrgInvite(req, res, next) {
    try {
      const validateUserReqBody = userSignupSchema.validate(req.body);
      const validationOrgId = orgIdSchema.validate(req.params);

      const allValErr = [validationOrgId.error, validateUserReqBody.error];
      allValErr.forEach((err) => {
        if (err) {
          throw new ApiError(422, err.details[0].message);
        }
      });

      const { orgId } = validationOrgId.value;

      if (!OrganisationService.validOrgId(orgId)) {
        throw new ApiError(404, 'Organisation not found');
      }

      validateUserReqBody.orgId = orgId;

      const user = await UserService.createUser(validateUserReqBody.value);
      const inviteRequest = await InvitationService.requestInvite(user);

      const resObj = UserService.toJsonObj(user);
      resObj.inviteId = inviteRequest.id;

      // TODO: Place invite link in email say /organisations/:orgId/invitations/tokens/:tokenId

      res
        .status(201)
        .json(
          successResJson(201, 'Invite request created successfully', resObj),
        );
    } catch (err) {
      next(err);
    }
  }

  static async approveOrRejectInvite(req, res, next) {
    try {
      const validation = approveOrRejectInviteSchema.validate(req.params);

      if (validation.error) {
        throw new ApiError(422, validation.error.details[0].message);
      }
      const { inviteId } = validation.value;

      if (req.user.role !== 'admin') {
        throw ApiError(403, 'Forbidden');
      }

      const action = basename(req.path) === 'approve' ? 'approved' : 'rejected';

      const invite = await InvitationService.approveOrRejectInviteRequest(
        inviteId,
        req.user.org.to_string(),
        action,
      );

      const resObj = InvitationService.toJsonObj(invite);

      res
        .status(200)
        .json(successResJson(200, `Invite ${action} successfully`, resObj));
    } catch (err) {
      next(err);
    }
  }

  static async checkInviteToken(req, res, next) {
    try {
      const validation = orgInviteTokenSchema.validate(req.params);

      if (validation.error) {
        throw new ApiError(422, validation.error.details[0].message);
      }

      const { orgId, token } = validation.value;

      const invite = await InvitationService.validateInviteToken(token, orgId);

      const resObj = InvitationService.toJsonObj(invite);
      resObj.token = token;
      res
        .status(200)
        .json(successResJson(200, 'Invite verified successfully', resObj));
    } catch (err) {
      next(err);
    }
  }
}
module.exports = OrganisationController;
