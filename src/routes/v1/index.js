const v1Router = require('express').Router();
const orgRoutes = require('./organisation.route');
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const testRoutes = require('./test.route');

v1Router.use('/v1', orgRoutes);
v1Router.use('/v1', authRoutes);
v1Router.use('/v1', userRoutes);
v1Router.use('/v1', testRoutes);

module.exports = v1Router;
