const reportModel = require('../models/reportModel');
const productModel = require('../models/productModel');
const asyncHandler = require('../utils/asyncHandler');

module.exports = {
  dashboard: asyncHandler(async (req, res) => {
    const [summary, lowStock] = await Promise.all([reportModel.dashboardSummary(), productModel.findLowStock()]);
    const recent = await reportModel.history({});
    res.json({ success: true, data: { summary, low_stock: lowStock.slice(0, 8), recent_activity: recent.slice(0, 8) } });
  }),
  stock: asyncHandler(async (req, res) => {
    const { category_id: categoryId, status } = req.query;
    res.json({ success: true, data: await reportModel.stockReport({ categoryId, status }) });
  }),
  history: asyncHandler(async (req, res) => {
    const { product_id: productId, type, from, to } = req.query;
    res.json({ success: true, data: await reportModel.history({ productId, type, from, to }) });
  }),
};
