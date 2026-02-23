import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { confirmMeetup } from '../services/api';

const labels = {
  pt: {
    title: 'Confirmação de Reunião',
    loading: 'Confirmando sua reunião...',
    success: 'Reunião confirmada!',
    alreadyConfirmed: 'Esta reunião já foi confirmada.',
    slot: 'Horário',
    table: 'Mesa',
    with: 'Com',
    bothEmailed: 'Ambos os participantes receberão um e-mail de confirmação.',
    backHome: 'Voltar ao início',
    tokenMissing: 'Token ausente na URL.',
    error: 'Não foi possível confirmar a reunião.',
  },
  en: {
    title: 'Meeting Confirmation',
    loading: 'Confirming your meeting...',
    success: 'Meeting confirmed!',
    alreadyConfirmed: 'This meeting was already confirmed.',
    slot: 'Time slot',
    table: 'Table',
    with: 'With',
    bothEmailed: 'Both participants will receive a confirmation email.',
    backHome: 'Back to home',
    tokenMissing: 'Token missing from URL.',
    error: 'Could not confirm the meeting.',
  },
};

const ConfirmarMeetup = () => {
  const { language } = useLanguage();
  const t = labels[language];
  const [searchParams] = useSearchParams();

  const [state, setState] = useState({ loading: true, success: false, alreadyDone: false, meetup: null, error: null });

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setState({ loading: false, success: false, alreadyDone: false, meetup: null, error: t.tokenMissing });
      return;
    }

    confirmMeetup(token)
      .then(data => {
        const already = data.message?.includes('já confirmada') || data.message?.includes('already confirmed');
        setState({ loading: false, success: true, alreadyDone: already, meetup: data.meetup, error: null });
      })
      .catch(err => {
        const msg = err.response?.data?.error || err.message || t.error;
        setState({ loading: false, success: false, alreadyDone: false, meetup: null, error: msg });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <h1 className="fw-bold mb-4">{t.title}</h1>

          {state.loading && (
            <div className="py-5">
              <Spinner animation="border" className="mb-3" />
              <p className="text-muted">{t.loading}</p>
            </div>
          )}

          {!state.loading && state.success && state.meetup && (
            <Card className="border-dark text-start">
              <Card.Body className="p-4">
                <Alert variant={state.alreadyDone ? 'info' : 'success'}>
                  {state.alreadyDone ? t.alreadyConfirmed : t.success}
                </Alert>

                <dl className="row mb-0">
                  <dt className="col-sm-4">{t.slot}</dt>
                  <dd className="col-sm-8">{state.meetup.label}</dd>

                  <dt className="col-sm-4">{t.table}</dt>
                  <dd className="col-sm-8">{state.meetup.table_number}</dd>

                  <dt className="col-sm-4">{t.with}</dt>
                  <dd className="col-sm-8">
                    {state.meetup.requester_name} &amp; {state.meetup.invitee_name}
                  </dd>
                </dl>

                {!state.alreadyDone && (
                  <p className="text-muted small mt-3 mb-0">{t.bothEmailed}</p>
                )}
              </Card.Body>
            </Card>
          )}

          {!state.loading && state.error && (
            <Alert variant="danger">{state.error}</Alert>
          )}

          <div className="mt-4">
            <Link to="/" className="btn btn-outline-dark">
              {t.backHome}
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ConfirmarMeetup;
