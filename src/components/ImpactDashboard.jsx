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
      stats: [
        { value: 8, label: 'Eixos Temáticos', suffix: '' },
        { value: 50, label: 'Pesquisadores', suffix: '+' },
        { value: 4.5, label: 'Bi m³/ano Potencial', suffix: '' },
        { value: 8, label: 'Instituições Parceiras', suffix: '+' }
      ]
    },
    en: {
      title: 'CP2B in Numbers',
      stats: [
        { value: 8, label: 'Thematic Axes', suffix: '' },
        { value: 50, label: 'Researchers', suffix: '+' },
        { value: 4.5, label: 'Bi m³/year Potential', suffix: '' },
        { value: 8, label: 'Partner Institutions', suffix: '+' }
      ]
    }
  }[language];

  return (
    <section
      ref={ref}
      className="py-5"
      style={{ background: 'var(--cp2b-petrol-dark)' }}
    >
      <Container>
        <Row className="align-items-center">
          <Col lg={3} className="mb-4 mb-lg-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span
                className="mono-label"
                style={{ color: 'var(--cp2b-lime)', fontSize: '0.7rem' }}
              >
                {language === 'pt' ? 'IMPACTO' : 'IMPACT'}
              </span>
              <h2 className="fw-bold text-white mb-0" style={{ fontSize: '1.5rem' }}>
                {labels.title}
              </h2>
            </motion.div>
          </Col>

          <Col lg={9}>
            <Row className="g-4 text-center text-lg-start">
              {labels.stats.map((stat, index) => (
                <Col xs={6} lg={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      isInView={isInView}
                      delay={index * 100}
                    />
                    <p
                      className="mb-0 text-white-50 small mt-1"
                      style={{ lineHeight: 1.3 }}
                    >
                      {stat.label}
                    </p>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Col>
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
      const duration = 1500;
      const steps = 40;
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
      style={{ fontSize: '2rem', lineHeight: 1 }}
    >
      {isDecimal ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
};

export default ImpactDashboard;
