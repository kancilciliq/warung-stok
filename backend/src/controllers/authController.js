const authService = require('../services/authService');
const userModel = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

module.exports = {
  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body.username, req.body.password);
    res.json({ success: true, message: 'Login berhasil', data: result });
  }),
  me: asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user.id);
    if (!user) throw ApiError.unauthorized('Akun tidak ditemukan');
    res.json({ success: true, data: user });
  }),
};
