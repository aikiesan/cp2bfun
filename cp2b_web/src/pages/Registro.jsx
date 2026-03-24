import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Spinner, Badge, Card } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { registerParticipant } from '../services/api';

const INVITE_TOKEN = import.meta.env.VITE_INVITE_TOKEN || 'palavra-secreta';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const labels = {
  pt: {
    tag: 'FORUM PAULISTA',
    heroTitle: 'CP2B Meet-up: Conecte-se com a Rede',
    heroSubtitle: 'Um evento de conexões de 15 minutos entre pesquisadores, empresas, autoridades e estudantes',
    profileTypes: [
      { value: 'pesquisador', label: 'Pesquisador', icon: 'bi-mortarboard' },
      { value: 'empresa', label: 'Empresa', icon: 'bi-building' },
      { value: 'autoridade', label: 'Autoridade', icon: 'bi-bank' },
      { value: 'estudante', label: 'Estudante', icon: 'bi-person-workspace' },
    ],
    howItWorks: 'Como funciona',
    step1: 'Registre-se',
    step1Desc: 'Preencha seu perfil com suas áreas de interesse',
    step2: 'Escolha seus matches',
    step2Desc: 'Explore os participantes e selecione com quem quer conversar',
    step3: 'Agende conversas',
    step3Desc: 'Reserve slots de 15 minutos com seus matches',
    formTitle: 'Criar meu perfil',
    profileType: 'Perfil *',
    name: 'Nome completo *',
    affiliation: 'Afiliação / Instituição *',
    email: 'E-mail *',
    miniBio: 'Mini-bio (máx. 100 palavras)',
    miniBioPlaceholder: 'Conte um pouco sobre você e sua área de atuação...',
    photo: 'Foto de perfil',
    photoHint: 'JPG, PNG ou WEBP — máx. 5MB',
    keywords: 'Palavras-chave / Áreas de interesse (separadas por vírgula)',
    discussion: 'O que você quer discutir?',
    discussionPlaceholder: 'Descreva os temas, projetos ou questões sobre os quais gostaria de conversar...',
    submit: 'CRIAR MEU PERFIL',
    submitting: 'Cadastrando...',
    success: 'Perfil criado! Você receberá um e-mail de confirmação. Explore os participantes e agende suas conversas.',
    viewParticipants: 'Ver participantes',
    requiredFields: 'Preencha os campos obrigatórios (nome, afiliação, e-mail).',
    invalidEmail: 'E-mail inválido.',
    bioTooLong: 'A mini-bio deve ter no máximo 100 palavras.',
    words: 'palavras',
  },
  en: {
    tag: 'FORUM PAULISTA',
    heroTitle: 'CP2B Meet-up: Connect with the Network',
    heroSubtitle: 'A 15-minute connection event between researchers, companies, authorities and students',
    profileTypes: [
      { value: 'pesquisador', label: 'Researcher', icon: 'bi-mortarboard' },
      { value: 'empresa', label: 'Company', icon: 'bi-building' },
      { value: 'autoridade', label: 'Authority', icon: 'bi-bank' },
      { value: 'estudante', label: 'Student', icon: 'bi-person-workspace' },
    ],
    howItWorks: 'How it works',
    step1: 'Register',
    step1Desc: 'Fill in your profile with your areas of interest',
    step2: 'Choose your matches',
    step2Desc: 'Browse participants and select who you want to meet',
    step3: 'Schedule conversations',
    step3Desc: 'Book 15-minute slots with your matches',
    formTitle: 'Create my profile',
    profileType: 'Profile *',
    name: 'Full name *',
    affiliation: 'Affiliation / Institution *',
    email: 'E-mail *',
    miniBio: 'Mini-bio (max. 100 words)',
    miniBioPlaceholder: 'Tell us a little about yourself and your area of expertise...',
    photo: 'Profile photo',
    photoHint: 'JPG, PNG or WEBP — max 5MB',
    keywords: 'Keywords / Areas of interest (comma-separated)',
    discussion: 'What do you want to discuss?',
    discussionPlaceholder: 'Describe the topics, projects, or questions you would like to talk about...',
    submit: 'CREATE MY PROFILE',
    submitting: 'Registering...',
    success: 'Profile created! You will receive a confirmation email. Explore participants and schedule your conversations.',
    viewParticipants: 'View participants',
    requiredFields: 'Please fill in the required fields (name, affiliation, email).',
    invalidEmail: 'Invalid email address.',
    bioTooLong: 'Mini-bio must be 100 words or fewer.',
    words: 'words',
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
  const [profileType, setProfileType] = useState('');
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
        profile_type: profileType || undefined,
      });

      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', affiliation: '', email: '', mini_bio: '', keywords: '', abstract: '' });
      setPhotoFile(null);
      setProfileType('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Erro ao cadastrar.';
      setStatus({ loading: false, success: false, error: msg });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="bg-dark text-white py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <span className="mono-label text-success">{t.tag}</span>
              <h1 className="display-5 fw-bold mt-2 mb-3">{t.heroTitle}</h1>
              <p className="lead text-white-50 mb-4">{t.heroSubtitle}</p>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {t.profileTypes.map((pt) => (
                  <Badge key={pt.value} bg="secondary" className="px-3 py-2 fs-6 fw-normal">
                    <i className={`bi ${pt.icon} me-2`}></i>{pt.label}
                  </Badge>
                ))}
              </div>
            </Col>
          </Row>

          {/* How it works */}
          <Row className="justify-content-center mt-5">
            <Col lg={10}>
              <h5 className="text-center text-white-50 text-uppercase mb-4" style={{ letterSpacing: '0.1em', fontSize: '0.8rem' }}>
                {t.howItWorks}
              </h5>
              <Row className="g-4 text-center">
                {[
                  { num: '01', title: t.step1, desc: t.step1Desc, icon: 'bi-person-plus' },
                  { num: '02', title: t.step2, desc: t.step2Desc, icon: 'bi-people' },
                  { num: '03', title: t.step3, desc: t.step3Desc, icon: 'bi-calendar-check' },
                ].map((step) => (
                  <Col md={4} key={step.num}>
                    <div className="p-4 border border-secondary rounded">
                      <div className="text-success mb-2" style={{ fontSize: '2rem' }}>
                        <i className={`bi ${step.icon}`}></i>
                      </div>
                      <div className="text-white-50 mb-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{step.num}</div>
                      <h6 className="fw-bold mb-2">{step.title}</h6>
                      <small className="text-white-50">{step.desc}</small>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Registration Form */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={7}>
            <h2 className="fw-bold mb-4">{t.formTitle}</h2>

            {status.success ? (
              <Alert variant="success" className="p-4">
                <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                <strong>{t.success}</strong>
                <div className="mt-3">
                  <Button variant="success" onClick={() => navigate('/agenda-meetups')}>
                    <i className="bi bi-people me-2"></i>{t.viewParticipants}
                  </Button>
                </div>
              </Alert>
            ) : (
              <div className="bg-light p-4 border border-dark">
                {status.error && (
                  <Alert variant="danger" dismissible onClose={() => setStatus(s => ({ ...s, error: null }))}>
                    {status.error}
                  </Alert>
                )}

                <Form noValidate onSubmit={handleSubmit}>
                  {/* Profile Type */}
                  <Form.Group className="mb-4">
                    <Form.Label className="mono-label text-muted">{t.profileType}</Form.Label>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {t.profileTypes.map((pt) => (
                        <Card
                          key={pt.value}
                          onClick={() => setProfileType(pt.value)}
                          className={`cursor-pointer border-2 ${profileType === pt.value ? 'border-success bg-success bg-opacity-10' : 'border-secondary'}`}
                          style={{ cursor: 'pointer', minWidth: '110px' }}
                        >
                          <Card.Body className="text-center p-3">
                            <i className={`bi ${pt.icon} d-block mb-1 fs-4 ${profileType === pt.value ? 'text-success' : 'text-muted'}`}></i>
                            <small className={`fw-semibold ${profileType === pt.value ? 'text-success' : 'text-muted'}`}>{pt.label}</small>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </Form.Group>

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
                    <Form.Label className="mono-label text-muted">{t.discussion}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="abstract"
                      value={formData.abstract}
                      onChange={handleChange}
                      placeholder={t.discussionPlaceholder}
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
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Registro;
