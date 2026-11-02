// Ekspor array objek menjadi file CSV. columns: [{ header, key | accessor }]
export const exportCsv = (filename, columns, rows) => {
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [columns.map((c) => escape(c.header)).join(',')];
  rows.forEach((row) => lines.push(columns.map((c) => escape(c.accessor ? c.accessor(row) : row[c.key])).join(',')));

  const blob = new Blob([`\uFEFF${lines.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
