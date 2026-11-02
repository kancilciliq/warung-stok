const pool = require('../config/db');

const HEADER_SELECT = `
  SELECT t.*, u.name AS user_name, s.name AS supplier_name,
         (SELECT COUNT(*) FROM stock_transaction_details d WHERE d.transaction_id = t.id) AS item_count,
         (SELECT COALESCE(SUM(d.quantity), 0) FROM stock_transaction_details d WHERE d.transaction_id = t.id) AS total_qty
  FROM stock_transactions t
  JOIN users u ON u.id = t.user_id
  LEFT JOIN suppliers s ON s.id = t.supplier_id`;

module.exports = {
  async findAll({ type, from, to } = {}) {
    const where = [];
    const params = [];
    if (type) { where.push('t.type = ?'); params.push(type); }
    if (from) { where.push('t.transaction_date >= ?'); params.push(from); }
    if (to) { where.push('t.transaction_date <= ?'); params.push(to); }
    const sql = `${HEADER_SELECT} ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY t.transaction_date DESC, t.id DESC`;
    const [rows] = await pool.query(sql, params);
    return rows;
  },
  async findById(id, conn = pool) {
    const [rows] = await conn.query(`${HEADER_SELECT} WHERE t.id = ?`, [id]);
    if (!rows[0]) return null;
    const [items] = await conn.query(
      `SELECT d.*, p.code AS product_code, p.name AS product_name, p.unit
       FROM stock_transaction_details d JOIN products p ON p.id = d.product_id
       WHERE d.transaction_id = ? ORDER BY d.id`,
      [id],
    );
    return { ...rows[0], items };
  },
};
