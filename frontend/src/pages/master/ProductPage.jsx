import { useMemo } from 'react';
import CrudPage from '../../components/common/CrudPage';
import StockBadge from '../../components/common/StockBadge';
import useFetch from '../../hooks/useFetch';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';

const emptyForm = { code: '', name: '', category_id: '', unit: 'pcs', min_stock: 0 };

export default function ProductPage() {
  const { data: categories } = useFetch(() => categoryApi.list(), [], []);

  const fields = useMemo(() => [
    { name: 'code', label: 'Kode Barang', required: true },
    { name: 'name', label: 'Nama Barang', required: true },
    { name: 'category_id', label: 'Kategori', type: 'select', required: true, options: categories.map((c) => ({ value: c.id, label: c.name })) },
    { name: 'unit', label: 'Satuan (pcs, kg, botol, ...)' },
    { name: 'min_stock', label: 'Stok Minimum', type: 'number', required: true },
  ], [categories]);

  const columns = [
    { key: 'code', header: 'Kode' },
    { key: 'name', header: 'Nama Barang' },
    { key: 'category_name', header: 'Kategori' },
    { key: 'stock', header: 'Stok', render: (r) => <strong>{r.stock} {r.unit}</strong> },
    { key: 'min_stock', header: 'Min.' },
    { key: 'status', header: 'Status', render: (r) => <StockBadge stock={r.stock} minStock={r.min_stock} /> },
  ];

  return (
    <CrudPage
      title="Data Barang"
      subtitle="Stok hanya berubah melalui transaksi barang masuk / keluar"
      entityName="Barang"
      api={productApi}
      columns={columns}
      fields={fields}
      emptyForm={emptyForm}
      searchKeys={['code', 'name', 'category_name']}
    />
  );
}
