import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onToggleMenu }) {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <button type="button" className="btn-icon menu-toggle" onClick={onToggleMenu} aria-label="Menu">☰</button>
      <div className="topbar-right">
        <span className="user-info">{user?.name} <em>({user?.role})</em></span>
        <button type="button" className="btn btn-sm" onClick={logout}>Keluar</button>
      </div>
    </header>
  );
}
