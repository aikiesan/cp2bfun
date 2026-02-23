import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { registerParticipant } from '../services/api';
import _api from '../services/api';

const INVITE_TOKEN = import.meta.env.VITE_INVITE_TOKEN || 'palavra-secreta';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const labels = {
  pt: {
    tag: 'FORUM PAULISTA',
    title: 'Cadastro de Participante',
    name: 'Nome completo *',
    affiliation: 'Afiliação / Instituição *',
    email: 'E-mail *',
    miniBio: 'Mini-bio (máx. 100 palavras)',
    miniBioPlaceholder: 'Conte um pouco sobre você e sua área de atuação...',
    photo: 'Foto de perfil',
    photoHint: 'JPG, PNG ou WEBP — máx. 5MB',
    keywords: 'Palavras-chave / Áreas de interesse (separadas por vírgula)',
    abstract: 'Resumo / Abstract',
    submit: 'CADASTRAR',
    submitting: 'Cadastrando...',
    success: 'Cadastro realizado! Você receberá um e-mail de confirmação.',
    requiredFields: 'Preencha os campos obrigatórios (nome, afiliação, e-mail).',
    invalidEmail: 'E-mail inválido.',
    bioTooLong: 'A mini-bio deve ter no máximo 100 palavras.',
    words: 'palavras',
    unauthorized: 'Link de convite inválido.',
  },
  en: {
    tag: 'FORUM PAULISTA',
    title: 'Participant Registration',
    name: 'Full name *',
    affiliation: 'Affiliation / Institution *',
    email: 'E-mail *',
    miniBio: 'Mini-bio (max. 100 words)',
    miniBioPlaceholder: 'Tell us a little about yourself and your area of expertise...',
    photo: 'Profile photo',
    photoHint: 'JPG, PNG or WEBP — max 5MB',
    keywords: 'Keywords / Areas of interest (comma-separated)',
    abstract: 'Abstract',
    submit: 'REGISTER',
    submitting: 'Registering...',
    success: 'Registration complete! You will receive a confirmation email.',
    requiredFields: 'Please fill in the required fields (name, affiliation, email).',
    invalidEmail: 'Invalid email address.',
    bioTooLong: 'Mini-bio must be 100 words or fewer.',
    words: 'words',
    unauthorized: 'Invalid invite link.',
  },
};

function countWords(str) {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

const Registro = () => {
  const { language } = useLanguage();
  const t = labels[language];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileRef = useRef(null);

  const [authorized, setAuthorized] = useState(false);
  const [formData, setFormData] = useState({
    name: '', affiliation: '', email: '', mini_bio: '', keywords: '', abstract: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    const token = searchParams.get('convite');
    if (token === INVITE_TOKEN) {
      setAuthorized(true);
    } else {
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate]);

  if (!authorized) return null;

  const wordCount = countWords(formData.mini_bio);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: false, success: false, error: null });

    const { name, affiliation, email } = formData;
    if (!name.trim() || !affiliation.trim() || !email.trim()) {
      return setStatus({ loading: false, success: false, error: t.requiredFields });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setStatus({ loading: false, success: false, error: t.invalidEmail });
    }

    if (wordCount > 100) {
      return setStatus({ loading: false, success: false, error: t.bioTooLong });
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      let photo_url = null;

      // Upload photo if selected
      if (photoFile) {
        const fd = new FormData();
        fd.append('image', photoFile);
        const uploadRes = await fetch(`${API_URL}/upload/image`, { method: 'POST', body: fd });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          photo_url = uploadData.url || uploadData.path || null;
        }
      }

      await registerParticipant({
        name: name.trim(),
        affiliation: affiliation.trim(),
        email: email.trim().toLowerCase(),
        mini_bio: formData.mini_bio.trim() || undefined,
        photo_url,
        keywords: formData.keywords || undefined,
        abstract: formData.abstract.trim() || undefined,
      });

      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', affiliation: '', email: '', mini_bio: '', keywords: '', abstract: '' });
      setPhotoFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Erro ao cadastrar.';
      setStatus({ loading: false, success: false, error: msg });
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={7} className="text-center mb-5">
          <span className="mono-label text-success">{t.tag}</span>
          <h1 className="display-5 fw-bold mt-2">{t.title}</h1>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col lg={7}>
          <div className="bg-light p-4 border border-dark">
            {status.success && (
              <Alert variant="success" dismissible onClose={() => setStatus(s => ({ ...s, success: false }))}>
                {t.success}
              </Alert>
            )}
            {status.error && (
              <Alert variant="danger" dismissible onClose={() => setStatus(s => ({ ...s, error: null }))}>
                {status.error}
              </Alert>
            )}

            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="mono-label text-muted">{t.name}</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="rounded-0 border-dark bg-transparent"
                  disabled={status.loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="mono-label text-muted">{t.affiliation}</Form.Label>
                <Form.Control
                  type="text"
                  name="affiliation"
                  value={formData.affiliation}
                  onChange={handleChange}
                  className="rounded-0 border-dark bg-transparent"
                  disabled={status.loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="mono-label text-muted">{t.email}</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-0 border-dark bg-transparent"
                  disabled={status.loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="mono-label text-muted">
                  {t.miniBio}{' '}
                  <Badge bg={wordCount > 100 ? 'danger' : 'secondary'} className="ms-1">
                    {wordCount} {t.words}
                  </Badge>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="mini_bio"
                  value={formData.mini_bio}
                  onChange={handleChange}
                  placeholder={t.miniBioPlaceholder}
                  className="rounded-0 border-dark bg-transparent"
                  disabled={status.loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="mono-label text-muted">{t.photo}</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  ref={fileRef}
                  onChange={e => setPhotoFile(e.target.files[0] || null)}
                  className="rounded-0 border-dark bg-transparent"
                  disabled={status.loading}
                />
                <Form.Text className="text-muted">{t.photoHint}</Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="mono-label text-muted">{t.keywords}</Form.Label>
                <Form.Control
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="rounded-0 border-dark bg-transparent"
                  disabled={status.loading}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="mono-label text-muted">{t.abstract}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleChange}
                  className="rounded-0 border-dark bg-transparent"
                  disabled={status.loading}
                />
              </Form.Group>

              <Button variant="dark" type="submit" className="w-100 py-3" disabled={status.loading}>
                {status.loading ? (
                  <><Spinner animation="border" size="sm" className="me-2" />{t.submitting}</>
                ) : (
                  t.submit
                )}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Registro;
