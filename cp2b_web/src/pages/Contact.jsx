import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Contact = () => {
  const { language } = useLanguage();

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const labels = {
    pt: {
      tag: 'FALE CONOSCO',
      title: 'Entre em Contato',
      address: 'Endereco',
      direct: 'Contatos Diretos',
      general: 'Geral',
      financial: 'Financeiro',
      phone: 'Telefone',
      sendMsg: 'Envie uma mensagem',
      formName: 'NOME',
      formEmail: 'E-MAIL',
      formMsg: 'MENSAGEM',
      formBtn: 'ENVIAR MENSAGEM',
      sending: 'Enviando...',
      successMsg: 'Mensagem enviada com sucesso!',
      errorMsg: 'Erro ao enviar mensagem. Tente novamente.',
      requiredFields: 'Preencha todos os campos.',
      invalidEmail: 'E-mail invalido.',
    },
    en: {
      tag: 'GET IN TOUCH',
      title: 'Contact Us',
      address: 'Address',
      direct: 'Direct Contacts',
      general: 'General',
      financial: 'Administrative',
      phone: 'Phone',
      sendMsg: 'Send a message',
      formName: 'NAME',
      formEmail: 'E-MAIL',
      formMsg: 'MESSAGE',
      formBtn: 'SEND MESSAGE',
      sending: 'Sending...',
      successMsg: 'Message sent successfully!',
      errorMsg: 'Failed to send message. Please try again.',
      requiredFields: 'Please fill in all fields.',
      invalidEmail: 'Invalid email address.',
    }
  }[language];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: false, success: false, error: null });

    const { name, email, message } = formData;
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ loading: false, success: false, error: labels.requiredFields });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({ loading: false, success: false, error: labels.invalidEmail });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      await api.post('/contact', { name: name.trim(), email: email.trim(), message: message.trim() });
      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setStatus({ loading: false, success: false, error: labels.errorMsg });
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8} className="text-center mb-5">
           <span className="mono-label text-success">{labels.tag}</span>
           <h1 className="display-4 fw-bold">{labels.title}</h1>
        </Col>
      </Row>

      <Row className="justify-content-center g-5">
        <Col lg={5}>
          <div className="mb-5">
            <h4 className="fw-bold mb-3">{labels.address}</h4>
            <p className="text-muted">
              Rua Cora Coralina, 330<br/>
              Universidade Estadual de Campinas - UNICAMP<br/>
              Campinas - São Paulo, Brasil<br/>
              CEP: 13083-896
            </p>
          </div>

          <div className="mb-5">
            <h4 className="fw-bold mb-3">{labels.direct}</h4>
            <p className="text-muted mb-1"><strong>{labels.general}:</strong> nipe@nipe.unicamp.br</p>
            <p className="text-muted mb-1"><strong>{labels.financial}:</strong> administrativo@cp2b.unicamp.br</p>
            <p className="text-muted"><strong>{labels.phone}:</strong> +55 (19) 3521-1244</p>
          </div>

          <div className="mt-4">
               <img
                 src="/assets/nipe_unicamp_2024-07-08_22-20-16_jpg_2024-07-08_22-20-16.webp"
                 alt="NIPE Unicamp"
                 className="img-fluid border border-dark"
               />
          </div>
        </Col>

        <Col lg={6}>
          <div className="bg-light p-4 border border-dark h-100">
            <h4 className="fw-bold mb-4">{labels.sendMsg}</h4>

            {status.success && (
              <Alert variant="success" dismissible onClose={() => setStatus({ ...status, success: false })}>
                {labels.successMsg}
              </Alert>
            )}
            {status.error && (
              <Alert variant="danger" dismissible onClose={() => setStatus({ ...status, error: null })}>
                {status.error}
              </Alert>
            )}

            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="mono-label text-muted">{labels.formName}</Form.Label>
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
                <Form.Label className="mono-label text-muted">{labels.formEmail}</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-0 border-dark bg-transparent"
                  disabled={status.loading}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="mono-label text-muted">{labels.formMsg}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="rounded-0 border-dark bg-transparent"
                  disabled={status.loading}
                />
              </Form.Group>
              <Button variant="dark" type="submit" className="w-100 py-3" disabled={status.loading}>
                {status.loading ? (
                  <><Spinner animation="border" size="sm" className="me-2" />{labels.sending}</>
                ) : (
                  labels.formBtn
                )}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
