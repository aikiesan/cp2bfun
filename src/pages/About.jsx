import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const About = () => (
  <Container className="py-5">
    <Row className="mb-5 align-items-center">
      <Col lg={6}>
        <span className="mono-label text-success">NOSSA MISSÃO</span>
        <h1 className="display-4 fw-bold mb-4">Promover o uso inteligente de resíduos para sustentabilidade.</h1>
      </Col>
      <Col lg={6}>
        <p className="lead text-muted">
          O Centro Paulista de Estudos em Biogás (CP2B) busca conhecimento e articula ações para aproveitar o grande potencial de biogás em São Paulo, especialmente nos setores sucroenergético e urbano (RSU e esgoto).
        </p>
      </Col>
    </Row>

    <div className="mb-5 position-relative">
       <img 
         src="/assets/DSC00617-1024x683.jpg" 
         alt="Pesquisa no CP2B" 
         className="w-100 object-fit-cover" 
         style={{ height: '500px', filter: 'grayscale(100%)' }} 
         onMouseOver={e => e.currentTarget.style.filter='none'} 
         onMouseOut={e => e.currentTarget.style.filter='grayscale(100%)'}
       />
       <div className="position-absolute bottom-0 start-0 bg-white p-3 border-top border-end border-dark" style={{ maxWidth: '300px' }}>
          <span className="mono-label mb-0">LABORATÓRIO VIVO</span>
       </div>
    </div>

    <Row className="gy-5">
      <Col md={4}>
        <h3 className="fw-bold mb-3">Atuação</h3>
        <p className="text-muted">
          O centro pesquisa bioprodutos, atua em oito eixos temáticos e opera como laboratório vivo, testando soluções com a sociedade.
        </p>
      </Col>
      <Col md={4}>
        <h3 className="fw-bold mb-3">Parcerias</h3>
        <p className="text-muted">
          Com apoio da FAPESP e diversas instituições parceiras, visamos criar competências com base em ciência para soluções inovadoras.
        </p>
      </Col>
      <Col md={4}>
        <h3 className="fw-bold mb-3">Impacto</h3>
        <p className="text-muted">
          Focamos nos Objetivos de Desenvolvimento Sustentável (ODS), desde energia limpa até cidades sustentáveis.
        </p>
      </Col>
    </Row>
  </Container>
);

export default About;