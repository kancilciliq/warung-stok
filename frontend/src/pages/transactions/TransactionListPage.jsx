import { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { transactionApi } from '../../api/transactionApi';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ErrorBox from '../../components/common/ErrorBox';
import TransactionDetailModal from './TransactionDetailModal';
import { formatDate } from '../../utils/format';

/** type: 'in' | 'out' */
export default function TransactionListPage({ type }) {
  const isIn = type === 'in';
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [detailId, setDetailId] = useState(null);

  const { data, loading, error, reload } = useFetch(
    () => transactionApi.list({ type, from: from || undefined, to: to || undefined }),
    [type, from, to],
    [],
  );

  const columns = [
    { key: 'transaction_code', header: 'Kode Transaksi' },
    { key: 'transaction_date', header: 'Tanggal', render: (r) => formatDate(r.transaction_date) },
    ...(isIn ? [{ key: 'supplier_name', header: 'Supplier' }] : []),
    { key: 'item_count', header: 'Jenis Item' },
    { key: 'total_qty', header: 'Total Qty' },
    { key: 'user_name', header: 'Petugas' },
    { key: 'note', header: 'Catatan' },
  ];

  return (
    <>
      <PageHeader title={isIn ? 'Barang Masuk' : 'Barang Keluar'} subtitle={isIn ? 'Pencatatan barang yang masuk (menambah stok)' : 'Pencatatan barang yang keluar (mengurangi stok)'}>
        <Link to={`/transactions/${type}/new`} className="btn btn-primary">+ Catat Barang {isIn ? 'Masuk' : 'Keluar'}</Link>
      </PageHeader>

      <div className="filters">
        <label>Dari <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label>Sampai <input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        {(from || to) && <button type="button" className="btn btn-sm" onClick={() => { setFrom(''); setTo(''); }}>Reset</button>}
      </div>

      <ErrorBox message={error} onRetry={reload} />
      <div className="card">
        <DataTable
          columns={columns}
          rows={data}
          loading={loading}
          actions={(row) => <button type="button" className="btn btn-sm" onClick={() => setDetailId(row.id)}>Detail</button>}
        />
      </div>

      {detailId && <TransactionDetailModal id={detailId} onClose={() => setDetailId(null)} />}
    </>
  );
}
