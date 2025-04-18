require('dotenv').config();
const bcrypt = require('bcryptjs');

const { User } = require('../models');

const { ApiError } = require('../utils/responses');

class UserService {
  static toJsonObj(user) {
    const jsonUsrObj = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      orgId: user.org,
      isActive: user.isActive,
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
    }
    return resObj;
  }

  static async setUserPassword(password, userId) {
    const user = User.findById(userId);

    if (user === null) throw new ApiError(404, 'User not Found');

    user.password = bcrypt.hashSync(password, 15);
    await user.save();

    return user;
  }
}
module.exports = UserService;
