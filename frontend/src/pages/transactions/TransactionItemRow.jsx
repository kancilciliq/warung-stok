export default function TransactionItemRow({ item, products, type, onChange, onRemove, canRemove }) {
  const product = products.find((p) => String(p.id) === String(item.product_id));
  const exceeds = type === 'out' && product && Number(item.quantity) > product.stock;

  return (
    <div className="item-row">
      <select value={item.product_id} onChange={(e) => onChange({ product_id: e.target.value })} required>
        <option value="">-- Pilih barang --</option>
        {products.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
      </select>
      <input type="number" min="1" placeholder="Jumlah" value={item.quantity} onChange={(e) => onChange({ quantity: e.target.value })} required />
      <span className={`stock-hint ${exceeds ? 'text-danger' : ''}`}>
        {product ? `Stok: ${product.stock} ${product.unit}${exceeds ? ' (tidak cukup!)' : ''}` : ''}
      </span>
      <button type="button" className="btn btn-sm btn-danger" onClick={onRemove} disabled={!canRemove}>×</button>
    </div>
  );
}
