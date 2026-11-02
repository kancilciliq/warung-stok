const ApiError = require('../utils/ApiError');

const notFound = (req, res, next) => next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} tidak ada`));

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Terjadi kesalahan pada server';

  // Error MySQL umum
  if (err.code === 'ER_DUP_ENTRY') { status = 409; message = 'Data duplikat: nilai tersebut sudah digunakan'; }
  if (err.code === 'ER_ROW_IS_REFERENCED_2') { status = 409; message = 'Data tidak dapat dihapus karena masih digunakan data lain'; }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') { status = 400; message = 'Data referensi (kategori/supplier/barang) tidak valid'; }

  if (status === 500) console.error(err);
  res.status(status).json({ success: false, message, details: err.details });
};

module.exports = { notFound, errorHandler };
