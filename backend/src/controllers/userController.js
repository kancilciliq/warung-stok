const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const crudController = require('./crudController');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const base = crudController(userModel, 'User');

module.exports = {
  list: base.list,
  get: base.get,
  create: asyncHandler(async (req, res) => {
    const { name, username, password, role } = req.body;
    const user = await userModel.create({ name, username, role, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ success: true, message: 'User berhasil ditambahkan', data: user });
  }),
  update: asyncHandler(async (req, res) => {
    if (!(await userModel.findById(req.params.id))) throw ApiError.notFound('User tidak ditemukan');
    const data = { ...req.body };
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    res.json({ success: true, message: 'User berhasil diperbarui', data: await userModel.update(req.params.id, data) });
  }),
  remove: asyncHandler(async (req, res, next) => {
    if (Number(req.params.id) === req.user.id) throw ApiError.badRequest('Tidak dapat menghapus akun yang sedang digunakan');
    return base.remove(req, res, next);
  }),
};
