const pool = require('../config/db');
const transactionModel = require('../models/transactionModel');
const ApiError = require('../utils/ApiError');

const pad = (n) => String(n).padStart(2, '0');

const generateCode = (type) => {
  const d = new Date();
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  const rand = Math.floor(Math.random() * 900 + 100);
  return `${type === 'in' ? 'IN' : 'OUT'}-${stamp}-${rand}`;
};

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Gabungkan item dengan product_id sama, validasi qty
const normalizeItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) throw ApiError.badRequest('Minimal 1 item barang harus diisi');

  const map = new Map();
  for (const it of items) {
    const productId = Number(it.product_id);
    const qty = Number(it.quantity);
    if (!Number.isInteger(productId) || productId <= 0) throw ApiError.badRequest('Barang pada item tidak valid');
    if (!Number.isInteger(qty) || qty <= 0) throw ApiError.badRequest('Jumlah harus bilangan bulat lebih dari 0');
    map.set(productId, (map.get(productId) || 0) + qty);
  }
  // Urutkan by id agar urutan lock konsisten (hindari deadlock)
  return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([product_id, quantity]) => ({ product_id, quantity }));
};

module.exports = {
  /**
   * Simpan nota barang masuk/keluar + update stok secara atomik.
   * Stok Akhir = Stok Awal + Barang Masuk - Barang Keluar
   */
  async createTransaction({ type, supplier_id, note, transaction_date, items }, userId) {
    if (!['in', 'out'].includes(type)) throw ApiError.badRequest('Tipe transaksi harus "in" atau "out"');
    const normalized = normalizeItems(items);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [header] = await conn.query(
        `INSERT INTO stock_transactions (transaction_code, user_id, supplier_id, type, transaction_date, note)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [generateCode(type), userId, type === 'in' ? supplier_id || null : null, type, transaction_date || today(), note || null],
      );

      for (const { product_id, quantity } of normalized) {
        const [rows] = await conn.query('SELECT id, name, stock FROM products WHERE id = ? FOR UPDATE', [product_id]);
        if (!rows[0]) throw ApiError.notFound(`Barang dengan ID ${product_id} tidak ditemukan`);

        const before = rows[0].stock;
        const after = type === 'in' ? before + quantity : before - quantity;
        if (after < 0) throw ApiError.badRequest(`Stok "${rows[0].name}" tidak cukup (tersisa ${before}, diminta ${quantity})`);

        await conn.query('UPDATE products SET stock = ? WHERE id = ?', [after, product_id]);
        await conn.query(
          `INSERT INTO stock_transaction_details (transaction_id, product_id, quantity, stock_before, stock_after)
           VALUES (?, ?, ?, ?, ?)`,
          [header.insertId, product_id, quantity, before, after],
        );
      }

      await conn.commit();
      return transactionModel.findById(header.insertId, conn);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};
