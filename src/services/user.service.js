/* eslint-disable no-underscore-dangle */

require('dotenv').config();
const bcrypt = require('bcryptjs');

const { User } = require('../models');

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
        throw new ApiError(`User with email ${bodyObj.email} already exists`);
      }
      throw error;
    }
    return resObj;
  }

  static async setUserPassword(password, userId, initialSetup = false) {
    const user = await User.findById(userId);

    if (user === null) throw new ApiError(404, 'User not Found');

    user.password = bcrypt.hashSync(password, 15);

    if (initialSetup === true) user.isActive = true;

    await user.save();

    return user;
  }
}
module.exports = UserService;
