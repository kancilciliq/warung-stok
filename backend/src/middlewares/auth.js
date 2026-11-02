const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/env');
const ApiError = require('../utils/ApiError');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(ApiError.unauthorized());

  try {
    req.user = jwt.verify(token, jwtConfig.secret); // { id, username, role, name }
    next();
  } catch {
    next(ApiError.unauthorized('Token tidak valid atau kedaluwarsa'));
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
  next();
};

module.exports = { authenticate, authorize };
