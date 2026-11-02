import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/http';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.username, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <h1>Warung Madura</h1>
        <p className="muted">Sistem Monitoring Stok Barang</p>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input id="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoFocus required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Masuk...' : 'Masuk'}</button>
      </form>
    </div>
  );
}
