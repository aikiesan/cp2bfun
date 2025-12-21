import React from 'react';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Timeline = () => {
  const { language } = useLanguage();

  const labels = {
    pt: {
      tag: 'TRAJETÓRIA',
      title: 'Nossa Jornada'
    },
    en: {
      tag: 'TRAJECTORY',
      title: 'Our Journey'
    }
  }[language];

  const milestones = {
    pt: [
      { year: '2021', title: 'Submissão', status: 'completed' },
      { year: '2024', title: 'Aprovação', status: 'completed' },
      { year: '2025', title: 'Lançamento', status: 'completed' },
      { year: '2026', title: 'Fórum', status: 'upcoming' },
      { year: '2030', title: 'Conclusão', status: 'future' }
    ],
    en: [
      { year: '2021', title: 'Submission', status: 'completed' },
      { year: '2024', title: 'Approval', status: 'completed' },
      { year: '2025', title: 'Launch', status: 'completed' },
      { year: '2026', title: 'Forum', status: 'upcoming' },
      { year: '2030', title: 'Completion', status: 'future' }
    ]
  }[language];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'var(--cp2b-green)';
      case 'upcoming': return 'var(--cp2b-orange)';
      case 'future': return 'var(--cp2b-petrol-light)';
      default: return 'var(--cp2b-border)';
    }
  };

  return (
    <section className="py-5">
      <Container>
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="mono-label text-petrol">{labels.tag}</span>
          <h2 className="fw-bold mb-0">{labels.title}</h2>
        </motion.div>

        {/* Horizontal Timeline */}
        <motion.div
          className="position-relative py-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Connecting line */}
          <div
            className="position-absolute"
            style={{
              top: '50%',
              left: '5%',
              right: '5%',
              height: '2px',
              background: 'var(--cp2b-border)',
              transform: 'translateY(-50%)'
            }}
          />

          {/* Milestones */}
          <div className="d-flex justify-content-between align-items-center position-relative" style={{ padding: '0 5%' }}>
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                style={{ zIndex: 1 }}
              >
                {/* Year */}
                <div
                  className="fw-bold mb-2"
                  style={{
                    color: getStatusColor(milestone.status),
                    fontSize: '0.85rem'
                  }}
                >
                  {milestone.year}
                </div>

                {/* Dot */}
                <div
                  className="rounded-circle mx-auto mb-2"
                  style={{
                    width: milestone.status === 'completed' ? '14px' : '12px',
                    height: milestone.status === 'completed' ? '14px' : '12px',
                    background: milestone.status === 'completed' ? getStatusColor(milestone.status) : 'var(--cp2b-white)',
                    border: `2px solid ${getStatusColor(milestone.status)}`,
                    boxShadow: '0 0 0 4px var(--cp2b-bg)'
                  }}
                />

                {/* Title */}
                <div
                  className="small fw-medium"
                  style={{
                    color: milestone.status === 'completed' ? 'var(--cp2b-dark)' : 'var(--cp2b-text-light)',
                    maxWidth: '80px'
                  }}
                >
                  {milestone.title}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default Timeline;
