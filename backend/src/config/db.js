const mysql = require('mysql2/promise');
const { db } = require('./env');

const pool = mysql.createPool({
  ...db,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true, // DATE/TIMESTAMP dikembalikan sebagai string
});

module.exports = pool;
