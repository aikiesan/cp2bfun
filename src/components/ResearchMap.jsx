import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { FaMapMarkerAlt, FaUniversity, FaIndustry, FaFlask } from 'react-icons/fa';

const ResearchMap = () => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredLocation, setHoveredLocation] = useState(null);

  const labels = {
    pt: {
      tag: 'REDE DE PARCEIROS',
      title: 'Mapa de Atuação',
      subtitle: 'Instituições e parceiros que fazem parte da rede CP2B',
      all: 'Todos',
      headquarters: 'Sede',
      research: 'Pesquisa',
      companies: 'Empresas',
      public: 'Governo'
    },
    en: {
      tag: 'PARTNER NETWORK',
      title: 'Action Map',
      subtitle: 'Institutions and partners that are part of the CP2B network',
      all: 'All',
      headquarters: 'Headquarters',
      research: 'Research',
      companies: 'Companies',
      public: 'Government'
    }
  }[language];

  const locations = [
    {
      id: 1,
      name: 'NIPE/UNICAMP',
      city: 'Campinas, SP',
      category: 'headquarters',
      description: language === 'pt' ? 'Sede do CP2B - Núcleo Interdisciplinar de Planejamento Energético' : 'CP2B Headquarters - Interdisciplinary Center for Energy Planning',
      x: 58, y: 72
    },
    {
      id: 2,
      name: 'UNIFAL',
      city: 'Alfenas, MG',
      category: 'research',
      description: language === 'pt' ? 'Universidade Federal de Alfenas' : 'Federal University of Alfenas',
      x: 52, y: 58
    },
    {
      id: 3,
      name: 'EP/USP',
      city: 'São Paulo, SP',
      category: 'research',
      description: language === 'pt' ? 'Escola Politécnica da USP' : 'USP Polytechnic School',
      x: 62, y: 75
    },
    {
      id: 4,
      name: 'COMGÁS',
      city: 'São Paulo, SP',
      category: 'companies',
      description: language === 'pt' ? 'Companhia de Gás de São Paulo' : 'São Paulo Gas Company',
      x: 64, y: 73
    },
    {
      id: 5,
      name: 'SABESP',
      city: 'São Paulo, SP',
      category: 'companies',
      description: language === 'pt' ? 'Companhia de Saneamento Básico do Estado de São Paulo' : 'São Paulo State Basic Sanitation Company',
      x: 60, y: 77
    },
    {
      id: 6,
      name: 'COPERCANA',
      city: 'Sertãozinho, SP',
      category: 'companies',
      description: language === 'pt' ? 'Cooperativa dos Plantadores de Cana' : 'Sugarcane Planters Cooperative',
      x: 48, y: 62
    },
    {
      id: 7,
      name: 'SAASP',
      city: 'São Paulo, SP',
      category: 'public',
      description: language === 'pt' ? 'Secretaria de Agricultura e Abastecimento' : 'Agriculture and Supply Secretary',
      x: 66, y: 71
    },
    {
      id: 8,
      name: 'IAC',
      city: 'Campinas, SP',
      category: 'research',
      description: language === 'pt' ? 'Instituto Agronômico de Campinas' : 'Campinas Agronomic Institute',
      x: 56, y: 70
    }
  ];

  const categories = [
    { id: 'all', label: labels.all, icon: FaMapMarkerAlt, color: 'var(--cp2b-petrol)' },
    { id: 'headquarters', label: labels.headquarters, icon: FaUniversity, color: 'var(--cp2b-orange)' },
    { id: 'research', label: labels.research, icon: FaFlask, color: 'var(--cp2b-green)' },
    { id: 'companies', label: labels.companies, icon: FaIndustry, color: 'var(--cp2b-petrol)' },
    { id: 'public', label: labels.public, icon: FaMapMarkerAlt, color: 'var(--cp2b-forest)' }
  ];

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'var(--cp2b-petrol)';
  };

  const filteredLocations = activeCategory === 'all'
    ? locations
    : locations.filter(loc => loc.category === activeCategory);

  return (
    <section className="py-5">
      <Container>
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="mono-label text-green">{labels.tag}</span>
          <h2 className="display-6 fw-bold mb-2">{labels.title}</h2>
          <p className="text-muted">{labels.subtitle}</p>
        </motion.div>

        {/* Category Filters */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`btn btn-sm d-flex align-items-center gap-2 rounded-pill px-3 py-2 ${
                  activeCategory === cat.id ? 'text-white' : ''
                }`}
                style={{
                  background: activeCategory === cat.id ? cat.color : 'var(--cp2b-bg)',
                  border: `1px solid ${activeCategory === cat.id ? cat.color : 'var(--cp2b-border)'}`,
                  color: activeCategory === cat.id ? 'white' : 'var(--cp2b-text)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>

        <Row className="g-4">
          {/* Map Visualization */}
          <Col lg={7}>
            <motion.div
              className="position-relative bg-white p-4"
              style={{
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-sm)',
                minHeight: '400px'
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {/* São Paulo State simplified outline */}
              <svg
                viewBox="0 0 100 100"
                className="w-100"
                style={{ maxHeight: '400px' }}
              >
                {/* SP State shape (simplified) */}
                <path
                  d="M20,30 L35,25 L55,20 L75,25 L85,35 L90,50 L85,70 L75,85 L55,90 L35,85 L20,75 L15,55 L20,30"
                  fill="var(--cp2b-green-tint)"
                  stroke="var(--cp2b-green)"
                  strokeWidth="0.5"
                />

                {/* Location markers */}
                <AnimatePresence>
                  {filteredLocations.map((loc) => (
                    <motion.g
                      key={loc.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onMouseEnter={() => setHoveredLocation(loc)}
                      onMouseLeave={() => setHoveredLocation(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle
                        cx={loc.x}
                        cy={loc.y}
                        r={hoveredLocation?.id === loc.id ? 4 : 3}
                        fill={getCategoryColor(loc.category)}
                        stroke="white"
                        strokeWidth="1"
                      />
                      {loc.category === 'headquarters' && (
                        <circle
                          cx={loc.x}
                          cy={loc.y}
                          r="6"
                          fill="none"
                          stroke={getCategoryColor(loc.category)}
                          strokeWidth="0.5"
                          opacity="0.5"
                        />
                      )}
                    </motion.g>
                  ))}
                </AnimatePresence>

                {/* Legend */}
                <text x="5" y="95" fontSize="3" fill="var(--cp2b-text-light)">
                  Estado de São Paulo
                </text>
              </svg>

              {/* Hover tooltip */}
              <AnimatePresence>
                {hoveredLocation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="position-absolute bg-white p-3 shadow-lg"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      left: '50%',
                      bottom: '20px',
                      transform: 'translateX(-50%)',
                      minWidth: '250px',
                      borderLeft: `3px solid ${getCategoryColor(hoveredLocation.category)}`,
                      zIndex: 10
                    }}
                  >
                    <h6 className="fw-bold mb-1" style={{ fontSize: '0.9rem' }}>
                      {hoveredLocation.name}
                    </h6>
                    <p className="text-muted small mb-1">{hoveredLocation.city}</p>
                    <p className="mb-0 small" style={{ color: 'var(--cp2b-text-light)' }}>
                      {hoveredLocation.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Col>

          {/* Locations List */}
          <Col lg={5}>
            <div
              className="overflow-auto pe-2"
              style={{ maxHeight: '450px' }}
            >
              <AnimatePresence mode="popLayout">
                {filteredLocations.map((loc, index) => (
                  <motion.div
                    key={loc.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      className="mb-2 border-0"
                      style={{
                        borderLeft: `3px solid ${getCategoryColor(loc.category)}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        background: hoveredLocation?.id === loc.id ? 'var(--cp2b-bg-warm)' : 'var(--cp2b-white)'
                      }}
                      onMouseEnter={() => setHoveredLocation(loc)}
                      onMouseLeave={() => setHoveredLocation(null)}
                    >
                      <Card.Body className="py-3 px-3">
                        <div className="d-flex align-items-start gap-3">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{
                              width: '36px',
                              height: '36px',
                              background: `${getCategoryColor(loc.category)}15`,
                              color: getCategoryColor(loc.category)
                            }}
                          >
                            <FaMapMarkerAlt size={14} />
                          </div>
                          <div className="flex-grow-1 min-w-0">
                            <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>
                              {loc.name}
                            </h6>
                            <p className="text-muted small mb-0">{loc.city}</p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ResearchMap;
