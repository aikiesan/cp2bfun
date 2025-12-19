import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Contact = () => (
  <Container className="py-5">
    <Row className="justify-content-center">
      <Col lg={8} className="text-center mb-5">
         <span className="mono-label text-success">FALE CONOSCO</span>
         <h1 className="display-4 fw-bold">Entre em Contato</h1>
      </Col>
    </Row>

    <Row className="justify-content-center g-5">
      <Col lg={5}>
        <div className="mb-5">
          <h4 className="fw-bold mb-3">Endereço</h4>
          <p className="text-muted">
            Rua Cora Coralina, 330<br/>
            Universidade Estadual de Campinas - UNICAMP<br/>
            Campinas - São Paulo, Brasil<br/>
            CEP: 13083-896
          </p>
        </div>

        <div className="mb-5">
          <h4 className="fw-bold mb-3">Contatos Diretos</h4>
          <p className="text-muted mb-1"><strong>Geral:</strong> nipe@nipe.unicamp.br</p>
          <p className="text-muted mb-1"><strong>Financeiro:</strong> administrativo@cp2b.unicamp.br</p>
          <p className="text-muted"><strong>Telefone:</strong> +55 (19) 3521-1244</p>
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
          <h4 className="fw-bold mb-4">Envie uma mensagem</h4>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="mono-label text-muted">NOME</Form.Label>
              <Form.Control type="text" className="rounded-0 border-dark bg-transparent" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="mono-label text-muted">E-MAIL</Form.Label>
              <Form.Control type="email" className="rounded-0 border-dark bg-transparent" />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="mono-label text-muted">MENSAGEM</Form.Label>
              <Form.Control as="textarea" rows={5} className="rounded-0 border-dark bg-transparent" />
            </Form.Group>
            <Button variant="dark" type="submit" className="w-100 py-3">
              ENVIAR MENSAGEM
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  </Container>
);

export default Contact;