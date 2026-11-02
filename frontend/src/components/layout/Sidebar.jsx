import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MENU = [
  { to: '/', label: 'Dashboard', end: true },
  { section: 'Master Data' },
  { to: '/products', label: 'Barang' },
  { to: '/categories', label: 'Kategori' },
  { to: '/suppliers', label: 'Supplier' },
  { section: 'Transaksi' },
  { to: '/transactions/in', label: 'Barang Masuk' },
  { to: '/transactions/out', label: 'Barang Keluar' },
  { section: 'Informasi' },
  { to: '/history', label: 'Riwayat Stok' },
  { to: '/reports', label: 'Laporan Stok' },
  { section: 'Pengaturan', adminOnly: true },
  { to: '/users', label: 'Pengguna', adminOnly: true },
];

export default function Sidebar({ open, onNavigate }) {
  const { isAdmin } = useAuth();

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand">Warung Madura<small>Monitoring Stok</small></div>
      <nav>
        {MENU.filter((m) => !m.adminOnly || isAdmin).map((m) => (m.section
          ? <div key={m.section} className="nav-section">{m.section}</div>
          : <NavLink key={m.to} to={m.to} end={m.end} onClick={onNavigate} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{m.label}</NavLink>))}
      </nav>
    </aside>
  );
}
