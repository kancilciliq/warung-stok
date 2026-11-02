const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

(async () => {
  const users = [
    ['Administrator', 'admin', 'admin123', 'admin'],
    ['Karyawan Warung', 'staff', 'staff123', 'staff'],
  ];
  for (const [name, username, pass, role] of users) {
    await pool.query('INSERT IGNORE INTO users (name, username, password, role) VALUES (?, ?, ?, ?)', [name, username, await bcrypt.hash(pass, 10), role]);
  }

  const categories = ['Makanan Ringan', 'Minuman', 'Rokok', 'Sembako', 'Kebutuhan Rumah Tangga'];
  for (const c of categories) await pool.query('INSERT IGNORE INTO categories (name) VALUES (?)', [c]);

  const [[{ n }]] = await pool.query('SELECT COUNT(*) AS n FROM suppliers');
  if (!n) await pool.query("INSERT INTO suppliers (name, phone, address) VALUES ('Grosir Makmur', '081234567890', 'Pasar Induk'), ('Toko Sumber Rejeki', '081298765432', 'Jl. Raya')");

  const [cats] = await pool.query('SELECT id, name FROM categories');
  const cat = Object.fromEntries(cats.map((c) => [c.name, c.id]));
  const products = [
    ['MNM-001', 'Air Mineral 600ml', 'Minuman', 'botol', 24],
    ['SMB-001', 'Beras 5kg', 'Sembako', 'karung', 5],
    ['SMB-002', 'Minyak Goreng 1L', 'Sembako', 'pcs', 10],
    ['SMB-003', 'Gula Pasir 1kg', 'Sembako', 'pcs', 10],
    ['RNG-001', 'Keripik Singkong', 'Makanan Ringan', 'pcs', 12],
    ['KRT-001', 'Sabun Mandi', 'Kebutuhan Rumah Tangga', 'pcs', 10],
  ];
  for (const [code, name, c, unit, min] of products) {
    await pool.query('INSERT IGNORE INTO products (category_id, code, name, unit, min_stock, stock) VALUES (?, ?, ?, ?, ?, 0)', [cat[c], code, name, unit, min]);
  }

  console.log('Seed selesai. Login: admin/admin123 atau staff/staff123');
  await pool.end();
})().catch((e) => { console.error('Seed gagal:', e.message); process.exit(1); });
