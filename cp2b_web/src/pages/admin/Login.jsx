import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--cp2b-bg, #FAFBFC)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '380px', padding: '1rem' }}>
        <div className="text-center mb-4">
          <img src="/assets/CP2B-LOGO-COLOR-DEGRADE@8x.png" alt="CP2b" style={{ height: '56px' }} />
          <h5 className="mt-3 fw-bold" style={{ color: 'var(--cp2b-petrol)' }}>Admin Panel</h5>
        </div>

        <div className="card shadow-sm border-0 p-4">
          {error && (
            <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-exclamation-circle me-2" />{error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
                autoComplete="username"
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="btn w-100 fw-semibold"
              style={{ background: 'var(--cp2b-petrol)', color: '#fff' }}
              disabled={loading}
            >
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
