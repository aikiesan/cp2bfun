import { Container, Row, Col, Button, Accordion, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';


const content = {
  pt: {
    heroBadge: 'I EDIÇÃO • 28 MAI 2026',
    heroTitle: 'I Fórum Paulista de Biogás e Bioprodutos',
    heroSubtitle: 'Encontro da Cadeia de Biogás e Bioprodutos do Estado de São Paulo',
    heroLocation: 'Centro de Convencoes Unicamp Auditorio 3',
    heroDate: '28 de maio de 2026',
    scheduleBtn: 'Cronograma do Evento',
    registerBtn: 'Inscreva-se',
    saveDateBtn: 'Salvar Data na Agenda',

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

    axesTag: 'EIXOS TEMÁTICOS',
    axesTitle: 'Eixos Temáticos do Evento',
    axes: [
      { icon: 'bi-shield-check',   title: 'Governança, Regulação e Políticas para o Setor de Biogás' },
      { icon: 'bi-recycle',        title: 'Sustentabilidade e Economia Circular na Cadeia do Biogás' },
      { icon: 'bi-flask',          title: 'Pesquisa, Desenvolvimento e Inovação (PD&I) na Cadeia do Biogás' },
      { icon: 'bi-graph-up-arrow', title: 'Economia e Modelos de Negócio do Biogás e Bioprodutos' },
    ],

    programTag: 'PROGRAMAÇÃO',
    programTitle: 'Agenda do Dia',
    programNotice: 'Programação sujeita a alterações.',
    program: [
      { time: '09:00', title: 'Credenciamento' },
      { time: '09:30', title: 'Abertura Institucional' },
      { time: '10:00', title: 'Diálogo sobre fontes de financiamento para P&D' },
      { time: '10:45', title: 'Apresentações do CP2b — Eixos Temáticos' },
      { time: '12:30', title: 'Intervalo: Brunch, Pôsteres e Rodadas de Conexão', highlight: true },
      { time: '14:30', title: 'Painel 1: Integração Academia-Indústria' },
      { time: '15:30', title: 'Painel 2: Ecossistema do Mercado de Biogás' },
      { time: '16:30', title: 'Encerramento' },
    ],

    templatesTag: 'TEMPLATES DO EVENTO',
    templatesTitle: 'Submissão de Trabalhos',
    templatesSubtitle: 'Utilize os templates oficiais para preparar sua apresentação',
    templatesInstructions: 'Faça uma cópia ou baixe o template para ajustar com seu projeto. Os templates estão disponíveis no Google Drive e podem ser editados diretamente ou baixados em formato compatível.',
    templatesAbstract: 'Template de Resumo',
    templatesAbstractDesc: 'Use este template para submeter o resumo do seu trabalho. Siga as instruções de formatação incluídas no documento.',
    templatesPoster: 'Template de Pôster',
    templatesPosterDesc: 'Utilize este template para criar seu pôster. As apresentações de pôsteres ocorrerão durante o intervalo do evento.',
    templatesDownloadBtn: 'Acessar Template',
    templatesHowTo: 'Como usar os templates:',
    templatesStep1: 'Clique no botão "Acessar Template" para abrir o documento no Google Drive',
    templatesStep2: 'Selecione "Arquivo" → "Fazer uma cópia" para criar sua própria versão editável',
    templatesStep3: 'Alternativamente, selecione "Arquivo" → "Fazer download" para baixar em formato compatível',
    templatesStep4: 'Edite o template com as informações do seu projeto seguindo as instruções fornecidas',

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
    regTitle: 'Taxa de Participação',
    regTableHeader: ['Categoria', 'Valor'],
    regFees: [
      { cat: 'Todos os participantes', val: 'R$ 60,00' },
    ],
    regNote: '✓ Taxa inclui participação no evento + brunch no local',
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
        a: 'Sim. A taxa de participação é R$ 60,00 para todos os participantes e inclui brunch no local do evento.',
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
    heroTitle: 'I São Paulo Forum on Biogás and Bioproduts',
    heroSubtitle: 'São Paulo State Biogas and Bioproducts Chain Meeting',
    heroLocation: 'Unicamp Convention Center Auditorium 3',
    heroDate: 'May 28, 2026',
    scheduleBtn: 'Event Schedule',
    registerBtn: 'Register Now',
    saveDateBtn: 'Save Date in Agenda',

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

    axesTag: 'THEMATIC AXES',
    axesTitle: 'Event Thematic Axes',
    axes: [
      { icon: 'bi-shield-check',   title: 'Governance, Regulation and Policies for the Biogas Sector' },
      { icon: 'bi-recycle',        title: 'Sustainability and Circular Economy in the Biogas Chain' },
      { icon: 'bi-flask',          title: 'Research, Development and Innovation (RD&I) in the Biogas Chain' },
      { icon: 'bi-graph-up-arrow', title: 'Economics and Business Models of Biogas and Bioproducts' },
    ],

    programTag: 'PROGRAM',
    programTitle: 'Day Schedule',
    programNotice: 'Schedule subject to change.',
    program: [
      { time: '09:00', title: 'Check-in' },
      { time: '09:30', title: 'Institutional Opening' },
      { time: '10:00', title: 'Dialogue on R&D funding sources' },
      { time: '10:45', title: 'CP2b Presentations — Research Axes' },
      { time: '12:30', title: 'Break: Brunch, Posters and Networking Rounds', highlight: true },
      { time: '14:30', title: 'Panel 1: Academia-Industry Integration' },
      { time: '15:30', title: 'Panel 2: Biogas Market Ecosystem' },
      { time: '16:30', title: 'Closing' },
    ],

    templatesTag: 'EVENT TEMPLATES',
    templatesTitle: 'Work Submission',
    templatesSubtitle: 'Use the official templates to prepare your presentation',
    templatesInstructions: 'Make a copy or download the template to customize with your project. Templates are available on Google Drive and can be edited directly or downloaded in compatible formats.',
    templatesAbstract: 'Abstract Template',
    templatesAbstractDesc: 'Use this template to submit your work abstract. Follow the formatting instructions included in the document.',
    templatesPoster: 'Poster Template',
    templatesPosterDesc: 'Use this template to create your poster. Poster presentations will take place during the event break.',
    templatesDownloadBtn: 'Access Template',
    templatesHowTo: 'How to use the templates:',
    templatesStep1: 'Click the "Access Template" button to open the document on Google Drive',
    templatesStep2: 'Select "File" → "Make a copy" to create your own editable version',
    templatesStep3: 'Alternatively, select "File" → "Download" to download in a compatible format',
    templatesStep4: 'Edit the template with your project information following the provided instructions',

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
    regTitle: 'Participation Fee',
    regTableHeader: ['Category', 'Fee'],
    regFees: [
      { cat: 'All participants', val: 'R$ 60.00' },
    ],
    regNote: '✓ Fee includes event participation + lunch at the venue',
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
        a: 'Yes. The participation fee is R$ 60.00 for all participants and includes lunch at the venue.',
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
  const { pathname } = useLocation();
  const seo = pageSeo.forum[language] || pageSeo.forum.pt;
  const t = content[language];
  
  
  const googleCalendarUrl = "https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=MjZsNzI0aGRnbWE4NXEzY2VqaGlyOGIyYm4gY182ODAwMDZmOTM2NDBlOWViNGE4YmY0NTQxZmY2ZTM4ZDM2MTQ2OGQxNjM0ZDlhODk5ODg1OGQ5ZmZjYjY4MGQ1QGc&tmsrc=c_680006f93640e9eb4a8bf4541ff6e38d361468d1634d9a8998858d9ffcb680d5%40group.calendar.google.com";


  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
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
                    to="/cronograma-evento"
                    className="btn btn-success btn-lg px-4"
                  >
                    <i className="bi bi-calendar3 me-2" />
                    {t.scheduleBtn}
                  </Link>
                  <Button variant="warning" size="lg" href="https://proceedings.science/cfp/100701?lang=pt-br" target="_blank" rel="noopener noreferrer" className="px-4 fw-bold">
                    {t.registerBtn}
                  </Button>
                  {/* google calendar button (Tarefa M5) */}
                  <Button
                    variant="light"
                    size="lg"
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 fw-semibold text-success"
                  >
                    <i className="bi bi-calendar-plus me-2" />
                    {t.saveDateBtn}
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

      {/* ── Section 3.5: Eixos Temáticos ── */}
      <section className="py-5" style={{ background: '#f8f9fa' }}>
        <Container>
          <div className="text-center mb-5">
            <span className="mono-label text-success">{t.axesTag}</span>
            <h2 className="fw-bold mt-2">{t.axesTitle}</h2>
          </div>
          <Row className="g-4 justify-content-center">
            {t.axes.map((axis, i) => (
              <Col md={6} lg={3} key={i}>
                <Card className="border-0 shadow-sm rounded-4 h-100 hover-lift text-center">
                  <Card.Body className="p-4 d-flex flex-column align-items-center">
                    <div
                      className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-3"
                      style={{ width: '64px', height: '64px', flexShrink: 0 }}
                    >
                      <i className={`bi ${axis.icon} text-success`} style={{ fontSize: '1.75rem' }} />
                    </div>
                    <p className="fw-semibold mb-0">{axis.title}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
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

      {/* ── Section 4.5: Templates ── */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="text-center mb-4">
                <span className="mono-label text-success">{t.templatesTag}</span>
                <h2 className="fw-bold mt-2 mb-3">{t.templatesTitle}</h2>
                <p className="lead text-muted">{t.templatesSubtitle}</p>
              </div>

              {/* Alert box with instructions */}
              <div className="alert alert-info d-flex align-items-start mb-4 rounded-4 border-0 shadow-sm" style={{ background: 'rgba(13, 110, 253, 0.08)' }}>
                <i className="bi bi-info-circle-fill text-primary me-3 mt-1" style={{ fontSize: '1.25rem' }} />
                <div>
                  <p className="mb-0">{t.templatesInstructions}</p>
                </div>
              </div>

              {/* Templates Cards */}
              <Row className="g-4 mb-4">
                {/* Abstract Template */}
                <Col md={6}>
                  <Card className="border-0 shadow-sm rounded-4 h-100 hover-lift">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-success bg-opacity-10 rounded-3 p-3 me-3">
                          <i className="bi bi-file-earmark-text-fill text-success" style={{ fontSize: '2rem' }} />
                        </div>
                        <div>
                          <h4 className="fw-bold mb-1">{t.templatesAbstract}</h4>
                          <span className="badge bg-success bg-opacity-10 text-success">Google Docs</span>
                        </div>
                      </div>
                      <p className="text-muted mb-4">{t.templatesAbstractDesc}</p>
                      <Button
                        variant="success"
                        className="w-100"
                        href="https://docs.google.com/document/d/1--jMkO5zX2LcDtSMMFW0KdM3i5rd7Irh/edit?usp=sharing&ouid=108256720482212850515&rtpof=true&sd=true"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-download me-2" />
                        {t.templatesDownloadBtn}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Poster Template */}
                <Col md={6}>
                  <Card className="border-0 shadow-sm rounded-4 h-100 hover-lift">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-success bg-opacity-10 rounded-3 p-3 me-3">
                          <i className="bi bi-easel-fill text-success" style={{ fontSize: '2rem' }} />
                        </div>
                        <div>
                          <h4 className="fw-bold mb-1">{t.templatesPoster}</h4>
                          <span className="badge bg-success bg-opacity-10 text-success">Google Slides</span>
                        </div>
                      </div>
                      <p className="text-muted mb-4">{t.templatesPosterDesc}</p>
                      <Button
                        variant="success"
                        className="w-100"
                        href="https://docs.google.com/presentation/d/1NMprzfNv4N5z-cnIRXoxhEmfrCnLH1Wx3L8edkIwcp4/edit?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-download me-2" />
                        {t.templatesDownloadBtn}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* How to use instructions */}
              <Card className="border-0 bg-light rounded-4">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-question-circle-fill text-success me-2" />
                    {t.templatesHowTo}
                  </h5>
                  <ol className="mb-0" style={{ lineHeight: '2' }}>
                    <li>{t.templatesStep1}</li>
                    <li>{t.templatesStep2}</li>
                    <li>{t.templatesStep3}</li>
                    <li>{t.templatesStep4}</li>
                  </ol>
                </Card.Body>
              </Card>
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

              <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
                <strong className="text-success">{t.regNote}</strong>
              </p>

              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button variant="success" size="lg" href="https://proceedings.science/cfp/100701?lang=pt-br" target="_blank" rel="noopener noreferrer" className="px-5">
                  {t.regCta}
                </Button>
                <Link
                  to="/cronograma-evento"
                  className="btn btn-outline-success btn-lg px-4"
                >
                  {t.scheduleBtn}
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
