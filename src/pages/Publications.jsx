import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaExternalLinkAlt, FaDownload, FaBook, FaFileAlt, FaNewspaper } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { menuLabels } from '../data/content';

const Publications = () => {
  const { language } = useLanguage();
  const t = menuLabels[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeYear, setActiveYear] = useState('all');

  const labels = {
    pt: {
      tag: 'PRODUÇÃO CIENTÍFICA',
      title: 'Publicações',
      subtitle: 'Artigos, livros e capítulos produzidos pelos pesquisadores do CP2B',
      searchPlaceholder: 'Buscar por título, autor ou palavra-chave...',
      filterAll: 'Todos',
      filterArticles: 'Artigos',
      filterBooks: 'Livros',
      filterChapters: 'Capítulos',
      filterTheses: 'Teses',
      year: 'Ano',
      allYears: 'Todos os anos',
      viewMore: 'Ver detalhes',
      download: 'Baixar PDF',
      comingSoon: 'Novas publicações em breve',
      comingSoonDesc: 'Estamos atualizando nossa base de publicações. Em breve você encontrará aqui todos os artigos, livros e trabalhos produzidos pela equipe do CP2B.',
      stats: {
        articles: 'Artigos',
        books: 'Livros',
        theses: 'Teses'
      }
    },
    en: {
      tag: 'SCIENTIFIC PRODUCTION',
      title: 'Publications',
      subtitle: 'Articles, books, and chapters produced by CP2B researchers',
      searchPlaceholder: 'Search by title, author, or keyword...',
      filterAll: 'All',
      filterArticles: 'Articles',
      filterBooks: 'Books',
      filterChapters: 'Chapters',
      filterTheses: 'Theses',
      year: 'Year',
      allYears: 'All years',
      viewMore: 'View details',
      download: 'Download PDF',
      comingSoon: 'New publications coming soon',
      comingSoonDesc: 'We are updating our publication database. Soon you will find here all articles, books, and works produced by the CP2B team.',
      stats: {
        articles: 'Articles',
        books: 'Books',
        theses: 'Theses'
      }
    }
  }[language];

  // Sample publications data structure (to be populated later)
  const publications = [
    // {
    //   id: 1,
    //   type: 'article',
    //   title: 'Example Publication Title',
    //   authors: ['Author 1', 'Author 2'],
    //   journal: 'Journal Name',
    //   year: 2025,
    //   doi: '10.1234/example',
    //   abstract: 'Abstract text here...',
    //   keywords: ['biogas', 'sustainable'],
    //   axis: 2
    // }
  ];

  const filters = [
    { id: 'all', label: labels.filterAll, icon: null },
    { id: 'article', label: labels.filterArticles, icon: FaNewspaper },
    { id: 'book', label: labels.filterBooks, icon: FaBook },
    { id: 'chapter', label: labels.filterChapters, icon: FaFileAlt },
    { id: 'thesis', label: labels.filterTheses, icon: FaFileAlt }
  ];

  const years = ['all', 2025, 2026, 2027, 2028, 2029, 2030];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Filter publications
  const filteredPublications = publications.filter(pub => {
    const matchesSearch = searchQuery === '' ||
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pub.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = activeFilter === 'all' || pub.type === activeFilter;
    const matchesYear = activeYear === 'all' || pub.year === parseInt(activeYear);

    return matchesSearch && matchesType && matchesYear;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'article': return FaNewspaper;
      case 'book': return FaBook;
      case 'chapter':
      case 'thesis':
      default: return FaFileAlt;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'article': return 'var(--cp2b-petrol)';
      case 'book': return 'var(--cp2b-green)';
      case 'chapter': return 'var(--cp2b-forest)';
      case 'thesis': return 'var(--cp2b-orange)';
      default: return 'var(--cp2b-text-light)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Container className="py-5">
        {/* Page Header */}
        <Row className="mb-5 page-header">
          <Col lg={8}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <span className="mono-label text-petrol">{labels.tag}</span>
              <h1 className="display-5 fw-bold mb-4">{labels.title}</h1>
              <p className="lead">{labels.subtitle}</p>
            </motion.div>
          </Col>
        </Row>

        {/* Stats Overview */}
        <motion.div
          className="mb-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Row className="g-3">
            {[
              { label: labels.stats.articles, value: publications.filter(p => p.type === 'article').length, color: 'petrol', icon: FaNewspaper },
              { label: labels.stats.books, value: publications.filter(p => p.type === 'book').length, color: 'green', icon: FaBook },
              { label: labels.stats.theses, value: publications.filter(p => p.type === 'thesis').length, color: 'orange', icon: FaFileAlt }
            ].map((stat, index) => (
              <Col md={4} key={index}>
                <Card className="border-0 h-100" style={{ borderLeft: `3px solid var(--cp2b-${stat.color})` }}>
                  <Card.Body className="d-flex align-items-center gap-3 py-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: '45px',
                        height: '45px',
                        background: `var(--cp2b-${stat.color}-tint)`,
                        color: `var(--cp2b-${stat.color})`
                      }}
                    >
                      <stat.icon size={18} />
                    </div>
                    <div>
                      <div className="fw-bold h4 mb-0">{stat.value}</div>
                      <small className="text-muted">{stat.label}</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Row className="g-3 align-items-end">
            {/* Search */}
            <Col lg={5}>
              <div className="position-relative">
                <FaSearch
                  className="position-absolute text-muted"
                  style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <Form.Control
                  type="text"
                  placeholder={labels.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-5"
                />
              </div>
            </Col>

            {/* Type Filter */}
            <Col lg={5}>
              <div className="d-flex flex-wrap gap-2">
                {filters.map(filter => (
                  <Button
                    key={filter.id}
                    variant={activeFilter === filter.id ? 'primary' : 'outline-secondary'}
                    size="sm"
                    className="rounded-pill d-flex align-items-center gap-2"
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.icon && <filter.icon size={12} />}
                    {filter.label}
                  </Button>
                ))}
              </div>
            </Col>

            {/* Year Filter */}
            <Col lg={2}>
              <Form.Select
                value={activeYear}
                onChange={(e) => setActiveYear(e.target.value)}
                size="sm"
              >
                <option value="all">{labels.allYears}</option>
                {years.slice(1).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </motion.div>

        {/* Publications List */}
        {filteredPublications.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {filteredPublications.map((pub, index) => {
              const TypeIcon = getTypeIcon(pub.type);
              return (
                <motion.div
                  key={pub.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-20px" }}
                  variants={fadeInUp}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="border-0" style={{ borderLeft: `3px solid ${getTypeColor(pub.type)}` }}>
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-start gap-3">
                        <div
                          className="rounded d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: '40px',
                            height: '40px',
                            background: `${getTypeColor(pub.type)}15`,
                            color: getTypeColor(pub.type)
                          }}
                        >
                          <TypeIcon size={18} />
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                            <Badge
                              bg="none"
                              style={{
                                background: `${getTypeColor(pub.type)}20`,
                                color: getTypeColor(pub.type)
                              }}
                            >
                              {pub.type}
                            </Badge>
                            <span className="text-muted small">{pub.year}</span>
                            {pub.axis && (
                              <Badge bg="light" text="dark" className="border">
                                {language === 'pt' ? 'Eixo' : 'Axis'} {pub.axis}
                              </Badge>
                            )}
                          </div>
                          <h5 className="fw-bold mb-2">{pub.title}</h5>
                          <p className="text-muted small mb-2">
                            {pub.authors.join(', ')}
                          </p>
                          {pub.journal && (
                            <p className="small fst-italic text-muted mb-3">{pub.journal}</p>
                          )}
                          <div className="d-flex flex-wrap gap-2">
                            {pub.doi && (
                              <a
                                href={`https://doi.org/${pub.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center gap-2"
                              >
                                <FaExternalLinkAlt size={10} />
                                DOI
                              </a>
                            )}
                            {pub.pdf && (
                              <a
                                href={pub.pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-secondary rounded-pill d-flex align-items-center gap-2"
                              >
                                <FaDownload size={10} />
                                PDF
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            className="text-center py-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
              style={{
                width: '80px',
                height: '80px',
                background: 'var(--cp2b-petrol-tint)'
              }}
            >
              <FaBook size={30} style={{ color: 'var(--cp2b-petrol)' }} />
            </div>
            <h4 className="fw-bold mb-2">{labels.comingSoon}</h4>
            <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>
              {labels.comingSoonDesc}
            </p>
          </motion.div>
        )}
      </Container>
    </motion.div>
  );
};

export default Publications;
