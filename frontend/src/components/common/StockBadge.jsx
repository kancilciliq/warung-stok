import Badge from './Badge';

export default function StockBadge({ stock, minStock }) {
  if (stock === 0) return <Badge variant="red">Habis</Badge>;
  if (stock <= minStock) return <Badge variant="yellow">Stok Rendah</Badge>;
  return <Badge variant="green">Aman</Badge>;
}
