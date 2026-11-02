const pool = require('../config/db');

/**
 * Pabrik model CRUD sederhana untuk tabel master.
 * @param {string} table   nama tabel
 * @param {string[]} fields kolom yang boleh diisi/diubah (whitelist)
 * @param {string} searchField kolom untuk pencarian
 */
module.exports = (table, fields, searchField = 'name') => {
  const pick = (data) => Object.fromEntries(fields.filter((f) => data[f] !== undefined).map((f) => [f, data[f] === '' ? null : data[f]]));

  return {
    async findAll({ search } = {}) {
      let sql = `SELECT * FROM ${table}`;
      const params = [];
      if (search) { sql += ` WHERE ${searchField} LIKE ?`; params.push(`%${search}%`); }
      sql += ' ORDER BY id DESC';
      const [rows] = await pool.query(sql, params);
      return rows;
    },
    async findById(id) {
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
      return rows[0] || null;
    },
    async create(data) {
      const [res] = await pool.query(`INSERT INTO ${table} SET ?`, [pick(data)]);
      return this.findById(res.insertId);
    },
    async update(id, data) {
      const payload = pick(data);
      if (Object.keys(payload).length) await pool.query(`UPDATE ${table} SET ? WHERE id = ?`, [payload, id]);
      return this.findById(id);
    },
    async remove(id) {
      const [res] = await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
      return res.affectedRows > 0;
    },
  };
};
