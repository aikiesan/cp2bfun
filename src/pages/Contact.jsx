import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { language } = useLanguage();

  const labels = {
    pt: {
      tag: 'FALE CONOSCO',
      title: 'Entre em Contato',
      address: 'Endereço',
      direct: 'Contatos Diretos',
      general: 'Geral',
      financial: 'Financeiro',
      phone: 'Telefone',
      sendMsg: 'Envie uma mensagem',
      formName: 'NOME',
      formEmail: 'E-MAIL',
      formMsg: 'MENSAGEM',
      formBtn: 'ENVIAR MENSAGEM'
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
      formBtn: 'SEND MESSAGE'
    }
  }[language];

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
            <Form onSubmit={(e) => e.preventDefault()}>
              <Form.Group className="mb-3">
                <Form.Label className="mono-label text-muted">{labels.formName}</Form.Label>
                <Form.Control type="text" className="rounded-0 border-dark bg-transparent" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="mono-label text-muted">{labels.formEmail}</Form.Label>
                <Form.Control type="email" className="rounded-0 border-dark bg-transparent" />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="mono-label text-muted">{labels.formMsg}</Form.Label>
                <Form.Control as="textarea" rows={5} className="rounded-0 border-dark bg-transparent" />
              </Form.Group>
              <Button variant="dark" type="submit" className="w-100 py-3">
                {labels.formBtn}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;