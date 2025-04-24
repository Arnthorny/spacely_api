require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { ApiError } = require('../utils/responses');
const { tokenTypes } = require('../config/tokens');

class AuthService {
  static verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  static async authenticateUser(bodyObj) {
    const user = await User.findOne({ email: bodyObj.email });

    if (user === null) throw new ApiError(400, 'Invalid user credentials');

    if (!user.isActive) {
      throw new ApiError(401, 'Account has not been activated');
    }

    if (!this.verifyPassword(bodyObj.password, user.password)) {
      throw new ApiError(400, 'Invalid user credentials');
    }
    return user;
  }

  static createAccessToken(id) {
    const payload = {
      userId: id,
      type: tokenTypes.ACCESS,
    };
    const newtoken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME,
    });
    return newtoken;
  }

  static createRefreshToken(id) {
    const payload = {
      userId: id,
      type: tokenTypes.REFRESH,
    };
    const newtoken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME,
    });
    return newtoken;
  }

  static createInviteToken(id) {
    const payload = {
      inviteId: id,
      type: tokenTypes.INVITE_TOKEN,
    };
    const newtoken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_INV_EXP_DAYS,
    });
    return newtoken;
  }

  static createResetPasswordToken(id) {
    const payload = {
      userId: id,
      type: tokenTypes.RESET_PASSWORD,
    };
    const newtoken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_RESET_PW_EXP_MIN,
    });
    return newtoken;
  }

  static async verifyResetPasswordToken(token) {
    let user;
    try {
      if (!token) {
        throw new ApiError(400, 'Token must be provided');
      }

      const decodedResToken = jwt.verify(token, process.env.JWT_SECRET);
      const { userId, type } = decodedResToken;

      if (type !== tokenTypes.RESET_PASSWORD) {
        throw new ApiError(400, 'Invalid token type');
      }
      user = await User.findById(userId);

      if (user === null) throw new ApiError(404, 'User not found');

      if (!user.isActive) {
        throw new ApiError(401, 'Account has not been activated');
      }
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new ApiError(400, error.message);
      }
      throw error;
    }
    return user;
  }
}

module.exports = AuthService;
