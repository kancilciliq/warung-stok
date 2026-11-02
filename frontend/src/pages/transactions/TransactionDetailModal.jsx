import useFetch from '../../hooks/useFetch';
import { transactionApi } from '../../api/transactionApi';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { formatDate, formatDateTime, typeLabel } from '../../utils/format';

export default function TransactionDetailModal({ id, onClose }) {
  const { data: trx, loading, error } = useFetch(() => transactionApi.get(id), [id]);

  return (
    <Modal title="Detail Transaksi" onClose={onClose} wide>
      {loading && <div className="state-box">Memuat...</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {trx && (
        <>
          <dl className="detail-grid">
            <dt>Kode</dt><dd><strong>{trx.transaction_code}</strong></dd>
            <dt>Tipe</dt><dd><Badge variant={trx.type === 'in' ? 'green' : 'red'}>Barang {typeLabel(trx.type)}</Badge></dd>
            <dt>Tanggal</dt><dd>{formatDate(trx.transaction_date)}</dd>
            <dt>Dicatat oleh</dt><dd>{trx.user_name} ({formatDateTime(trx.created_at)})</dd>
            {trx.type === 'in' && (<><dt>Supplier</dt><dd>{trx.supplier_name || '-'}</dd></>)}
            <dt>Catatan</dt><dd>{trx.note || '-'}</dd>
          </dl>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Kode</th><th>Barang</th><th>Jumlah</th><th>Stok Sebelum</th><th>Stok Sesudah</th></tr></thead>
              <tbody>
                {trx.items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.product_code}</td>
                    <td>{it.product_name}</td>
                    <td>{trx.type === 'in' ? '+' : '-'}{it.quantity} {it.unit}</td>
                    <td>{it.stock_before}</td>
                    <td><strong>{it.stock_after}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Modal>
  );
}
