/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const bcrypt = require('bcryptjs');

const { User } = require('../models');
const { AuthService, EmailService } = require('.');

const { ApiError } = require('../utils/responses');

class UserService {
  static toJsonObj(user) {
    const jsonUsrObj = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      orgId: user.org._id,
      isActive: user.isActive,
      role: user.role,
    };
    return jsonUsrObj;
  }

  static async createUser(bodyObj) {
    let resObj;
    try {
      const { password, ...bodyObjDup } = bodyObj;

      if (password !== undefined) {
        bodyObjDup.password = bcrypt.hashSync(password, 15);
      }

      const user = await User.create(bodyObjDup);
      resObj = user;
    } catch (error) {
      // Error thrown by Mongo Unique constraint
      if (error.code === 11000) {
        throw new ApiError(
          400,
          `User with email ${bodyObj.email} already exists`,
        );
      }
      throw error;
    }
    return resObj;
  }

  static async setUserPassword(
    password,
    userId = undefined,
    initialSetup = false,
    userObj = undefined,
  ) {
    let user;
    if (userObj === undefined) {
      if (userId === undefined) throw new ApiError(400, 'Invalid userId');
      user = await User.findById(userId);
    } else user = userObj;

    if (user === null) throw new ApiError(404, 'User not Found');

    user.password = bcrypt.hashSync(password, 15);

    if (initialSetup === true) user.isActive = true;

    await user.save();

    return user;
  }

  static async sendPasswordResetEmail(user) {
    const resetPwToken = AuthService.createResetPasswordToken(user.id);

    const resetUrl = `${process.env.APP_URL}/reset_password/${resetPwToken}`;

    EmailService.sendResetPasswordEmail(user, resetUrl);
  }

  static async filterBy(param, singleRes = false) {
    const res = await User.find(param);

    if (singleRes) return res[0];
    return res;
  }
}
module.exports = UserService;
