require('dotenv').config();
// eslint-disable-next-line import/no-extraneous-dependencies
const passwordGen = require('generate-password');

const { Organisation } = require('../models');
const { UserService, EmailService } = require('.');
const { ApiError } = require('../utils/responses');

class OrganisationService {
  static async createOrg(bodyObj) {
    let resObj;
    try {
      const { name: orgName, email } = bodyObj;

      const password = passwordGen.generate({
        length: 10,
        strict: true,
        numbers: true,
      });

      const orgOwnerUserObj = {
        fullName: `${orgName} Owner`,
        email,
        role: 'admin',
        password,
        isActive: true,
      };

      const user = await UserService.createUser(orgOwnerUserObj);
      const org = await Organisation.create({
        name: orgName,
        email,
        owner: user.id,
      });

      user.org = org;
      await user.save();

      EmailService.sendAdminSetupEmail(user, password);

      resObj = org;
    } catch (error) {
      // Error thrown by Mongo Unique constraint
      if (error.code === 11000) {
        throw new ApiError(
          `Organisation with email ${bodyObj.email} already exists`,
        );
      }
      throw error;
    }
    return resObj;
  }

  static toJsonObj(org) {
    const jsonObj = {
      id: org.id,
      email: org.email,
      ownerId: org.owner,
      name: org.name,
    };
    return jsonObj;
  }

  static async validOrgId(orgId) {
    return (await Organisation.findById(orgId)) !== null;
  }
}

module.exports = OrganisationService;
