import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const ImpactDashboard = () => {
  const { language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const labels = {
    pt: {
      title: 'CP2B em Números',
      subtitle: 'Impacto e alcance do nosso centro de pesquisa',
      stats: [
        { value: 8, label: 'Eixos Temáticos', suffix: '', icon: '🔬' },
        { value: 50, label: 'Pesquisadores Ativos', suffix: '+', icon: '👨‍🔬' },
        { value: 4.5, label: 'Bilhões m³/ano de Potencial', suffix: '', icon: '⚡' },
        { value: 17, label: 'ODS Impactados', suffix: '', icon: '🌍' },
        { value: 8, label: 'Instituições Parceiras', suffix: '+', icon: '🤝' },
        { value: 60, label: 'Meses de Projeto', suffix: '', icon: '📅' }
      ]
    },
    en: {
      title: 'CP2B in Numbers',
      subtitle: 'Impact and reach of our research center',
      stats: [
        { value: 8, label: 'Thematic Axes', suffix: '', icon: '🔬' },
        { value: 50, label: 'Active Researchers', suffix: '+', icon: '👨‍🔬' },
        { value: 4.5, label: 'Billion m³/year Potential', suffix: '', icon: '⚡' },
        { value: 17, label: 'SDGs Impacted', suffix: '', icon: '🌍' },
        { value: 8, label: 'Partner Institutions', suffix: '+', icon: '🤝' },
        { value: 60, label: 'Months of Project', suffix: '', icon: '📅' }
      ]
    }
  }[language];

  return (
    <section
      ref={ref}
      className="py-5 position-relative overflow-hidden"
      style={{ background: 'var(--cp2b-petrol-dark)' }}
    >
      {/* Background Pattern */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          pointerEvents: 'none'
        }}
      />

      <Container className="position-relative">
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span
            className="mono-label d-inline-block px-3 py-1 rounded-pill mb-3"
            style={{ background: 'rgba(164, 198, 57, 0.2)', color: 'var(--cp2b-lime)' }}
          >
            {language === 'pt' ? 'IMPACTO' : 'IMPACT'}
          </span>
          <h2 className="display-6 fw-bold text-white mb-2">{labels.title}</h2>
          <p className="text-white-50">{labels.subtitle}</p>
        </motion.div>

        <Row className="g-4 justify-content-center">
          {labels.stats.map((stat, index) => (
            <Col xs={6} md={4} lg={2} key={index}>
              <motion.div
                className="text-center p-3 h-100"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'rgba(255,255,255,0.1)',
                    fontSize: '1.5rem'
                  }}
                >
                  {stat.icon}
                </div>
                <div className="mb-2">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    isInView={isInView}
                    delay={index * 100}
                  />
                </div>
                <p
                  className="mb-0 text-white-50 small"
                  style={{ lineHeight: 1.3 }}
                >
                  {stat.label}
                </p>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

// Animated counter component
const AnimatedCounter = ({ value, suffix, isInView, delay }) => {
  const [count, setCount] = useState(0);
  const isDecimal = value % 1 !== 0;

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, value, delay]);

  return (
    <span
      className="fw-bold text-white"
      style={{ fontSize: '2.5rem', lineHeight: 1 }}
    >
      {isDecimal ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
};

export default ImpactDashboard;
