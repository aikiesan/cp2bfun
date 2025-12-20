import React from 'react';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const PartnerCarousel = () => {
  const { language } = useLanguage();

  const labels = {
    pt: {
      tag: 'PARCEIROS',
      title: 'Quem Apoia o CP2B',
      subtitle: 'Instituições e empresas que fazem parte da nossa rede'
    },
    en: {
      tag: 'PARTNERS',
      title: 'Who Supports CP2B',
      subtitle: 'Institutions and companies that are part of our network'
    }
  }[language];

  const partners = [
    { name: 'FAPESP', logo: '/assets/logo-fapesp.png', url: 'https://fapesp.br' },
    { name: 'UNICAMP', logo: '/assets/logo_Unicamp.png', url: 'https://unicamp.br' },
    { name: 'COMGÁS', logo: '/assets/logo-comgas.png', url: '#' },
    { name: 'SABESP', logo: '/assets/logo-sabesp.png', url: '#' },
    { name: 'COPERCANA', logo: '/assets/logo-copercana.png', url: '#' },
    { name: 'EMBRAPII', logo: '/assets/logo-embrapii.png', url: '#' },
    { name: 'USP', logo: '/assets/logo-usp.png', url: '#' },
    { name: 'UNIFAL', logo: '/assets/logo-unifal.png', url: '#' }
  ];

  // Duplicate for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-5 overflow-hidden" style={{ background: 'var(--cp2b-bg-warm)' }}>
      <Container>
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="mono-label text-petrol">{labels.tag}</span>
          <h2 className="h3 fw-bold mb-2">{labels.title}</h2>
          <p className="text-muted small">{labels.subtitle}</p>
        </motion.div>
      </Container>

      {/* Infinite Scroll Carousel */}
      <div className="position-relative">
        {/* Gradient fades */}
        <div
          className="position-absolute start-0 top-0 bottom-0"
          style={{
            width: '100px',
            background: 'linear-gradient(to right, var(--cp2b-bg-warm), transparent)',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />
        <div
          className="position-absolute end-0 top-0 bottom-0"
          style={{
            width: '100px',
            background: 'linear-gradient(to left, var(--cp2b-bg-warm), transparent)',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />

        {/* Scrolling container */}
        <motion.div
          className="d-flex align-items-center gap-5 py-4"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 30,
              ease: 'linear'
            }
          }}
          style={{ width: 'fit-content' }}
        >
          {duplicatedPartners.map((partner, index) => (
            <a
              key={`${partner.name}-${index}`}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex align-items-center justify-content-center"
              style={{
                minWidth: '150px',
                height: '60px',
                opacity: 0.6,
                transition: 'opacity 0.3s ease',
                filter: 'grayscale(100%)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.filter = 'grayscale(0%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.6';
                e.currentTarget.style.filter = 'grayscale(100%)';
              }}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                style={{
                  maxHeight: '50px',
                  maxWidth: '140px',
                  objectFit: 'contain',
                  borderRadius: 0
                }}
                onError={(e) => {
                  // Fallback to text if image fails
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<span class="fw-bold text-muted">${partner.name}</span>`;
                }}
              />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnerCarousel;
