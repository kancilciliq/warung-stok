/**
 * columns: [{ key, header, render?(row) }]
 * actions: (row) => ReactNode  (opsional)
 */
export default function DataTable({ columns, rows, actions, loading, emptyText = 'Belum ada data' }) {
  if (loading) return <div className="state-box">Memuat data...</div>;

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: 48 }}>No</th>
            {columns.map((c) => <th key={c.key}>{c.header}</th>)}
            {actions && <th style={{ width: 160 }}>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length + (actions ? 2 : 1)} className="empty">{emptyText}</td></tr>
          )}
          {rows.map((row, i) => (
            <tr key={row.id ?? i}>
              <td>{i + 1}</td>
              {columns.map((c) => <td key={c.key}>{c.render ? c.render(row) : row[c.key] ?? '-'}</td>)}
              {actions && <td><div className="row-actions">{actions(row)}</div></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
