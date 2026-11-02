const transactionModel = require('../models/transactionModel');
const stockService = require('../services/stockService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

module.exports = {
  list: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await transactionModel.findAll(req.query) });
  }),
  get: asyncHandler(async (req, res) => {
    const trx = await transactionModel.findById(req.params.id);
    if (!trx) throw ApiError.notFound('Transaksi tidak ditemukan');
    res.json({ success: true, data: trx });
  }),
  create: asyncHandler(async (req, res) => {
    const trx = await stockService.createTransaction(req.body, req.user.id);
    const label = trx.type === 'in' ? 'Barang masuk' : 'Barang keluar';
    res.status(201).json({ success: true, message: `${label} berhasil dicatat, stok diperbarui`, data: trx });
  }),
};
