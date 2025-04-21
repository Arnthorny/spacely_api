/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const jwt = require('jsonwebtoken');

const { Invitation } = require('../models');
const { tokenTypes } = require('../config/tokens');

const { EmailService, AuthService } = require('.');
const { ApiError } = require('../utils/responses');

class InvitationService {
  static toJsonObj(invite) {
    const jsonObj = {
      id: invite.id,
      status: invite.status,
      expiry: invite.expiresAt,
      orgId: invite.org._id,
      userId: invite.user._id,
      isExpired: invite.isExpired(),
      createdAt: invite.createdAt,
    };
    return jsonObj;
  }

  static async requestInvite(user) {
    const invite = await Invitation.create({
      user: user.id,
      org: user.org,
    });

    return invite;
  }

  static async approveOrRejectInviteRequest(inviteId, orgId, action) {
    const invite = await Invitation.findById(inviteId).populate('user');

    if (invite === null) throw new ApiError(404, 'Invite request not found');

    if (invite.org.toString() !== orgId) {
      throw new ApiError(403, 'Invite not for this organisation');
    }

    invite.status = action;
    if (action === 'approved') {
      const t = Date.now() + process.env.INV_EXP_DAYS * 24 * 60 * 60 * 1000;
      invite.expiresAt = t;
    }

    await invite.save();
    if (action === 'approved') this.sendInvite(invite);
    return invite;
  }

  static async sendInvite(invite) {
    const inviteToken = this.createInviteToken(invite);

    const inviteUrl = `${process.env.APP_URL}/account_confirm/${invite.org}/${inviteToken}`;

    EmailService.sendInviteEmail(invite.user, inviteUrl);
  }

  static createInviteToken(invite) {
    const inviteToken = AuthService.createInviteToken(invite.id);

    return inviteToken;
  }

  static async validateInviteToken(
    token,
    orgId = undefined,
    userId = undefined,
  ) {
    let invite;
    try {
      const decodedInvToken = jwt.verify(token, process.env.JWT_SECRET);
      const { inviteId, type } = decodedInvToken;

      if (type !== tokenTypes.INVITE_TOKEN) {
        throw new ApiError(400, 'Invalid token type');
      }
      invite = await Invitation.findById(inviteId);

      if (invite === null) throw new ApiError(404, 'Invite not found');
      if (orgId && invite.org._id.toString() !== orgId) {
        throw new ApiError(403, 'Forbidden');
      }

      if (userId && invite.user._id.toString() !== userId) {
        throw new ApiError(403, 'Forbidden');
      }

      if (invite.status === 'used') {
        throw new ApiError(400, 'Invite token has been used');
      }

      if (invite.isExpired()) {
        throw new ApiError(400, 'Invite has expired');
      }
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new ApiError(400, error.message);
      }
      throw error;
    }
    return invite;
  }

  static async updateInvite(status, invite) {
    if (status === 'used') {
      // eslint-disable-next-line no-param-reassign
      invite.expiresAt = Date.now();
    }
    // eslint-disable-next-line no-param-reassign
    invite.status = status;
    await invite.save();
  }

  static async filterBy(param) {
    const res = await Invitation.find(param);

    return res;
  }
}
module.exports = InvitationService;
