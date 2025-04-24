/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const { basename } = require('path');

const {
  organisationSignupSchema,
  orgIdSchema,
  approveOrRejectInviteSchema,
  orgInviteTokenSchema,
  orgSearchParamSchema,
  inviteIdSchema,
  hubIdSchema,
  userSignupSchema,
  retrieveOrgInvitesParam,
  getWorkspacesSchema,
  createWorkspaceBookingParamsSchema,
  createWorkspaceBookingBodySchema,
  editWorkspaceBookingParamSchema,
  checkInBookingParamSchema,
} = require('../validations');

const {
  UserService,
  OrganisationService,
  InvitationService,
  HubService,
  WorkspaceService,
  BookingService,
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

      const newUserObj = { org: orgId, ...validateUserReqBody.value };
      const user = await UserService.createUser(newUserObj);
      const inviteRequest = await InvitationService.requestInvite(user);

      const resObj = await UserService.toJsonObj(user);
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
        req.user.org.toString(),
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

  static async getAllInviteRequests(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        throw ApiError(403, 'Forbidden');
      }

      const validationStatusParam = retrieveOrgInvitesParam.validate(
        req.params,
      );

      if (validationStatusParam.error) {
        throw new ApiError(422, validationStatusParam.error.details[0].message);
      }

      const { status } = validationStatusParam.value;

      const orgId = req.user.org._id;

      const allInvitesInstance = await InvitationService.filterBy({
        org: orgId,
        status,
      });

      const resObj = allInvitesInstance.map((invite) =>
        InvitationService.toJsonObj(invite),
      );

      res
        .status(200)
        .json(successResJson(200, 'Invites retrieved successfully', resObj));
    } catch (err) {
      next(err);
    }
  }

  static async getSpecificInviteRequests(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        throw ApiError(403, 'Forbidden');
      }

      const validationInviteId = inviteIdSchema.validate(req.params);

      if (validationInviteId.error) {
        throw new ApiError(422, validationInviteId.error.details[0].message);
      }

      const { inviteId } = validationInviteId.value;

      const orgId = req.user.org._id;

      const inviteInstance = (
        await InvitationService.filterBy({
          org: orgId,
          _id: inviteId,
        })
      )[0];

      if (!inviteInstance) throw new ApiError(404, 'Invite not found');

      const resObj = InvitationService.toJsonObj(inviteInstance);

      res
        .status(200)
        .json(successResJson(200, 'Invite retrieved successfully', resObj));
    } catch (err) {
      next(err);
    }
  }

  static async retrieveOrganisations(req, res, next) {
    try {
      const validation = orgSearchParamSchema.validate(req.query);

      if (validation.error) {
        throw new ApiError(422, validation.error.details[0].message);
      }

      const { search } = validation.value;

      const allOrgsInstances = await OrganisationService.searchOrgName(search);

      const resObj = allOrgsInstances.map((org) =>
        OrganisationService.toJsonObj(org),
      );

      res
        .status(200)
        .json(
          successResJson(200, 'Organisations retrieved successfully', resObj),
        );
    } catch (err) {
      next(err);
    }
  }

  static async getSpecificOrganisation(req, res, next) {
    try {
      const validationOrgId = orgIdSchema.validate(req.params);

      if (validationOrgId.error) {
        throw new ApiError(422, validationOrgId.error.details[0].message);
      }

      const { orgId } = validationOrgId.value;

      const orgInstance = (
        await OrganisationService.filterBy({
          _id: orgId,
        })
      )[0];

      if (!orgInstance) throw new ApiError(404, 'Organisation not found');

      const resObj = OrganisationService.toJsonObj(orgInstance);

      res
        .status(200)
        .json(
          successResJson(200, 'Organisation retrieved successfully', resObj),
        );
    } catch (err) {
      next(err);
    }
  }

  static async getAllOrgHubs(req, res, next) {
    try {
      const orgId = req.user.org._id;

      const allHubsInstance = await HubService.filterBy({
        org: orgId,
      });

      const resObj = await Promise.all(
        allHubsInstance.map(HubService.toJsonObj),
      );

      res
        .status(200)
        .json(successResJson(200, 'Hubs retrieved successfully', resObj));
    } catch (err) {
      next(err);
    }
  }

  static async getSpecificOrgHub(req, res, next) {
    try {
      const orgId = req.user.org._id;

      const validationHubId = hubIdSchema.validate(req.params);

      if (validationHubId.error) {
        throw new ApiError(422, validationHubId.error.details[0].message);
      }

      const { hubId } = validationHubId.value;

      const hub = await HubService.filterBy(
        {
          org: orgId,
          _id: hubId,
        },
        true,
      );

      if (!hub) throw new ApiError(404, 'Hub not found');

      const resObj = await HubService.toJsonObj(hub);

      res
        .status(200)
        .json(successResJson(200, 'Hub retrieved successfully', resObj));
    } catch (err) {
      next(err);
    }
  }

  static async getAllHubWorkspaces(req, res, next) {
    try {
      const validationPParams = hubIdSchema.validate(req.params);
      const validationQParams = getWorkspacesSchema.validate(req.query);

      const allValErr = [validationPParams, validationQParams];
      allValErr.forEach((err) => {
        if (err) {
          throw new ApiError(422, err.details[0].message);
        }
      });

      const { hubId } = validationPParams.value;
      const { day } = validationQParams.value;

      const hub = HubService.filterBy({ _id: hubId }, true);

      if (!hub) {
        throw ApiError(404, 'Hub not found');
      }

      if (req.user.org._id !== hub.org._id) {
        throw ApiError(403, 'Forbidden');
      }

      const dayISO = day.toISOString().split('T')[0];
      const allWorkspacesForDay = WorkspaceService.retrieveWorkspaceEtBooking(
        hub,
        dayISO,
      );

      const resObj = await Promise.all(
        allWorkspacesForDay.map((workspace) =>
          WorkspaceService.toJsonObj(workspace, true, String(req.user._id)),
        ),
      );

      res
        .status(200)
        .json(
          successResJson(
            200,
            `Workspaces detail for ${dayISO} retrieved successfully`,
            resObj,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  static async createWorkspaceBooking(req, res, next) {
    try {
      const validationPParams = createWorkspaceBookingParamsSchema.validate(
        req.params,
      );
      const validationBParams = createWorkspaceBookingBodySchema.validate(
        req.body,
      );

      const allValErr = [validationPParams, validationBParams];
      allValErr.forEach((err) => {
        if (err) {
          throw new ApiError(422, err.details[0].message);
        }
      });
      const { hubId, workspaceId } = validationPParams.value;
      const bookingParams = { ...validationBParams.value };
      const userId = String(req.user._id);

      const booking = await BookingService.createBooking(
        bookingParams,
        hubId,
        workspaceId,
        userId,
      );

      const resObj = BookingService.toJsonObj(booking);

      res
        .status(201)
        .json(
          successResJson(
            201,
            'Booking created successfully. Check mail for confirmation.',
            resObj,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  static async updateWorkspaceBooking(req, res, next) {
    try {
      const validationPParams = editWorkspaceBookingParamSchema.validate(
        req.params,
      );
      const validationBParams = createWorkspaceBookingBodySchema.validate(
        req.body,
      );

      const allValErr = [validationPParams, validationBParams];
      allValErr.forEach((err) => {
        if (err) {
          throw new ApiError(422, err.details[0].message);
        }
      });
      const { bookingId } = validationPParams.value;
      const userId = String(req.user._id);
      let booking = await BookingService.filterBy({
        _id: bookingId,
      });
      if (!booking) throw new ApiError(404, 'Booking not found');

      const bookingParams = { ...validationBParams.value };

      booking = await BookingService.editBooking(
        booking,
        userId,
        bookingParams,
      );

      const resObj = BookingService.toJsonObj(booking);

      res
        .status(200)
        .json(
          successResJson(
            200,
            'Booking edited successfully. Check mail for confirmation.',
            resObj,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  static async cancelWorkspaceBooking(req, res, next) {
    try {
      const validationPParams = editWorkspaceBookingParamSchema.validate(
        req.params,
      );

      [validationPParams].forEach((err) => {
        if (err) {
          throw new ApiError(422, err.details[0].message);
        }
      });
      const { bookingId } = validationPParams.value;
      const userId = String(req.user._id);
      let booking = await BookingService.filterBy({
        _id: bookingId,
      });
      if (!booking) throw new ApiError(404, 'Booking not found');

      booking = await BookingService.cancelBooking(booking, userId);

      const resObj = BookingService.toJsonObj(booking);

      res
        .status(200)
        .json(
          successResJson(
            200,
            'Booking cancelled successfully. Check mail for confirmation.',
            resObj,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  static async checkInWorkspaceBooking(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        throw ApiError(403, 'Forbidden');
      }

      const validationPParams = checkInBookingParamSchema.validate(req.params);

      [validationPParams].forEach((err) => {
        if (err) {
          throw new ApiError(422, err.details[0].message);
        }
      });
      const { hubId, code } = validationPParams.value;
      let booking = await BookingService.filterBy(
        {
          code,
        },
        true,
      );

      if (!booking) throw new ApiError(404, 'Booking not found');

      await booking.populate('workspace').populate('user');

      const { workspace } = booking;
      if (String(workspace.hub._id) !== hubId) {
        throw new ApiError(404, 'Booking not found for given hub');
      }

      booking = await BookingService.checkInBooking(booking, req.user);

      const resObj = BookingService.toJsonObj(booking);

      res
        .status(200)
        .json(successResJson(200, 'Booking checkedIn successfully.', resObj));
    } catch (error) {
      next(error);
    }
  }
}
module.exports = OrganisationController;
