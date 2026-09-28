import { useState, useEffect, useMemo, useRef } from 'react';
import { Container, Row, Col, Card, Form, Spinner, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { useLocation } from 'react-router-dom';
import { publications as staticPublications, pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';
import PageHero from '../components/PageHero';
import { PublicationsSummary, PublicationsAnalysis } from '../components/PublicationsSummary';
import WordCloud from '../components/WordCloud';
import ListPresence from '../components/ListPresence';
import { safeHref } from '../utils/safeUrl';
import { useUrlChoice, useUrlText } from '../hooks/useUrlFilters';
import useListMotion, { listItemMotion } from '../hooks/useListMotion';

// Filtros no link, para compartilhar a busca: ?ano=&tipo=&busca=. Valor fora
// do esperado é ignorado e o filtro volta a "Todos". O ano só precisa ter
// cara de ano: quais anos existem, só a resposta da API diz.
const isYearParam = (value) => /^\d{4}$/.test(value);
// Os mesmos tipos do seletor abaixo (typeLabels), que são os que o backend aceita.
const PUBLICATION_TYPES = ['article', 'book', 'chapter', 'thesis', 'conference'];
const isTypeParam = (value) => PUBLICATION_TYPES.includes(value);

const groupPublicationsByYear = (pubsList) => {
  return pubsList.reduce((acc, pub) => {
    const year = pub.year || 'Unknown';
    if (!acc[year]) acc[year] = [];
    acc[year].push(pub);
    return acc;
  }, {});
};

const filterStaticPubs = (pubs, f) => {
  return (pubs || []).filter(pub => {
    if (f.year !== 'all' && String(pub.year) !== String(f.year)) return false;
    if (f.type !== 'all' && pub.publication_type !== f.type) return false;
    if (f.search) {
      const q = f.search.toLowerCase();
      const matchTitle = (pub.title_pt && pub.title_pt.toLowerCase().includes(q)) || (pub.title_en && pub.title_en.toLowerCase().includes(q));
      const matchAuthors = pub.authors && pub.authors.toLowerCase().includes(q);
      const matchJournal = pub.journal && pub.journal.toLowerCase().includes(q);
      if (!matchTitle && !matchAuthors && !matchJournal) return false;
    }
    return true;
  });
};

const Publications = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.publications[language] || pageSeo.publications.pt;
  const [publications, setPublications] = useState([]);
  const [groupedByYear, setGroupedByYear] = useState({});
  const [loading, setLoading] = useState(true);
  // Já chegou alguma resposta. Daí em diante a lista anterior fica na tela
  // enquanto a próxima carrega, em vez de dar lugar ao spinner: é o que
  // permite aos itens deslizarem de uma lista para a outra.
  const [loaded, setLoaded] = useState(false);
  // Só depois que a pessoa mexe num filtro a contagem é anunciada.
  const [announce, setAnnounce] = useState(false);
  const [selectedYear, setSelectedYear] = useUrlChoice('ano', { fallback: 'all', isValid: isYearParam });
  const [selectedType, setSelectedType] = useUrlChoice('tipo', { fallback: 'all', isValid: isTypeParam });
  const [searchText, setSearchText] = useUrlText('busca');
  // O eixo segue sem controle na página: fica em "Todos", como sempre.
  const filters = useMemo(
    () => ({ year: selectedYear, type: selectedType, axis: 'all', search: searchText }),
    [selectedYear, selectedType, searchText]
  );

  useEffect(() => {
    // Uma resposta atrasada de um filtro anterior não sobrescreve a atual.
    let current = true;

    const fetchPublications = async () => {
      setLoading(true);
      let data;
      try {
        const params = new URLSearchParams();
        if (filters.year !== 'all') params.append('year', filters.year);
        if (filters.type !== 'all') params.append('type', filters.type);
        if (filters.axis !== 'all') params.append('axis', filters.axis);
        if (filters.search) params.append('search', filters.search);

        const response = await api.get(`/publications?${params}`);
        data = response?.data !== undefined ? response.data : filterStaticPubs(staticPublications, filters);
      } catch {
        // Fallback to static publications when API is unreachable
        data = filterStaticPubs(staticPublications, filters);
      }
      if (!current) return;
      setPublications(data);
      setGroupedByYear(groupPublicationsByYear(data));
      setLoading(false);
      setLoaded(true);
    };

    fetchPublications();
    return () => {
      current = false;
    };
  }, [filters]);

  // Ao filtrar, os blocos por ano e as publicações deslizam para o novo lugar
  // e as que saem somem aos poucos (hooks/useListMotion). Cada resposta nova
  // é o que dispara a medição.
  const listRef = useRef(null);
  const animateList = useListMotion(listRef);

  const typeLabels = {
    article: language === 'pt' ? 'Artigo' : 'Article',
    book: language === 'pt' ? 'Livro' : 'Book',
    chapter: language === 'pt' ? 'Capítulo' : 'Chapter',
    thesis: language === 'pt' ? 'Tese' : 'Thesis',
    conference: language === 'pt' ? 'Conferência' : 'Conference'
  };

  const sortedYears = Object.keys(groupedByYear).sort((a, b) => b - a);

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
    <PageHero
      className="page-hero--overlap"
      eyebrow={language === 'pt' ? 'Produção Científica' : 'Scientific Output'}
      title={language === 'pt' ? 'Publicações' : 'Publications'}
      subtitle={language === 'pt'
        ? 'Artigos, relatórios e estudos técnicos produzidos pela rede de pesquisa do CP2b.'
        : 'Articles, reports and technical studies produced by the CP2b research network.'}
    />
    <Container className="pb-4 pb-md-5">
      {/* Síntese do Ano 1 (painel sobre o hero), a análise completa recolhida
          e a nuvem de palavras. */}
      <PublicationsSummary language={language} />
      <PublicationsAnalysis language={language} />
      <WordCloud language={language} />

      <h2 className="publications-list-title">{language === 'pt' ? 'Todas as publicações' : 'All publications'}</h2>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group controlId="pub-filter-year">
                <Form.Label>{language === 'pt' ? 'Ano' : 'Year'}</Form.Label>
                <Form.Select
                  value={filters.year}
                  onChange={(e) => {
                    setAnnounce(true);
                    setSelectedYear(e.target.value);
                  }}
                >
                  <option value="all">{language === 'pt' ? 'Todos' : 'All'}</option>
                  {sortedYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="pub-filter-type">
                <Form.Label>{language === 'pt' ? 'Tipo' : 'Type'}</Form.Label>
                <Form.Select
                  value={filters.type}
                  onChange={(e) => {
                    setAnnounce(true);
                    setSelectedType(e.target.value);
                  }}
                >
                  <option value="all">{language === 'pt' ? 'Todos' : 'All'}</option>
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>{language === 'pt' ? 'Buscar' : 'Search'}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={language === 'pt' ? 'Título, autores, revista...' : 'Title, authors, journal...'}
                  value={filters.search}
                  onChange={(e) => {
                    setAnnounce(true);
                    setSearchText(e.target.value);
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Carregando: só a lista espera — o topo da página continua na tela
          enquanto os filtros buscam. Na primeira carga não há lista ainda, e
          o spinner ocupa o lugar dela; nas seguintes a lista atual fica até a
          nova chegar. */}
      {loading && !loaded && (
        <div className="py-5 text-center" role="status" aria-live="polite">
          <Spinner animation="border" />
        </div>
      )}

      {/* Quantas publicações o filtro deixou, para o leitor de tela: a lista
          muda longe do campo em foco. */}
      <p className="visually-hidden" aria-live="polite">
        {announce && loaded && !loading
          ? language === 'pt'
            ? `${publications.length} ${publications.length === 1 ? 'publicação' : 'publicações'}`
            : `${publications.length} ${publications.length === 1 ? 'publication' : 'publications'}`
          : ''}
      </p>

      {/* Publications grouped by year */}
      <div ref={listRef} className="list-motion" aria-busy={loading && loaded ? 'true' : undefined}>
        {/* Só existe depois da primeira resposta: a lista chega como sempre
            chegou, e o movimento fica para as trocas de filtro. */}
        {loaded && (
          <ListPresence animate={animateList}>
            {sortedYears.map((year, yearIndex) => (
              <motion.div
                key={year}
                className="mb-4 mb-md-5 list-motion"
                {...listItemMotion(animateList, { index: yearIndex, layoutDependency: publications })}
              >
                <h2 className="mb-3">{year}</h2>
                <ListPresence animate={animateList}>
                  {groupedByYear[year].map((pub, index) => {
                    const title = language === 'pt' ? pub.title_pt : (pub.title_en || pub.title_pt);
                    const abstract = language === 'pt' ? pub.abstract_pt : (pub.abstract_en || pub.abstract_pt);

                    return (
                      // O cartão tem transição e hover próprios (index.css): o
                      // movimento vai num invólucro, para um não brigar com o outro.
                      <motion.div
                        key={pub.id}
                        {...listItemMotion(animateList, { index, layoutDependency: publications })}
                      >
                        <Card className="mb-3">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                              <h3 className="h5 mb-1 mobile-compact-title publication-title">{title}</h3>
                              <Badge bg="secondary" className="flex-shrink-0">{typeLabels[pub.publication_type]}</Badge>
                            </div>
                            <p className="text-muted mb-2"><strong>{pub.authors}</strong></p>
                            {pub.journal && (
                              <p className="text-muted mb-2">
                                <em>{pub.journal}</em>, {pub.year}
                              </p>
                            )}
                            {abstract && <p className="mb-2 publication-abstract">{abstract}</p>}
                            <div className="d-flex gap-2">
                              {pub.doi && (
                                <a
                                  href={`https://doi.org/${pub.doi}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  DOI
                                </a>
                              )}
                              {pub.url && (
                                <a
                                  href={safeHref(pub.url)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  {language === 'pt' ? 'Link' : 'Link'}
                                </a>
                              )}
                              {pub.pdf_url && (
                                <a
                                  href={safeHref(pub.pdf_url)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-danger"
                                >
                                  PDF
                                </a>
                              )}
                            </div>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    );
                  })}
                </ListPresence>
              </motion.div>
            ))}

            {publications.length === 0 && (
              <motion.p
                key="empty"
                className="text-center text-muted"
                {...listItemMotion(animateList, { layoutDependency: publications })}
              >
                {language === 'pt' ? 'Nenhuma publicação encontrada' : 'No publications found'}
              </motion.p>
            )}
          </ListPresence>
        )}
      </div>
    </Container>
    </motion.div>
    </>
  );
};

export default Publications;
