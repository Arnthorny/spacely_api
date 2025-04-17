const router = require('express').Router();

const OrganisationController = require('../../controllers/organisation.controller');

router.post(
  '/organisations',
  OrganisationController.createOrganisation.bind(OrganisationController),
);

module.exports = router;
