import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarPlus, FaCheck } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const EventForm = ({ eventName, eventDate, onSubmit }) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    role: '',
    dietary: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const labels = {
    pt: {
      title: 'Inscrição para Evento',
      name: 'Nome completo',
      email: 'E-mail',
      institution: 'Instituição',
      role: 'Função',
      rolePlaceholder: 'Ex: Pesquisador, Estudante, Empresário',
      dietary: 'Restrições alimentares (opcional)',
      dietaryPlaceholder: 'Ex: Vegetariano, alergia a glúten',
      submit: 'Confirmar Inscrição',
      submitting: 'Enviando...',
      success: 'Inscrição realizada com sucesso!',
      successMessage: 'Você receberá um e-mail de confirmação em breve.',
      addToCalendar: 'Adicionar ao Calendário',
      required: 'Campo obrigatório'
    },
    en: {
      title: 'Event Registration',
      name: 'Full name',
      email: 'Email',
      institution: 'Institution',
      role: 'Role',
      rolePlaceholder: 'E.g.: Researcher, Student, Entrepreneur',
      dietary: 'Dietary restrictions (optional)',
      dietaryPlaceholder: 'E.g.: Vegetarian, gluten allergy',
      submit: 'Confirm Registration',
      submitting: 'Submitting...',
      success: 'Registration successful!',
      successMessage: 'You will receive a confirmation email shortly.',
      addToCalendar: 'Add to Calendar',
      required: 'Required field'
    }
  }[language];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (onSubmit) {
      onSubmit(formData);
    }

    setSubmitted(true);
    setLoading(false);
  };

  const generateCalendarLink = () => {
    if (!eventDate || !eventName) return '#';

    const startDate = new Date(eventDate);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // +2 hours

    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: eventName,
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: 'CP2B Event - Centro Paulista de Estudos em Biogás e Bioprodutos',
      location: 'NIPE/UNICAMP, Campinas, SP'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <div
      className="p-4"
      style={{
        background: 'var(--cp2b-white)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--cp2b-border-light)'
      }}
    >
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <FaCalendarPlus style={{ color: 'var(--cp2b-petrol)' }} />
              {labels.title}
            </h5>

            {eventName && (
              <Alert variant="light" className="mb-4 border">
                <strong>{eventName}</strong>
                {eventDate && (
                  <div className="small text-muted mt-1">
                    {new Date(eventDate).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-medium">
                      {labels.name} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-medium">
                      {labels.email} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-medium">
                      {labels.institution} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-medium">{labels.role}</Form.Label>
                    <Form.Control
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder={labels.rolePlaceholder}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label className="small fw-medium">{labels.dietary}</Form.Label>
                    <Form.Control
                      type="text"
                      name="dietary"
                      value={formData.dietary}
                      onChange={handleChange}
                      placeholder={labels.dietaryPlaceholder}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button
                type="submit"
                variant="primary"
                className="w-100 mt-4 rounded-pill"
                disabled={loading}
              >
                {loading ? labels.submitting : labels.submit}
              </Button>
            </Form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: '60px',
                height: '60px',
                background: 'var(--cp2b-green-tint)',
                color: 'var(--cp2b-green)'
              }}
            >
              <FaCheck size={24} />
            </div>
            <h5 className="fw-bold mb-2">{labels.success}</h5>
            <p className="text-muted mb-4">{labels.successMessage}</p>

            {eventDate && (
              <a
                href={generateCalendarLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary rounded-pill px-4"
              >
                <FaCalendarPlus className="me-2" />
                {labels.addToCalendar}
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventForm;
