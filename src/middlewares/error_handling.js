/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (!err.isOperational) {
    statusCode = 500;
    message = message || 'Internal Server Error';

    /* eslint-disable no-console */
    console.error(err);
  }

  const response = {
    status: statusCode,
    error: message,
  };

  res.status(statusCode).json(response);
};

module.exports = {
  errorHandler,
};
