import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { reportApi } from '../../api/reportApi';
import { categoryApi } from '../../api/categoryApi';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ErrorBox from '../../components/common/ErrorBox';
import Badge from '../../components/common/Badge';
import { exportCsv } from '../../utils/exportCsv';

const STATUS_VARIANT = { Habis: 'red', 'Stok Rendah': 'yellow', Aman: 'green' };

const columns = [
  { key: 'code', header: 'Kode' },
  { key: 'name', header: 'Nama Barang' },
  { key: 'category_name', header: 'Kategori' },
  { key: 'stock', header: 'Stok', render: (r) => <strong>{r.stock} {r.unit}</strong> },
  { key: 'min_stock', header: 'Minimum' },
  { key: 'status', header: 'Status', render: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge> },
];

export default function StockReportPage() {
  const [filters, setFilters] = useState({ category_id: '', status: '' });
  const set = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));

  const { data: categories } = useFetch(() => categoryApi.list(), [], []);
  const { data, loading, error, reload } = useFetch(
    () => reportApi.stock(Object.fromEntries(Object.entries(filters).filter(([, v]) => v))),
    [filters],
    [],
  );

  const onExport = () => exportCsv('laporan-stok.csv', [
    { header: 'Kode', key: 'code' }, { header: 'Nama Barang', key: 'name' }, { header: 'Kategori', key: 'category_name' },
    { header: 'Satuan', key: 'unit' }, { header: 'Stok', key: 'stock' }, { header: 'Minimum', key: 'min_stock' }, { header: 'Status', key: 'status' },
  ], data);

  return (
    <>
      <PageHeader title="Laporan Stok" subtitle="Kondisi stok seluruh barang saat ini">
        <button type="button" className="btn" onClick={onExport} disabled={!data.length}>Ekspor CSV</button>
        <button type="button" className="btn" onClick={() => window.print()}>Cetak</button>
      </PageHeader>

      <div className="filters">
        <label>Kategori
          <select value={filters.category_id} onChange={set('category_id')}>
            <option value="">Semua</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label>Status
          <select value={filters.status} onChange={set('status')}>
            <option value="">Semua</option><option value="safe">Aman</option>
            <option value="low">Stok Rendah</option><option value="empty">Habis</option>
          </select>
        </label>
      </div>

      <ErrorBox message={error} onRetry={reload} />
      <div className="card"><DataTable columns={columns} rows={data} loading={loading} /></div>
    </>
  );
}
