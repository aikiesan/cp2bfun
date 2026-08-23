import { useState, useEffect } from 'react';
import { Container, Row, Col, Accordion, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../data/content';
import { fetchGallery } from '../services/api';
import SeoHead from '../components/SeoHead';


const content = {
  pt: {
    heroBadge: 'I EDIÇÃO • REALIZADO EM 28 MAI 2026',
    heroTitle: 'I Fórum Paulista de Biogás e Bioprodutos',
    heroSubtitle: 'Encontro da Cadeia de Biogás e Bioprodutos do Estado de São Paulo',
    heroLocation: 'Centro de Convenções Unicamp — Auditório 3',
    heroDate: 'Realizado em 28 de maio de 2026',
    galleryBtn: 'Ver as fotos',

    // TODO(lucas): substituir pelos números finais do evento.
    statsParticipants: '90+',
    statsParticipantsLabel: 'Participantes',
    statsAxes: '8',
    statsAxesLabel: 'Eixos Temáticos',
    statsDay: '1',
    statsDayLabel: 'Dia de imersão',

    aboutTag: 'SOBRE O EVENTO',
    aboutTitle: 'Um espaço de encontro e debate para a cadeia de biogás',
    aboutP1:
      'O I Fórum Paulista de Biogás e Bioprodutos foi uma iniciativa do CP2b, Centro Paulista de Estudos em Biogás e Bioprodutos, em parceria com o NIPE da Universidade Estadual de Campinas. O evento reuniu pesquisadores, estudantes, profissionais e empresas para debater os avanços, desafios e oportunidades da cadeia de biogás e bioprodutos no Estado de São Paulo.',
    aboutP2:
      'A proposta foi criar um ambiente propício à troca de experiências, ao fortalecimento de redes de colaboração e à articulação entre academia, setor produtivo e poder público, elementos essenciais para consolidar o ecossistema de biogás e bioprodutos em âmbito estadual e nacional.',
    aboutInfoDate: '28 de maio de 2026',
    aboutInfoLocation: 'Centro de Convenções',
    aboutInfoOrg: 'Av. Érico Veríssimo, 500 – Cidade Universitária, Barão Geraldo, Campinas - SP, 13083-851',
    aboutInfoAudience: 'Pesquisadores, estudantes, profissionais, empresas',
    aboutInfoAudienceLabel: 'Público',

    sponsorsTag: 'PATROCINADORES',
    sponsorsTitle: 'Apoio e Patrocínio',
    apoioTag: 'APOIO',
    apoioLogos: [
      { name: 'ABME',               logo: '/assets/LOGO_ABME.png'             },
      { name: 'Mulheres do Biogás', logo: '/assets/LOGO_MULHERES_DO_BIOGAS.png' },
    ],

    axesTag: 'EIXOS TEMÁTICOS',
    axesTitle: 'Eixos Temáticos do Evento',
    axes: [
      { icon: 'bi-shield-check',   title: 'Governança, Regulação e Políticas para o Setor de Biogás' },
      { icon: 'bi-recycle',        title: 'Sustentabilidade e Economia Circular na Cadeia do Biogás' },
      { icon: 'bi-flask',          title: 'Pesquisa, Desenvolvimento e Inovação (PD&I) na Cadeia do Biogás' },
      { icon: 'bi-graph-up-arrow', title: 'Economia e Modelos de Negócio do Biogás e Bioprodutos' },
    ],

    programTag: 'PROGRAMAÇÃO',
    programTitle: 'Como foi o dia',
    programNotice: 'Programação realizada em 28 de maio de 2026.',
    program: [
      { time: '09:00', title: 'Credenciamento' },
      { time: '09:30', title: 'Mesa de Abertura Institucional' },
      { time: '10:00', title: 'Patrocinadores e Formalização da Parceria' },
      { time: '10:30', title: 'Mesa: Financiamento para P&D' },
      { time: '11:15', title: 'Mesa: Eixos Temáticos do CP2b' },
      { time: '12:15', title: 'Parceria KI – CP2b' },
      { time: '12:30', title: 'Brunch no Gramado + Pôsteres Temáticos', highlight: true },
      { time: '14:30', title: 'Painel 1: Integração Academia-Indústria' },
      { time: '15:30', title: 'Painel 2: Políticas Públicas e Regulação' },
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

    resultsTag: 'RESULTADOS',
    resultsTitle: 'O que ficou do Fórum',
    // TODO(lucas): substituir pelos resultados e encaminhamentos reais.
    results: [
      { icon: 'bi-people', title: 'Articulação da rede', text: 'TODO(lucas): descrever as conexões e parcerias firmadas durante o evento.' },
      { icon: 'bi-lightbulb', title: 'Encaminhamentos', text: 'TODO(lucas): descrever os encaminhamentos definidos nos painéis.' },
      { icon: 'bi-graph-up-arrow', title: 'Próximos passos', text: 'TODO(lucas): descrever os próximos passos anunciados no encerramento.' },
    ],

    galleryTag: 'REGISTRO FOTOGRÁFICO',
    galleryTitle: 'Fotos do evento',
    gallerySubtitle: 'Clique em um álbum para ver todas as fotos.',
    galleryEmpty: 'As fotos do evento serão publicadas em breve.',
    galleryPhotos: 'fotos',

    faqTitle: 'Perguntas Frequentes',
    faq: [
      {
        q: 'Quem participou?',
        a: 'O evento foi aberto a pesquisadores, estudantes, profissionais e empresas com interesse na cadeia de biogás e bioprodutos.',
      },
      {
        q: 'Onde foi realizado?',
        a: 'O evento foi realizado no Centro de Convenções da Unicamp, Auditório 3, em Campinas - SP.',
      },
      {
        q: 'Haverá uma próxima edição?',
        a: 'TODO(lucas): confirmar se a II edição já tem data ou previsão, e ajustar esta resposta.',
      },
      {
        q: 'Como acesso as apresentações?',
        a: 'TODO(lucas): informar onde os resumos, pôsteres e apresentações ficarão disponíveis.',
      },
      {
        q: 'Onde vejo as fotos?',
        a: 'O registro fotográfico está na seção de fotos desta página e também na Galeria do site.',
      },
    ],
  },
  en: {
    heroBadge: '1ST EDITION • HELD ON MAY 28, 2026',
    heroTitle: 'I São Paulo Forum on Biogas and Bioproducts',
    heroSubtitle: 'São Paulo State Biogas and Bioproducts Chain Meeting',
    heroLocation: 'Unicamp Convention Center — Auditorium 3',
    heroDate: 'Held on May 28, 2026',
    galleryBtn: 'See the photos',

    // TODO(lucas): replace with the final event figures.
    statsParticipants: '90+',
    statsParticipantsLabel: 'Participants',
    statsAxes: '8',
    statsAxesLabel: 'Research Axes',
    statsDay: '1',
    statsDayLabel: 'Day of immersion',

    aboutTag: 'ABOUT THE EVENT',
    aboutTitle: 'A meeting and discussion space for the biogas chain',
    aboutP1:
      'The I Fórum Paulista de Biogás e Bioprodutos was an initiative of CP2b, São Paulo Center for Biogas and Bioproducts Studies, in partnership with NIPE at the State University of Campinas. The event brought together researchers, students, professionals and companies to discuss advances, challenges and opportunities in the biogas and bioproducts chain in São Paulo State.',
    aboutP2:
      'The goal was to create an environment conducive to the exchange of experiences, strengthening collaboration networks and articulating academia, the productive sector and public authorities, essential elements to consolidate the biogas and bioproducts ecosystem at state and national levels.',
    aboutInfoDate: 'May 28, 2026',
    aboutInfoLocation: 'Convention Center',
    aboutInfoOrg: 'Av. Érico Veríssimo, 500 – Cidade Universitária, Barão Geraldo, Campinas - SP, 13083-851',
    aboutInfoAudience: 'Researchers, students, professionals, companies',
    aboutInfoAudienceLabel: 'Audience',

    sponsorsTag: 'SPONSORS',
    sponsorsTitle: 'Support & Sponsorship',
    apoioTag: 'SUPPORT',
    apoioLogos: [
      { name: 'ABME',               logo: '/assets/LOGO_ABME.png'             },
      { name: 'Mulheres do Biogás', logo: '/assets/LOGO_MULHERES_DO_BIOGAS.png' },
    ],

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
    programNotice: 'Programme held on May 28, 2026.',
    program: [
      { time: '09:00', title: 'Check-in' },
      { time: '09:30', title: 'Institutional Opening Session' },
      { time: '10:00', title: 'Sponsors & Partnership Formalization' },
      { time: '10:30', title: 'Table: R&D Funding Sources' },
      { time: '11:15', title: 'Table: CP2b Research Axes' },
      { time: '12:15', title: 'KI – CP2b Partnership' },
      { time: '12:30', title: 'Lawn Brunch + Thematic Posters', highlight: true },
      { time: '14:30', title: 'Panel 1: Academia-Industry Integration' },
      { time: '15:30', title: 'Panel 2: Public Policies and Regulation' },
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

    resultsTag: 'OUTCOMES',
    resultsTitle: 'What came out of the Forum',
    // TODO(lucas): replace with the real outcomes and next steps.
    results: [
      { icon: 'bi-people', title: 'Network building', text: 'TODO(lucas): describe the connections and partnerships established during the event.' },
      { icon: 'bi-lightbulb', title: 'Action points', text: 'TODO(lucas): describe the action points defined in the panels.' },
      { icon: 'bi-graph-up-arrow', title: 'Next steps', text: 'TODO(lucas): describe the next steps announced at the closing session.' },
    ],

    galleryTag: 'PHOTO COVERAGE',
    galleryTitle: 'Event photos',
    gallerySubtitle: 'Click an album to see all photos.',
    galleryEmpty: 'Event photos will be published soon.',
    galleryPhotos: 'photos',

    faqTitle: 'Frequently Asked Questions',
    faq: [
      {
        q: 'Who attended?',
        a: 'The event was open to researchers, students, professionals and companies with interest in the biogas and bioproducts chain.',
      },
      {
        q: 'Where was it held?',
        a: 'The event was held at the Unicamp Convention Center, Auditorium 3, in Campinas - SP.',
      },
      {
        q: 'Will there be a next edition?',
        a: 'TODO(lucas): confirm whether the 2nd edition has a date or forecast, and adjust this answer.',
      },
      {
        q: 'How do I access the presentations?',
        a: 'TODO(lucas): state where abstracts, posters and presentations will be available.',
      },
      {
        q: 'Where can I see the photos?',
        a: 'Photo coverage is in the photos section of this page and also in the site Gallery.',
      },
    ],
  },
};

const ForumPaulista = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.forum[language] || pageSeo.forum.pt;
  const t = content[language];
  const [albums, setAlbums] = useState([]);

  // Álbuns do Fórum na galeria. Mesmo padrão de EventDetail.jsx: a API não
  // tem endpoint por álbum, então busca tudo e filtra no cliente.
  // TODO(lucas): trocar por filtro no album_id real assim que as fotos subirem.
  useEffect(() => {
    fetchGallery().then((photos) => {
      if (!Array.isArray(photos) || photos.length === 0) return;
      const counts = photos.reduce((acc, p) => {
        if (!p.is_cover) acc[p.album_id] = (acc[p.album_id] || 0) + 1;
        return acc;
      }, {});
      const matches = photos
        .filter((p) => p.is_cover && /f[oó]rum/i.test(p.title || ''))
        .map((a) => ({ ...a, photoCount: counts[a.album_id] || 0 }));
      setAlbums(matches);
    });
  }, []);


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

                {/* Evento encerrado: a única ação que resta é rever o registro. */}
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <a href="#fotos" className="btn btn-success btn-lg px-4">
                    <i className="bi bi-images me-2" />
                    {t.galleryBtn}
                  </a>
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

      {/* ── Section 3.2: Sponsors ── */}
      <section className="py-5 bg-white">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">{t.sponsorsTitle}</h2>
            <span className="mono-label text-success">{t.sponsorsTag}</span>
          </div>

          <div className="text-center mb-5">
            <img
              src="/assets/apoio-patrocinio.png"
              alt="Patrocinadores Ouro, Prata e Bronze"
              style={{ maxWidth: '100%', width: '720px', objectFit: 'contain' }}
            />
          </div>

          <hr className="my-4" style={{ borderColor: '#e0e0e0' }} />

          {/* Seção APOIO */}
          <div className="text-center mb-4 mt-4">
            <span className="mono-label text-success">{t.apoioTag}</span>
          </div>
          <Row className="justify-content-center align-items-center g-4">
            <Col xs={8} sm={4} md="auto" className="text-center px-4">
              <img
                src={t.apoioLogos[0].logo}
                alt={t.apoioLogos[0].name}
                style={{ maxHeight: '160px', maxWidth: '320px', width: '100%', objectFit: 'contain' }}
              />
            </Col>
            <Col xs={8} sm={4} md="auto" className="text-center px-4">
              <img
                src={t.apoioLogos[1].logo}
                alt={t.apoioLogos[1].name}
                style={{ maxHeight: '80px', maxWidth: '200px', width: '100%', objectFit: 'contain' }}
              />
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

      {/* ── Section 6: Results ── */}
      <section className="py-5 bg-white">
        <Container>
          <div className="text-center section-head">
            <span className="eyebrow justify-content-center">{t.resultsTag}</span>
            <h2 className="fw-bold mt-2">{t.resultsTitle}</h2>
          </div>
          <Row className="g-4">
            {t.results.map((item, i) => (
              <Col md={4} key={i}>
                <Card className="border-0 shadow-sm rounded-4 h-100">
                  <Card.Body className="p-4">
                    <div className="bg-success bg-opacity-10 rounded-3 d-inline-flex p-3 mb-3">
                      <i className={`bi ${item.icon} text-success`} style={{ fontSize: '1.5rem' }} />
                    </div>
                    <h5 className="fw-bold mb-2">{item.title}</h5>
                    <p className="text-muted mb-0">{item.text}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── Section 6.5: Photo gallery ── */}
      <section id="fotos" className="py-5" style={{ background: 'var(--cp2b-light-gray)' }}>
        <Container>
          <div className="text-center section-head">
            <span className="eyebrow justify-content-center">{t.galleryTag}</span>
            <h2 className="fw-bold mt-2">{t.galleryTitle}</h2>
            {albums.length > 0 && <p className="text-muted">{t.gallerySubtitle}</p>}
          </div>
          {albums.length === 0 ? (
            <p className="text-center text-muted">{t.galleryEmpty}</p>
          ) : (
            <div className="album-grid">
              {albums.map((album) => (
                <Link key={album.album_id} to={`/galeria/${album.album_id}`} className="album-card text-decoration-none">
                  <img src={album.url} alt={album.title} loading="lazy" />
                  <div className="album-overlay">
                    <span className="album-title">{album.title}</span>
                    <span className="album-meta">{album.photoCount} {t.galleryPhotos}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
