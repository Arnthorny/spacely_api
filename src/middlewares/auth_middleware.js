const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { tokenTypes } = require('../config/tokens');
const { ApiError } = require('../utils/responses');

// const { ApiError } = require('../utils/resp_handling');

async function getUserFromAuthorization(req) {
  try {
    console.log('Here');
    const [scheme, token] = req.headers.authorization
      ? req.headers.authorization.split(' ')
      : [undefined, undefined];

    if (scheme !== 'Bearer' || !token) {
      throw new ApiError(401, 'Invalid Header Scheme');
    }

    const decodedObject = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedObject.type !== tokenTypes.ACCESS) {
      throw new ApiError(401, 'Invalid token type');
    }

    const { userId } = decodedObject;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(401, 'Invalid token id');
    }
    return user;
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, error.message);
    }
    throw error;
  }
}

async function tokenAuthentication(req, res, next) {
  const user = await getUserFromAuthorization(req);

  if (!user) {
    throw new ApiError(401, 'Unauthorized');
  }

  req.user = user;
  return next();
}

module.exports = { tokenAuthentication };
