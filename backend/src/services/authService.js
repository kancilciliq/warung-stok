const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/env');
const userModel = require('../models/userModel');
const ApiError = require('../utils/ApiError');

module.exports = {
  async login(username, password) {
    const user = await userModel.findByUsername(username);
    const valid = user && (await bcrypt.compare(password, user.password));
    if (!valid) throw ApiError.unauthorized('Username atau password salah');

    const payload = { id: user.id, name: user.name, username: user.username, role: user.role };
    const token = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    return { token, user: payload };
  },
};
