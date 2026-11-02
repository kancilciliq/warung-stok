class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
  static badRequest(msg, details) { return new ApiError(400, msg, details); }
  static unauthorized(msg = 'Tidak terautentikasi') { return new ApiError(401, msg); }
  static forbidden(msg = 'Akses ditolak') { return new ApiError(403, msg); }
  static notFound(msg = 'Data tidak ditemukan') { return new ApiError(404, msg); }
}

module.exports = ApiError;
