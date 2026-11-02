const pool = require('../config/db');

const BASE_SELECT = `
  SELECT p.*, c.name AS category_name,
         (p.stock <= p.min_stock) AS is_low_stock
  FROM products p
  JOIN categories c ON c.id = p.category_id`;

module.exports = {
  async findAll({ search, categoryId } = {}) {
    const where = [];
    const params = [];
    if (search) { where.push('(p.name LIKE ? OR p.code LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    if (categoryId) { where.push('p.category_id = ?'); params.push(categoryId); }
    const sql = `${BASE_SELECT} ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY p.name ASC`;
    const [rows] = await pool.query(sql, params);
    return rows.map((r) => ({ ...r, is_low_stock: !!r.is_low_stock }));
  },
  async findLowStock() {
    const [rows] = await pool.query(`${BASE_SELECT} WHERE p.stock <= p.min_stock ORDER BY (p.stock - p.min_stock) ASC, p.name ASC`);
    return rows.map((r) => ({ ...r, is_low_stock: true }));
  },
  async findById(id) {
    const [rows] = await pool.query(`${BASE_SELECT} WHERE p.id = ?`, [id]);
    return rows[0] ? { ...rows[0], is_low_stock: !!rows[0].is_low_stock } : null;
  },
  // Stok sengaja TIDAK bisa diisi di sini: stok hanya berubah lewat transaksi.
  async create({ category_id, code, name, unit, min_stock }) {
    const [res] = await pool.query(
      'INSERT INTO products (category_id, code, name, unit, min_stock, stock) VALUES (?, ?, ?, ?, ?, 0)',
      [category_id, code, name, unit || 'pcs', min_stock || 0],
    );
    return this.findById(res.insertId);
  },
  async update(id, { category_id, code, name, unit, min_stock }) {
    await pool.query(
      `UPDATE products SET category_id = COALESCE(?, category_id), code = COALESCE(?, code),
         name = COALESCE(?, name), unit = COALESCE(?, unit), min_stock = COALESCE(?, min_stock) WHERE id = ?`,
      [category_id ?? null, code ?? null, name ?? null, unit ?? null, min_stock ?? null, id],
    );
    return this.findById(id);
  },
  async remove(id) {
    const [res] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return res.affectedRows > 0;
  },
};
