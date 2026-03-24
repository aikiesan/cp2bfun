import { useState } from 'react';
import { Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const labels = {
  pt: {
    title: 'Receba nossas novidades',
    subtitle: 'Inscreva-se na nossa newsletter para ficar por dentro das pesquisas e eventos CP2b.',
    namePlaceholder: 'Seu nome (opcional)',
    emailPlaceholder: 'Seu e-mail',
    button: 'Inscrever',
    subscribing: 'Inscrevendo...',
    success: 'Inscrição realizada! Verifique seu e-mail.',
    errorEmpty: 'Informe um e-mail válido.',
    errorServer: 'Erro ao realizar inscrição. Tente novamente.',
  },
  en: {
    title: 'Stay up to date',
    subtitle: 'Subscribe to our newsletter to stay informed about CP2b research and events.',
    namePlaceholder: 'Your name (optional)',
    emailPlaceholder: 'Your email',
    button: 'Subscribe',
    subscribing: 'Subscribing...',
    success: 'Subscribed! Check your email.',
    errorEmpty: 'Please enter a valid email.',
    errorServer: 'Subscription failed. Please try again.',
  },
};

const NewsletterSignup = () => {
  const { language } = useLanguage();
  const t = labels[language];

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus('error');
      setErrorMsg(t.errorEmpty);
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      await api.post('/newsletter/subscribe', { email: email.trim(), name: name.trim() || undefined });
      setStatus('success');
      setEmail('');
      setName('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.error || t.errorServer);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5 className="mb-2 text-uppercase fw-bold text-success">{t.title}</h5>
      <p className="mb-3" style={{ fontSize: '0.85rem', color: '#ccc' }}>{t.subtitle}</p>

      {status === 'success' && (
        <Alert variant="success" className="py-2 px-3" style={{ fontSize: '0.85rem' }}>
          <i className="bi bi-check-circle me-2"></i>{t.success}
        </Alert>
      )}
      {status === 'error' && (
        <Alert variant="danger" className="py-2 px-3" style={{ fontSize: '0.85rem' }}>
          <i className="bi bi-exclamation-circle me-2"></i>{errorMsg}
        </Alert>
      )}

      {status !== 'success' && (
        <Form onSubmit={handleSubmit} style={{ maxWidth: '480px' }}>
          <Form.Control
            type="text"
            placeholder={t.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2 bg-dark text-white border-secondary newsletter-input"
            style={{ fontSize: '0.85rem', color: 'white' }}
          />
          <InputGroup>
            <Form.Control
              type="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-dark text-white border-secondary newsletter-input"
              style={{ fontSize: '0.85rem', color: 'white' }}
            />
            <Button
              type="submit"
              variant="success"
              disabled={loading}
              style={{ fontSize: '0.85rem' }}
            >
              {loading ? t.subscribing : t.button}
            </Button>
          </InputGroup>
        </Form>
      )}
    </div>
  );
};

export default NewsletterSignup;
