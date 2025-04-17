const v1Router = require('express').Router();
const orgRoutes = require('./organisation.route');

v1Router.use('/v1', orgRoutes);

module.exports = v1Router;
