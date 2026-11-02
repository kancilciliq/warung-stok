const crudController = require('./crudController');
const productModel = require('../models/productModel');
const asyncHandler = require('../utils/asyncHandler');

const base = crudController(productModel, 'Barang');

module.exports = {
  ...base,
  list: asyncHandler(async (req, res) => {
    const { search, category_id: categoryId } = req.query;
    res.json({ success: true, data: await productModel.findAll({ search, categoryId }) });
  }),
  lowStock: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await productModel.findLowStock() });
  }),
};
