import { Container, Row, Col, Button, Accordion, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const inviteToken = import.meta.env.VITE_INVITE_TOKEN || 'palavra-secreta';

const content = {
  pt: {
    heroBadge: 'I EDIÇÃO • 28 MAI 2026',
    heroTitle: 'I Fórum Paulista de Biogás e Bioprodutos',
    heroSubtitle: 'Encontro da Cadeia de Biogás e Bioprodutos do Estado de São Paulo',
    heroLocation: 'Centro de Convencoes Unicamp Auditorio 3',
    heroDate: '28 de maio de 2026',
    meetupBtn: 'Registro Meet-up',
    registerBtn: 'Inscrição e Pagamento',

    statsParticipants: '90+',
    statsParticipantsLabel: 'Participantes esperados',
    statsAxes: '8',
    statsAxesLabel: 'Eixos Temáticos',
    statsDay: '1',
    statsDayLabel: 'Dia de imersão',

    aboutTag: 'SOBRE O EVENTO',
    aboutTitle: 'Um espaço de encontro e debate para a cadeia de biogás',
    aboutP1:
      'O I Fórum Paulista de Biogás e Bioprodutos é uma iniciativa do CP2b — Centro Paulista de Estudos em Biogás e Bioprodutos, em parceria com o NIPE da Universidade Estadual de Campinas. O evento reúne pesquisadores, estudantes, profissionais e empresas para debater os avanços, desafios e oportunidades da cadeia de biogás e bioprodutos no Estado de São Paulo.',
    aboutP2:
      'A proposta é criar um ambiente propício à troca de experiências, ao fortalecimento de redes de colaboração e à articulação entre academia, setor produtivo e poder público — elementos essenciais para consolidar o ecossistema de biogás e bioprodutos em âmbito estadual e nacional.',
    aboutInfoDate: '28 de maio de 2026',
    aboutInfoLocation: 'Centro de Convencoes Unicamp Auditorio 3',
    aboutInfoOrg: 'NIPE – Universidade Estadual de Campinas',
    aboutInfoAudience: 'Pesquisadores, estudantes, profissionais, empresas',
    aboutInfoAudienceLabel: 'Público',

    programTag: 'PROGRAMAÇÃO',
    programTitle: 'Agenda do Dia',
    programNotice: 'Programação sujeita a alterações.',
    program: [
      { time: '09:00', title: 'Credenciamento e Coffee' },
      { time: '09:30', title: 'Abertura Institucional' },
      { time: '10:00', title: 'Diálogo sobre fontes de financiamento para P&D' },
      { time: '10:45', title: 'Apresentações do CP2b — Eixos Temáticos' },
      { time: '12:30', title: 'Intervalo: Brunch, Pôsteres e Rodadas de Conexão', highlight: true },
      { time: '14:30', title: 'Painel 1: Integração Academia-Indústria' },
      { time: '15:30', title: 'Painel 2: Ecossistema do Mercado de Biogás' },
      { time: '16:30', title: 'Encerramento' },
    ],

    committeeTag: 'ORGANIZAÇÃO',
    committeeTitle: 'Comissão Organizadora',
    committee: [
      { name: 'Bruna de Souza Moraes', role: 'Presidente', inst: 'UNICAMP' },
      { name: 'Renata Piacentini Rodriguez', role: 'Membro', inst: 'UNIFAL' },
      { name: 'Maria Paula Cardeal Volpi', role: 'Membro', inst: 'USP' },
      { name: 'Ana Beatriz Soares Aguiar', role: 'Membro', inst: 'UNICAMP' },
      { name: 'Lucas Nakamura Cerejo', role: 'Membro', inst: 'UNICAMP' },
      { name: 'Fabiane Moreira Vieira', role: 'Membro', inst: 'UNICAMP' },
      { name: 'Sofia Carolina da Silva', role: 'Membro', inst: 'UNICAMP' },
      { name: 'Luciana Cristina Lenhari da Silva', role: 'Membro', inst: 'UNICAMP' },
    ],

    regTag: 'INSCRIÇÕES',
    regTitle: 'Taxas de Participação',
    regTableHeader: ['Categoria', 'Valor'],
    regFees: [
      { cat: 'Estudante de Graduação', val: 'R$ 60,00' },
      { cat: 'Pós-Graduando / Pesquisador / Profissional', val: 'R$ 120,00' },
    ],
    regCta: 'Inscreva-se',

    faqTitle: 'Perguntas Frequentes',
    faq: [
      {
        q: 'Quem pode participar?',
        a: 'O evento é aberto a pesquisadores, estudantes, profissionais e empresas com interesse na cadeia de biogás e bioprodutos.',
      },
      {
        q: 'Como me inscrevo?',
        a: 'As inscrições serão realizadas em breve. Clique no botão "Inscreva-se" acima para ser redirecionado ao formulário de inscrição.',
      },
      {
        q: 'O evento tem custo?',
        a: 'Sim. A taxa de participação varia conforme a categoria: R$ 60,00 para graduandos e R$ 120,00 para pós-graduandos, pesquisadores e profissionais.',
      },
      {
        q: 'Onde será realizado?',
        a: 'O evento será realizado no Centro de Convencoes Unicamp Auditorio 3.',
      },
      {
        q: 'Posso apresentar trabalho?',
        a: 'Sim. As submissões de trabalhos serão abertas em breve. Acompanhe os comunicados.',
      },
    ],
  },
  en: {
    heroBadge: '1ST EDITION • MAY 28, 2026',
    heroTitle: 'I Fórum Paulista de Biogás e Bioprodutos',
    heroSubtitle: 'São Paulo State Biogas and Bioproducts Chain Meeting',
    heroLocation: 'Unicamp Convention Center Auditorium 3',
    heroDate: 'May 28, 2026',
    meetupBtn: 'Meet-up Registration',
    registerBtn: 'Registration & Payment',

    statsParticipants: '90+',
    statsParticipantsLabel: 'Expected participants',
    statsAxes: '8',
    statsAxesLabel: 'Research Axes',
    statsDay: '1',
    statsDayLabel: 'Day of immersion',

    aboutTag: 'ABOUT THE EVENT',
    aboutTitle: 'A meeting and discussion space for the biogas chain',
    aboutP1:
      'The I Fórum Paulista de Biogás e Bioprodutos is an initiative of CP2b — São Paulo Center for Biogas and Bioproducts Studies, in partnership with NIPE at the State University of Campinas. The event brings together researchers, students, professionals and companies to discuss advances, challenges and opportunities in the biogas and bioproducts chain in São Paulo State.',
    aboutP2:
      'The goal is to create an environment conducive to the exchange of experiences, strengthening collaboration networks and articulating academia, the productive sector and public authorities — essential elements to consolidate the biogas and bioproducts ecosystem at state and national levels.',
    aboutInfoDate: 'May 28, 2026',
    aboutInfoLocation: 'Unicamp Convention Center Auditorium 3',
    aboutInfoOrg: 'NIPE – State University of Campinas',
    aboutInfoAudience: 'Researchers, students, professionals, companies',
    aboutInfoAudienceLabel: 'Audience',

    programTag: 'PROGRAM',
    programTitle: 'Day Schedule',
    programNotice: 'Schedule subject to change.',
    program: [
      { time: '09:00', title: 'Check-in and Coffee' },
      { time: '09:30', title: 'Institutional Opening' },
      { time: '10:00', title: 'Dialogue on R&D funding sources' },
      { time: '10:45', title: 'CP2b Presentations — Research Axes' },
      { time: '12:30', title: 'Break: Brunch, Posters and Networking Rounds', highlight: true },
      { time: '14:30', title: 'Panel 1: Academia-Industry Integration' },
      { time: '15:30', title: 'Panel 2: Biogas Market Ecosystem' },
      { time: '16:30', title: 'Closing' },
    ],

    committeeTag: 'ORGANIZATION',
    committeeTitle: 'Organizing Committee',
    committee: [
      { name: 'Bruna de Souza Moraes', role: 'President', inst: 'UNICAMP' },
      { name: 'Renata Piacentini Rodriguez', role: 'Member', inst: 'UNIFAL' },
      { name: 'Maria Paula Cardeal Volpi', role: 'Member', inst: 'USP' },
      { name: 'Ana Beatriz Soares Aguiar', role: 'Member', inst: 'UNICAMP' },
      { name: 'Lucas Nakamura Cerejo', role: 'Member', inst: 'UNICAMP' },
      { name: 'Fabiane Moreira Vieira', role: 'Member', inst: 'UNICAMP' },
      { name: 'Sofia Carolina da Silva', role: 'Member', inst: 'UNICAMP' },
      { name: 'Luciana Cristina Lenhari da Silva', role: 'Member', inst: 'UNICAMP' },
    ],

    regTag: 'REGISTRATION',
    regTitle: 'Participation Fees',
    regTableHeader: ['Category', 'Fee'],
    regFees: [
      { cat: 'Undergraduate Student', val: 'R$ 60.00' },
      { cat: 'Graduate Student / Researcher / Professional', val: 'R$ 120.00' },
    ],
    regCta: 'Register Now',

    faqTitle: 'Frequently Asked Questions',
    faq: [
      {
        q: 'Who can attend?',
        a: 'The event is open to researchers, students, professionals and companies with interest in the biogas and bioproducts chain.',
      },
      {
        q: 'How do I register?',
        a: 'Registration will open soon. Click the "Register Now" button above to be redirected to the registration form.',
      },
      {
        q: 'Is there a registration fee?',
        a: 'Yes. The participation fee varies by category: R$ 60.00 for undergraduate students and R$ 120.00 for graduate students, researchers and professionals.',
      },
      {
        q: 'Where will it take place?',
        a: 'The event will take place in Unicamp Convention Center Auditorium 3.',
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
  const t = content[language];

  return (
    <>
      {/* ── Section 1: Hero ── */}
      <section
        style={{
          position: 'relative',
          backgroundImage: 'url(/assets/DSC00361-1920x748.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '480px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.72)',
          }}
        />
        <Container style={{ position: 'relative', zIndex: 1 }} className="py-5">
          <Row className="justify-content-center text-center">
            <Col lg={9}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className="mono-label text-success">{t.heroBadge}</span>
                <h1 className="display-4 fw-bold text-white mt-2 mb-3">{t.heroTitle}</h1>
                <p className="lead text-white-50 mb-4">{t.heroSubtitle}</p>

                {/* Location + Date */}
                <div className="d-flex justify-content-center gap-4 mb-4 flex-wrap text-white-75">
                  <span className="text-white">
                    <i className="bi bi-geo-alt-fill text-success me-1" />
                    {t.heroLocation}
                  </span>
                  <span className="text-white">
                    <i className="bi bi-calendar-event-fill text-success me-1" />
                    {t.heroDate}
                  </span>
                </div>

                {/* CTAs */}
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Link
                    to={`/registro?convite=${inviteToken}`}
                    className="btn btn-success btn-lg px-4"
                  >
                    {t.meetupBtn}
                  </Link>
                  <Button variant="outline-light" size="lg" href="#" className="px-4">
                    {t.registerBtn}
                  </Button>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Section 2: Stats ── */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="bg-light rounded-4 p-4">
                <Row className="text-center g-4">
                  {[
                    { value: t.statsParticipants, label: t.statsParticipantsLabel },
                    { value: t.statsAxes, label: t.statsAxesLabel },
                    { value: t.statsDay, label: t.statsDayLabel },
                  ].map((stat, i) => (
                    <Col md={4} key={i}>
                      <div className="display-5 fw-bold text-success">{stat.value}</div>
                      <div className="text-muted mt-1">{stat.label}</div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Section 3: About ── */}
      <section className="py-5">
        <Container>
          <Row className="align-items-start g-5">
            {/* Left: text */}
            <Col lg={6}>
              <span className="mono-label text-success">{t.aboutTag}</span>
              <h2 className="fw-bold mt-2 mb-4">{t.aboutTitle}</h2>
              <p className="text-muted">{t.aboutP1}</p>
              <p className="text-muted">{t.aboutP2}</p>
            </Col>
            {/* Right: info card */}
            <Col lg={5} className="offset-lg-1">
              <Card className="border-0 shadow-sm rounded-4 p-1">
                <Card.Body>
                  <ul className="list-unstyled mb-0" style={{ lineHeight: '2.2' }}>
                    <li>
                      <i className="bi bi-calendar-event-fill text-success me-2" />
                      <strong>{t.aboutInfoDate}</strong>
                    </li>
                    <li>
                      <i className="bi bi-geo-alt-fill text-success me-2" />
                      <strong>{t.aboutInfoLocation}</strong>
                    </li>
                    <li>
                      <i className="bi bi-building text-success me-2" />
                      {t.aboutInfoOrg}
                    </li>
                    <li>
                      <i className="bi bi-people-fill text-success me-2" />
                      <span className="text-muted">{t.aboutInfoAudienceLabel}: </span>
                      {t.aboutInfoAudience}
                    </li>
                  </ul>
                </Card.Body>
              </Card>
              <div className="mt-3 rounded-4 overflow-hidden shadow-lg">
                <video
                  width="100%"
                  height="auto"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  poster="/assets/Forum-CP2B-junho-2025-Destaque-500x230.jpg"
                  style={{ display: 'block' }}
                >
                  <source src="/assets/Em-breve-960-x-540-px-2.mp4" type="video/mp4" />
                </video>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Section 4: Program ── */}
      <section className="py-5" style={{ background: '#f8f9fa' }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <span className="mono-label text-success">{t.programTag}</span>
              <h2 className="fw-bold mt-2 mb-4">{t.programTitle}</h2>

              {/* Timeline */}
              <div className="d-flex flex-column gap-0">
                {t.program.map((item, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-start gap-3 py-3"
                    style={{
                      borderLeft: '3px solid #198754',
                      paddingLeft: '1.25rem',
                      background: item.highlight ? 'rgba(25,135,84,0.06)' : 'transparent',
                      borderRadius: item.highlight ? '0 8px 8px 0' : undefined,
                    }}
                  >
                    <div style={{ minWidth: '60px' }}>
                      <span className="mono-label text-success" style={{ fontSize: '0.75rem' }}>
                        {item.time}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`fw-semibold${item.highlight ? ' text-success' : ''}`}
                      >
                        {item.title}
                      </span>
                      {item.highlight && (
                        <span className="ms-2 badge bg-success bg-opacity-10 text-success small">
                          ★
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-muted small mt-3 fst-italic">* {t.programNotice}</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Section 5: Committee ── */}
      <section className="py-5 bg-white">
        <Container>
          <div className="text-center mb-5">
            <span className="mono-label text-success">{t.committeeTag}</span>
            <h2 className="fw-bold mt-2">{t.committeeTitle}</h2>
          </div>
          <Row className="g-3 justify-content-center">
            {t.committee.map((person, i) => (
              <Col md={4} sm={6} key={i}>
                <Card className="border-0 shadow-sm p-3 h-100 hover-lift">
                  <Card.Body className="p-1">
                    <p className="fw-bold mb-0">{person.name}</p>
                    <p className="text-success small mb-0">{person.inst}</p>
                    <p className="text-muted small mb-0">{person.role}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── Section 6: Registration ── */}
      <section className="py-5" style={{ background: '#f8f9fa' }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={7} className="text-center">
              <span className="mono-label text-success">{t.regTag}</span>
              <h2 className="fw-bold mt-2 mb-4">{t.regTitle}</h2>

              <table className="table table-bordered rounded-3 overflow-hidden mb-4">
                <thead className="table-dark">
                  <tr>
                    {t.regTableHeader.map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.regFees.map((fee, i) => (
                    <tr key={i}>
                      <td className="text-start">{fee.cat}</td>
                      <td className="fw-bold text-success">{fee.val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button variant="success" size="lg" href="#" className="px-5">
                  {t.regCta}
                </Button>
                <Link
                  to={`/registro?convite=${inviteToken}`}
                  className="btn btn-outline-success btn-lg px-4"
                >
                  {t.meetupBtn}
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Section 7: FAQ ── */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <h2 className="fw-bold mb-4">{t.faqTitle}</h2>
              <div
                className="rounded-4 p-1"
                style={{ background: '#fafafa', border: '1px solid #e9ecef' }}
              >
                <Accordion flush>
                  {t.faq.map((item, idx) => (
                    <Accordion.Item key={idx} eventKey={String(idx)}>
                      <Accordion.Header>{item.q}</Accordion.Header>
                      <Accordion.Body className="text-muted">{item.a}</Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ForumPaulista;
