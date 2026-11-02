const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { db } = require('../src/config/env');

(async () => {
  const conn = await mysql.createConnection({ host: db.host, port: db.port, user: db.user, password: db.password, multipleStatements: true });
  const sql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8').replace(/warung_madura_stok/g, db.database);
  await conn.query(sql);
  console.log(`Migrasi selesai: database "${db.database}" siap.`);
  await conn.end();
})().catch((e) => { console.error('Migrasi gagal:', e.message); process.exit(1); });
