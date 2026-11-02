import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { reportApi } from '../../api/reportApi';
import { productApi } from '../../api/productApi';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ErrorBox from '../../components/common/ErrorBox';
import Badge from '../../components/common/Badge';
import { formatDate, typeLabel } from '../../utils/format';
import { exportCsv } from '../../utils/exportCsv';

const columns = [
  { key: 'transaction_date', header: 'Tanggal', render: (r) => formatDate(r.transaction_date) },
  { key: 'transaction_code', header: 'Kode Transaksi' },
  { key: 'product_name', header: 'Barang' },
  { key: 'type', header: 'Tipe', render: (r) => <Badge variant={r.type === 'in' ? 'green' : 'red'}>{typeLabel(r.type)}</Badge> },
  { key: 'quantity', header: 'Jumlah', render: (r) => `${r.type === 'in' ? '+' : '-'}${r.quantity} ${r.unit}` },
  { key: 'stock_before', header: 'Stok Sebelum' },
  { key: 'stock_after', header: 'Stok Sesudah', render: (r) => <strong>{r.stock_after}</strong> },
  { key: 'user_name', header: 'Petugas' },
];

export default function HistoryPage() {
  const [filters, setFilters] = useState({ product_id: '', type: '', from: '', to: '' });
  const set = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));

  const { data: products } = useFetch(() => productApi.list(), [], []);
  const { data, loading, error, reload } = useFetch(
    () => reportApi.history(Object.fromEntries(Object.entries(filters).filter(([, v]) => v))),
    [filters],
    [],
  );

  const onExport = () => exportCsv('riwayat-stok.csv', [
    { header: 'Tanggal', key: 'transaction_date' }, { header: 'Kode', key: 'transaction_code' },
    { header: 'Barang', key: 'product_name' }, { header: 'Tipe', accessor: (r) => typeLabel(r.type) },
    { header: 'Jumlah', key: 'quantity' }, { header: 'Stok Sebelum', key: 'stock_before' },
    { header: 'Stok Sesudah', key: 'stock_after' }, { header: 'Petugas', key: 'user_name' },
  ], data);

  return (
    <>
      <PageHeader title="Riwayat Perubahan Stok" subtitle="Telusuri setiap perubahan stok (maks. 1000 data terbaru)">
        <button type="button" className="btn" onClick={onExport} disabled={!data.length}>Ekspor CSV</button>
      </PageHeader>

      <div className="filters">
        <label>Barang
          <select value={filters.product_id} onChange={set('product_id')}>
            <option value="">Semua</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <label>Tipe
          <select value={filters.type} onChange={set('type')}>
            <option value="">Semua</option><option value="in">Masuk</option><option value="out">Keluar</option>
          </select>
        </label>
        <label>Dari <input type="date" value={filters.from} onChange={set('from')} /></label>
        <label>Sampai <input type="date" value={filters.to} onChange={set('to')} /></label>
      </div>

      <ErrorBox message={error} onRetry={reload} />
      <div className="card"><DataTable columns={columns} rows={data} loading={loading} emptyText="Tidak ada riwayat" /></div>
    </>
  );
}
