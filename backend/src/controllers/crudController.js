const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/** Pabrik controller CRUD untuk model yang punya findAll/findById/create/update/remove */
module.exports = (model, label) => ({
  list: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await model.findAll(req.query) });
  }),
  get: asyncHandler(async (req, res) => {
    const row = await model.findById(req.params.id);
    if (!row) throw ApiError.notFound(`${label} tidak ditemukan`);
    res.json({ success: true, data: row });
  }),
  create: asyncHandler(async (req, res) => {
    res.status(201).json({ success: true, message: `${label} berhasil ditambahkan`, data: await model.create(req.body) });
  }),
  update: asyncHandler(async (req, res) => {
    if (!(await model.findById(req.params.id))) throw ApiError.notFound(`${label} tidak ditemukan`);
    res.json({ success: true, message: `${label} berhasil diperbarui`, data: await model.update(req.params.id, req.body) });
  }),
  remove: asyncHandler(async (req, res) => {
    if (!(await model.remove(req.params.id))) throw ApiError.notFound(`${label} tidak ditemukan`);
    res.json({ success: true, message: `${label} berhasil dihapus` });
  }),
});
