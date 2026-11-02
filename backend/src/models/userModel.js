const pool = require('../config/db');

const SAFE_COLUMNS = 'id, name, username, role, created_at';

module.exports = {
  async findAll() {
    const [rows] = await pool.query(`SELECT ${SAFE_COLUMNS} FROM users ORDER BY id DESC`);
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.query(`SELECT ${SAFE_COLUMNS} FROM users WHERE id = ?`, [id]);
    return rows[0] || null;
  },
  async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] || null; // termasuk kolom password (untuk login)
  },
  async create({ name, username, password, role }) {
    const [res] = await pool.query('INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)', [name, username, password, role || 'staff']);
    return this.findById(res.insertId);
  },
  async update(id, data) {
    const payload = {};
    ['name', 'username', 'password', 'role'].forEach((f) => { if (data[f]) payload[f] = data[f]; });
    if (Object.keys(payload).length) await pool.query('UPDATE users SET ? WHERE id = ?', [payload, id]);
    return this.findById(id);
  },
  async remove(id) {
    const [res] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return res.affectedRows > 0;
  },
};
