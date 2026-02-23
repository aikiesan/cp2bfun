import { Container, Row, Col, Button, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const inviteToken = import.meta.env.VITE_INVITE_TOKEN || 'palavra-secreta';

const labels = {
  pt: {
    tag: 'EVENTO',
    title: 'Forum Paulista',
    subtitle: 'Encontro da Cadeia de Biogás e Bioprodutos do Estado de São Paulo',
    description:
      'O Forum Paulista reúne pesquisadores, empresas, gestores públicos e parceiros para debater os avanços, desafios e oportunidades da cadeia de biogás e bioprodutos no Estado de São Paulo. O evento é promovido pelo CP2b — Centro Paulista de Estudos em Biogás e Bioprodutos.',
    meetupBtn: 'Registro Meet-up',
    registerBtn: 'Inscrição e Pagamento (Unicamp)',
    programBtn: 'Ver Programação',
    faqTitle: 'Perguntas Frequentes',
    faq: [
      {
        q: 'Quem pode participar?',
        a: 'O evento é aberto a pesquisadores, estudantes, profissionais e empresas com interesse na cadeia de biogás e bioprodutos.',
      },
      {
        q: 'Como me inscrevo?',
        a: 'As inscrições são realizadas pelo sistema da Unicamp. Clique no botão "Inscrição e Pagamento" acima.',
      },
      {
        q: 'O evento tem custo?',
        a: 'Consulte o site de inscrições para informações sobre taxas de participação.',
      },
      {
        q: 'Onde será realizado?',
        a: 'O local exato será divulgado em breve. Fique de olho nas nossas redes sociais.',
      },
      {
        q: 'Posso apresentar trabalho?',
        a: 'Sim. As submissões de trabalhos serão abertas em breve. Acompanhe os comunicados.',
      },
    ],
  },
  en: {
    tag: 'EVENT',
    title: 'Forum Paulista',
    subtitle: 'São Paulo State Biogas and Bioproducts Chain Meeting',
    description:
      'The Forum Paulista brings together researchers, companies, public managers and partners to discuss advances, challenges and opportunities in the biogas and bioproducts chain in São Paulo State. The event is promoted by CP2b — São Paulo Center for Biogas and Bioproducts Studies.',
    meetupBtn: 'Meet-up Registration',
    registerBtn: 'Registration & Payment (Unicamp)',
    programBtn: 'View Program',
    faqTitle: 'Frequently Asked Questions',
    faq: [
      {
        q: 'Who can attend?',
        a: 'The event is open to researchers, students, professionals and companies with interest in the biogas and bioproducts chain.',
      },
      {
        q: 'How do I register?',
        a: 'Registration is done through the Unicamp system. Click the "Registration & Payment" button above.',
      },
      {
        q: 'Is there a registration fee?',
        a: 'Please check the registration website for information on participation fees.',
      },
      {
        q: 'Where will it take place?',
        a: 'The exact venue will be announced soon. Stay tuned to our social media.',
      },
      {
        q: 'Can I present a paper?',
        a: 'Yes. Paper submissions will open soon. Follow our announcements.',
      },
    ],
  },
};

const ForumPaulista = () => {
  const { language } = useLanguage();
  const t = labels[language];

  return (
    <Container className="py-5">
      {/* Hero */}
      <Row className="justify-content-center text-center mb-5">
        <Col lg={8}>
          <span className="mono-label text-success">{t.tag}</span>
          <h1 className="display-4 fw-bold mt-2">{t.title}</h1>
          <p className="lead text-muted">{t.subtitle}</p>
          <p className="mt-3">{t.description}</p>
          <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
            <Link
              to={`/registro?convite=${inviteToken}`}
              className="btn btn-success btn-lg px-4"
            >
              {t.meetupBtn}
            </Link>
            <Button
              variant="dark"
              size="lg"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4"
            >
              {t.registerBtn}
            </Button>
            <Button
              variant="outline-dark"
              size="lg"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4"
            >
              {t.programBtn}
            </Button>
          </div>
        </Col>
      </Row>

      {/* FAQ */}
      <Row className="justify-content-center">
        <Col lg={8}>
          <h2 className="fw-bold mb-4">{t.faqTitle}</h2>
          <Accordion>
            {t.faq.map((item, idx) => (
              <Accordion.Item key={idx} eventKey={String(idx)}>
                <Accordion.Header>{item.q}</Accordion.Header>
                <Accordion.Body className="text-muted">{item.a}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default ForumPaulista;
