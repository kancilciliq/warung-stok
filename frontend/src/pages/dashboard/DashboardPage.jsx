import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { reportApi } from '../../api/reportApi';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ErrorBox from '../../components/common/ErrorBox';
import Badge from '../../components/common/Badge';
import StatCard from './StatCard';
import { formatDate, typeLabel } from '../../utils/format';

export default function DashboardPage() {
  const { data, loading, error, reload } = useFetch(() => reportApi.dashboard(), []);
  const s = data?.summary;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Ringkasan kondisi stok warung" />
      <ErrorBox message={error} onRetry={reload} />

      {loading && !data ? <div className="state-box">Memuat data...</div> : data && (
        <>
          <div className="stat-grid">
            <StatCard label="Total Barang" value={s.total_products} />
            <StatCard label="Total Stok (unit)" value={s.total_stock} variant="green" />
            <StatCard label="Stok Rendah" value={s.low_stock_count} variant="yellow" />
            <StatCard label="Stok Habis" value={s.out_of_stock_count} variant="red" />
            <StatCard label="Masuk Hari Ini" value={s.in_today} variant="green" />
            <StatCard label="Keluar Hari Ini" value={s.out_today} variant="gray" />
          </div>

          <div className="grid-2">
            <section className="card">
              <div className="card-title">
                <h3>Peringatan Stok Minimum</h3>
                <Link to="/reports">Lihat semua</Link>
              </div>
              <DataTable
                rows={data.low_stock}
                emptyText="Semua stok aman 🎉"
                columns={[
                  { key: 'name', header: 'Barang' },
                  { key: 'stock', header: 'Stok', render: (r) => <strong>{r.stock} {r.unit}</strong> },
                  { key: 'min_stock', header: 'Minimum' },
                  { key: 'status', header: 'Status', render: (r) => (r.stock === 0 ? <Badge variant="red">Habis</Badge> : <Badge variant="yellow">Rendah</Badge>) },
                ]}
              />
            </section>

            <section className="card">
              <div className="card-title">
                <h3>Aktivitas Terbaru</h3>
                <Link to="/history">Lihat riwayat</Link>
              </div>
              <DataTable
                rows={data.recent_activity}
                emptyText="Belum ada transaksi"
                columns={[
                  { key: 'transaction_date', header: 'Tanggal', render: (r) => formatDate(r.transaction_date) },
                  { key: 'product_name', header: 'Barang' },
                  { key: 'type', header: 'Tipe', render: (r) => <Badge variant={r.type === 'in' ? 'green' : 'red'}>{typeLabel(r.type)}</Badge> },
                  { key: 'quantity', header: 'Jumlah' },
                ]}
              />
            </section>
          </div>
        </>
      )}
    </>
  );
}
