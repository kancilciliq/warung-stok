const app = require('./app');
const pool = require('./config/db');
const { port } = require('./config/env');

(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Terhubung ke database MySQL');
    app.listen(port, () => console.log(`Server berjalan di http://localhost:${port}/api`));
  } catch (err) {
    console.error('Gagal terhubung ke database:', err.message);
    process.exit(1);
  }
})();
