import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';
import PageHero from '../components/PageHero';
import { fetchBoletins } from '../services/api';

const Boletins = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.boletins?.[language] || pageSeo.boletins?.pt || { title: 'Boletins', description: '' };

  const [boletins, setBoletins] = useState([]);
  const [loading, setLoading] = useState(true);

  const labels = {
    pt: {
      tag: 'BOLETINS',
      title: 'Boletins CP2b',
      description: 'Edições do boletim do CP2b, disponíveis para leitura e download em PDF.',
      empty: 'Nenhum boletim publicado no momento.',
      edition: 'Edição',
      download: 'Baixar PDF',
      coverAlt: 'Capa do boletim',
    },
    en: {
      tag: 'BULLETINS',
      title: 'CP2b Bulletins',
      description: 'Issues of the CP2b bulletin, available to read and download as PDF.',
      empty: 'No bulletins published at the moment.',
      edition: 'Issue',
      download: 'Download PDF',
      coverAlt: 'Bulletin cover',
    },
  }[language] || {
    tag: 'BOLETINS',
    title: 'Boletins CP2b',
    description: '',
    empty: 'Nenhum boletim publicado no momento.',
    edition: 'Edição',
    download: 'Baixar PDF',
    coverAlt: 'Capa do boletim',
  };

  useEffect(() => {
    fetchBoletins()
      .then((data) => setBoletins(data || []))
      .finally(() => setLoading(false));
  }, []);

  const getTitle = (b) => (language === 'pt' ? b.title_pt : b.title_en || b.title_pt);
  const getDescription = (b) =>
    language === 'pt' ? b.description_pt : b.description_en || b.description_pt;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    // Só mês e ano: o boletim é uma série periódica, o dia exato não informa nada.
    //
    // timeZone UTC é obrigatório aqui: published_at é uma DATE (dia civil), mas
    // a API a devolve como instante em Z ("2026-03-01T00:00:00.000Z"). Formatada
    // no fuso local do visitante (UTC-3 no Brasil), uma edição do dia 1º recuaria
    // para o mês anterior — março virava fevereiro.
    return new Date(dateStr).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    });
  };

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <PageHero eyebrow={labels.tag} title={labels.title} subtitle={labels.description} />
        <Container className="py-4 py-md-5">
          {loading ? (
            <div className="text-center py-4 py-md-5">
              <Spinner animation="border" variant="success" />
            </div>
          ) : boletins.length === 0 ? (
            <Row className="justify-content-center">
              <Col lg={7} className="text-center text-muted py-4 py-md-5">
                <i className="bi bi-journal-text" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                <p className="mt-3">{labels.empty}</p>
              </Col>
            </Row>
          ) : (
            <Row className="g-3 g-md-4">
              {boletins.map((b, idx) => {
                const title = getTitle(b);
                const date = formatDate(b.published_at);
                return (
                  <Col key={b.id} xs={12} sm={6} lg={4} xl={3}>
                    <motion.div
                      className="h-100"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <Card className="border-0 shadow-sm h-100">
                        {/* A capa é o que identifica a edição, então ela lidera o card.
                            Sem capa cadastrada, um marcador neutro mantém a altura
                            uniforme e a grade alinhada. */}
                        {b.cover_image ? (
                          <Card.Img
                            variant="top"
                            src={b.cover_image}
                            alt={`${labels.coverAlt}: ${title}`}
                            loading="lazy"
                            style={{ aspectRatio: '3 / 4', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            className="d-flex align-items-center justify-content-center bg-light text-muted"
                            style={{ aspectRatio: '3 / 4' }}
                            aria-hidden="true"
                          >
                            <i className="bi bi-journal-text" style={{ fontSize: '2.5rem', opacity: 0.3 }}></i>
                          </div>
                        )}

                        <Card.Body className="d-flex flex-column p-3">
                          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                            {b.edition_number && (
                              <Badge bg="success">
                                {labels.edition} {b.edition_number}
                              </Badge>
                            )}
                            {date && <span className="text-muted small">{date}</span>}
                          </div>

                          <h6 className="fw-bold mb-2">{title}</h6>

                          {getDescription(b) && (
                            <p className="text-muted small mb-3">{getDescription(b)}</p>
                          )}

                          {/* mt-auto mantém o botão rente à base, para que os cards
                              da linha terminem alinhados mesmo com títulos de
                              alturas diferentes. */}
                          <a
                            href={b.pdf_url}
                            className="btn btn-outline-success btn-sm mt-auto"
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <i className="bi bi-download me-2"></i>
                            {labels.download}
                          </a>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                );
              })}
            </Row>
          )}
        </Container>
      </motion.div>
    </>
  );
};

export default Boletins;
