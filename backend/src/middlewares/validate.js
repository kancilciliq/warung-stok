const ApiError = require('../utils/ApiError');

/**
 * validate({ name: { required: true, label: 'Nama' }, qty: { type: 'int', min: 1 } })
 * Validasi sederhana untuk req.body
 */
module.exports = (rules) => (req, res, next) => {
  const errors = [];

  for (const [field, rule] of Object.entries(rules)) {
    const label = rule.label || field;
    const value = req.body[field];
    const empty = value === undefined || value === null || value === '';

    if (empty) {
      if (rule.required) errors.push(`${label} wajib diisi`);
      continue;
    }
    if (rule.type === 'int') {
      if (!Number.isInteger(Number(value))) errors.push(`${label} harus berupa bilangan bulat`);
      else if (rule.min !== undefined && Number(value) < rule.min) errors.push(`${label} minimal ${rule.min}`);
    }
    if (rule.oneOf && !rule.oneOf.includes(value)) errors.push(`${label} harus salah satu dari: ${rule.oneOf.join(', ')}`);
    if (rule.minLength && String(value).length < rule.minLength) errors.push(`${label} minimal ${rule.minLength} karakter`);
  }

  if (errors.length) return next(ApiError.badRequest(errors[0], errors));
  next();
};
