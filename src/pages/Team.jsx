import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { teamMembers, menuLabels } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

const Team = () => {
  const { language } = useLanguage();
  const t = menuLabels[language];

  const labels = {
    pt: {
      title: 'Quem Faz o CP2B',
      subtitle: 'Uma rede multidisciplinar de pesquisadores e especialistas dedicados ao desenvolvimento de soluções em biogás e bioprodutos.'
    },
    en: {
      title: 'Our Team',
      subtitle: 'A multidisciplinary network of researchers and experts dedicated to the development of biogas and bioproduct solutions.'
    }
  }[language];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Color mapping for different categories
  const categoryColors = {
    coordinators: 'var(--cp2b-orange)',
    principals: 'var(--cp2b-petrol)',
    associates: 'var(--cp2b-green)',
    support: 'var(--cp2b-forest)',
    students: 'var(--cp2b-lime)'
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
              <span className="mono-label text-petrol">{t.team}</span>
              <h1 className="display-5 fw-bold mb-4">{labels.title}</h1>
              <p className="lead">{labels.subtitle}</p>
            </motion.div>
          </Col>
        </Row>

        {/* Team Sections */}
        {teamMembers.map((group, gIdx) => (
          <motion.section
            key={group.category}
            className="mb-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            variants={fadeInUp}
            transition={{ duration: 0.4, delay: gIdx * 0.05 }}
          >
            {/* Section Header */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <span
                className="d-inline-block"
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: categoryColors[group.category] || 'var(--cp2b-petrol)'
                }}
              />
              <h3 className="mb-0 fw-bold" style={{ fontSize: '1.1rem', letterSpacing: '0.02em' }}>
                {group[language]}
              </h3>
              <span className="text-muted small">({group.members.length})</span>
            </div>

            {/* Members Grid */}
            <Row className="g-3">
              {group.members.map((member, idx) => (
                <Col sm={6} lg={4} xl={3} key={idx}>
                  <Card
                    className="h-100 border-0"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      borderLeft: `3px solid ${categoryColors[group.category] || 'var(--cp2b-petrol)'}`
                    }}
                  >
                    <Card.Body className="p-3">
                      <h6 className="fw-bold mb-1" style={{ fontSize: '0.9rem', color: 'var(--cp2b-dark)' }}>
                        {member.name}
                      </h6>
                      <p
                        className="small mb-2 fw-semibold text-uppercase"
                        style={{
                          fontSize: '0.7rem',
                          color: categoryColors[group.category] || 'var(--cp2b-petrol)',
                          letterSpacing: '0.03em'
                        }}
                      >
                        {member.role}
                      </p>
                      {member.institution && member.institution !== '-' && (
                        <p
                          className="text-muted small mb-0 fst-italic"
                          style={{ fontSize: '0.8rem' }}
                        >
                          {member.institution}
                        </p>
                      )}

                      {/* Contact Info */}
                      {(member.email || member.phone) && (
                        <div
                          className="mt-3 pt-2 border-top d-flex flex-column gap-1"
                          style={{ fontSize: '0.75rem' }}
                        >
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="text-decoration-none text-muted d-flex align-items-center gap-2"
                              style={{ fontFamily: 'var(--font-mono)' }}
                            >
                              <FaEnvelope size={10} style={{ color: 'var(--cp2b-petrol)' }} />
                              <span className="text-truncate">{member.email}</span>
                            </a>
                          )}
                          {member.phone && (
                            <a
                              href={`tel:${member.phone.replace(/\s/g, '')}`}
                              className="text-decoration-none text-muted d-flex align-items-center gap-2"
                              style={{ fontFamily: 'var(--font-mono)' }}
                            >
                              <FaPhone size={10} style={{ color: 'var(--cp2b-green)' }} />
                              <span>{member.phone}</span>
                            </a>
                          )}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </motion.section>
        ))}
      </Container>
    </motion.div>
  );
};

export default Team;
