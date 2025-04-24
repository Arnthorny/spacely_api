/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

const app = require('./app');

const PORT = process.env.PORT || 3000;
let server;

function start() {
  // Connect to MongoDB
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

  // Start server
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Keep server active
  setInterval(() => fetch(`${process.env.SERVER_URL}/api/v1/status`), 600000);
}

start();

const exitHandler = async () => {
  if (server) server.close(() => console.log('Server closed'));
};

const unexpectedErrorHandler = (error) => {
  console.error(error);
  exitHandler();
  process.exit(1);
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', exitHandler);
