const pool = require('../config/db');

module.exports = {
  async dashboardSummary() {
    const [[totals]] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM products) AS total_products,
        (SELECT COUNT(*) FROM categories) AS total_categories,
        (SELECT COALESCE(SUM(stock), 0) FROM products) AS total_stock,
        (SELECT COUNT(*) FROM products WHERE stock <= min_stock) AS low_stock_count,
        (SELECT COUNT(*) FROM products WHERE stock = 0) AS out_of_stock_count`);

    const [[today]] = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN t.type = 'in'  THEN d.quantity END), 0) AS in_today,
        COALESCE(SUM(CASE WHEN t.type = 'out' THEN d.quantity END), 0) AS out_today
      FROM stock_transactions t
      JOIN stock_transaction_details d ON d.transaction_id = t.id
      WHERE t.transaction_date = CURDATE()`);

    return { ...totals, ...today };
  },

  async stockReport({ categoryId, status } = {}) {
    const where = [];
    const params = [];
    if (categoryId) { where.push('p.category_id = ?'); params.push(categoryId); }
    if (status === 'low') where.push('p.stock <= p.min_stock AND p.stock > 0');
    if (status === 'empty') where.push('p.stock = 0');
    if (status === 'safe') where.push('p.stock > p.min_stock');

    const [rows] = await pool.query(
      `SELECT p.id, p.code, p.name, c.name AS category_name, p.unit, p.stock, p.min_stock,
         CASE WHEN p.stock = 0 THEN 'Habis'
              WHEN p.stock <= p.min_stock THEN 'Stok Rendah'
              ELSE 'Aman' END AS status
       FROM products p JOIN categories c ON c.id = p.category_id
       ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
       ORDER BY c.name, p.name`,
      params,
    );
    return rows;
  },

  // Riwayat perubahan stok per item (stock_before -> stock_after)
  async history({ productId, type, from, to } = {}) {
    const where = [];
    const params = [];
    if (productId) { where.push('d.product_id = ?'); params.push(productId); }
    if (type) { where.push('t.type = ?'); params.push(type); }
    if (from) { where.push('t.transaction_date >= ?'); params.push(from); }
    if (to) { where.push('t.transaction_date <= ?'); params.push(to); }

    const [rows] = await pool.query(
      `SELECT d.id, t.transaction_code, t.transaction_date, t.type, t.created_at,
              p.code AS product_code, p.name AS product_name, p.unit,
              d.quantity, d.stock_before, d.stock_after, u.name AS user_name
       FROM stock_transaction_details d
       JOIN stock_transactions t ON t.id = d.transaction_id
       JOIN products p ON p.id = d.product_id
       JOIN users u ON u.id = t.user_id
       ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
       ORDER BY t.transaction_date DESC, d.id DESC
       LIMIT 1000`,
      params,
    );
    return rows;
  },
};
