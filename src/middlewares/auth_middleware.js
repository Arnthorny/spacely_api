const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// const { ApiError } = require('../utils/resp_handling');

async function getUserFromAuthorization(req) {
  try {
    const [scheme, token] = req.headers.authorization
      ? req.headers.authorization.split(' ')
      : [undefined, undefined];

    if (scheme !== 'Bearer' || !token) {
      return null;
    }

    const decodedObject = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decodedObject;

    const user = await User.findById(id);
    if (!user) {
      return null;
    }
    return user;
  } catch (err) {
    return null;
  }
}

async function tokenAuthentication(req, res, next) {
  const user = await getUserFromAuthorization(req);

  if (!user) {
    return res.status(401).json({ status: 401, error: 'Unauthorized' });
  }

  req.user = user;
  return next();
}

module.exports = { tokenAuthentication };
