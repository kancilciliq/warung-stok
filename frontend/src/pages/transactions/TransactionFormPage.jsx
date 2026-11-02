import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { productApi } from '../../api/productApi';
import { supplierApi } from '../../api/supplierApi';
import { transactionApi } from '../../api/transactionApi';
import { getErrorMessage } from '../../api/http';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/common/PageHeader';
import TransactionItemRow from './TransactionItemRow';
import { todayISO } from '../../utils/format';

const emptyItem = () => ({ key: Math.random(), product_id: '', quantity: '' });

/** type: 'in' | 'out' */
export default function TransactionFormPage({ type }) {
  const isIn = type === 'in';
  const navigate = useNavigate();
  const { notify } = useToast();

  const { data: products } = useFetch(() => productApi.list(), [type], []);
  const { data: suppliers } = useFetch(() => (isIn ? supplierApi.list() : Promise.resolve([])), [type], []);

  const [header, setHeader] = useState({ transaction_date: todayISO(), supplier_id: '', note: '' });
  const [items, setItems] = useState([emptyItem()]);
  const [saving, setSaving] = useState(false);

  const updateItem = (key, patch) => setItems((list) => list.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  const removeItem = (key) => setItems((list) => list.filter((it) => it.key !== key));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await transactionApi.create({
        type,
        transaction_date: header.transaction_date,
        supplier_id: isIn && header.supplier_id ? Number(header.supplier_id) : null,
        note: header.note,
        items: items.map((it) => ({ product_id: Number(it.product_id), quantity: Number(it.quantity) })),
      });
      notify(res.message);
      navigate(`/transactions/${type}`);
    } catch (err) {
      notify(getErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title={`Catat Barang ${isIn ? 'Masuk' : 'Keluar'}`} subtitle="Stok akan diperbarui otomatis setelah disimpan" />

      <form className="card" onSubmit={submit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Tanggal <span className="req">*</span></label>
            <input id="date" type="date" value={header.transaction_date} onChange={(e) => setHeader({ ...header, transaction_date: e.target.value })} required />
          </div>
          {isIn && (
            <div className="form-group">
              <label htmlFor="supplier">Supplier (opsional)</label>
              <select id="supplier" value={header.supplier_id} onChange={(e) => setHeader({ ...header, supplier_id: e.target.value })}>
                <option value="">-- Tanpa supplier --</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="note">Catatan</label>
          <input id="note" value={header.note} onChange={(e) => setHeader({ ...header, note: e.target.value })} placeholder="Opsional" />
        </div>

        <h3 className="section-title">Daftar Barang</h3>
        {items.map((it) => (
          <TransactionItemRow
            key={it.key}
            item={it}
            products={products}
            type={type}
            canRemove={items.length > 1}
            onChange={(patch) => updateItem(it.key, patch)}
            onRemove={() => removeItem(it.key)}
          />
        ))}
        <button type="button" className="btn btn-sm" onClick={() => setItems((l) => [...l, emptyItem()])}>+ Tambah item</button>

        <div className="modal-footer">
          <button type="button" className="btn" onClick={() => navigate(`/transactions/${type}`)}>Batal</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Transaksi'}</button>
        </div>
      </form>
    </>
  );
}
