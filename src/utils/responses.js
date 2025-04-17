/**
 *
 * @param {Number} status
 * @param {String | Undefined} message
 * @param {Object} data
 * @returns Object
 *
 * {
 * "status" : Integer: 201,
 * "“message": String: “User created successfully”
 * "data" : Object: {...} or [{...}, {...}]
 * }
 *
 */

function successRes(status = 200, message = undefined, data = {}) {
  return { status, message, data };
}

class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

module.exports = { successRes, ApiError };
