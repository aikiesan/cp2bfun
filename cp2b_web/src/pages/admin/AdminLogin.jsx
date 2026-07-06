import { useState } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { adminLogin } from '../../services/api';

/**
 * Full-screen login gate shown when the backend requires authentication
 * (ADMIN_PASSWORD set) and this browser has no valid token yet.
 */
const AdminLogin = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await adminLogin(password);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Não foi possível entrar. Verifique a senha.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 px-3"
      style={{ background: 'linear-gradient(130deg, #00323f 0%, #004d61 55%, #0b5a48 100%)' }}
    >
      <Card className="shadow-lg border-0 w-100" style={{ maxWidth: '400px' }}>
        <Card.Body className="p-4 p-md-5">
          <div className="text-center mb-4">
            <img
              src="/assets/CP2B-LOGO-COLOR-DEGRADE@8x.png"
              alt="CP2b"
              style={{ height: '56px' }}
              className="mb-3"
            />
            <h1 className="h4 fw-bold mb-1">Painel Administrativo</h1>
            <p className="text-muted small mb-0">Digite a senha de administração para continuar.</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="admin-password">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                autoComplete="current-password"
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100" disabled={submitting || !password}>
              {submitting ? <Spinner size="sm" animation="border" className="me-2" /> : <i className="bi bi-unlock me-2"></i>}
              Entrar
            </Button>
          </Form>

          <p className="text-muted text-center mt-4 mb-0" style={{ fontSize: '0.78rem' }}>
            Esqueceu a senha? Ela é definida pela variável <code>ADMIN_PASSWORD</code> no
            servidor — peça ao responsável pela hospedagem para redefini-la.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminLogin;
