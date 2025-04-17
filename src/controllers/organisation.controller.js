require('dotenv').config();

const {
  organisationSignupSchema,
} = require('../validations/organisation.validation');
const { Organisation } = require('../models');

const { successRes: successResJson, ApiError } = require('../utils/responses');

class OrganisationController {
  static async createOrganisation(req, res, next) {
    try {
      const validation = organisationSignupSchema.validate(req.body);

      if (validation.error) {
        throw new ApiError(422, validation.error.details[0].message);
      }

      const org = await Organisation.create(validation.value);

      const resObj = org.to_json();

      res
        .status(201)
        .json(successResJson(201, 'Organisation created successfully', resObj));
    } catch (err) {
      next(err);
    }
  }
}
module.exports = OrganisationController;
