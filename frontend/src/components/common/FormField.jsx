/**
 * Field form generik. field: { name, label, type = 'text' | 'number' | 'select' | 'password' | 'textarea',
 * required, options: [{ value, label }], placeholder }
 */
export default function FormField({ field, value, onChange }) {
  const { name, label, type = 'text', required, options = [], placeholder } = field;
  const common = { id: name, name, required, placeholder, value: value ?? '', onChange: (e) => onChange(name, e.target.value) };

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}{required && <span className="req"> *</span>}</label>
      {type === 'select' ? (
        <select {...common}>
          <option value="">-- Pilih --</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea rows={3} {...common} />
      ) : (
        <input type={type} min={type === 'number' ? 0 : undefined} {...common} />
      )}
    </div>
  );
}
