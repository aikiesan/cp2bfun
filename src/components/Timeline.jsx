import React from 'react';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Timeline = () => {
  const { language } = useLanguage();

  const labels = {
    pt: {
      tag: 'TRAJETÓRIA',
      title: 'Nossa Jornada',
      subtitle: 'Marcos importantes do CP2B desde sua concepção'
    },
    en: {
      tag: 'TRAJECTORY',
      title: 'Our Journey',
      subtitle: 'Important milestones of CP2B since its conception'
    }
  }[language];

  const milestones = {
    pt: [
      {
        year: '2021',
        title: 'Submissão do Projeto',
        description: 'Proposta submetida à FAPESP no programa CCD - Centros de Ciências para o Desenvolvimento',
        status: 'completed',
        icon: '📝'
      },
      {
        year: '2024',
        title: 'Aprovação FAPESP',
        description: 'Projeto aprovado com processo nº 2024/01112-1',
        status: 'completed',
        icon: '✅'
      },
      {
        year: '2025',
        title: 'Início das Atividades',
        description: 'Lançamento oficial do centro e início dos trabalhos nos 8 eixos temáticos',
        status: 'completed',
        icon: '🚀'
      },
      {
        year: '2025',
        title: 'I Workshop Anual',
        description: 'Primeiro workshop reunindo pesquisadores e assinatura do Regimento Interno',
        status: 'completed',
        icon: '🎯'
      },
      {
        year: '2026',
        title: 'Fórum de Biogás',
        description: 'Fórum Paulista de Biogás e Bioprodutos - Maio/2026',
        status: 'upcoming',
        icon: '🎪'
      },
      {
        year: '2030',
        title: 'Conclusão do Projeto',
        description: 'Encerramento do ciclo de 60 meses com resultados consolidados',
        status: 'future',
        icon: '🏆'
      }
    ],
    en: [
      {
        year: '2021',
        title: 'Project Submission',
        description: 'Proposal submitted to FAPESP under the CCD - Science Centers for Development program',
        status: 'completed',
        icon: '📝'
      },
      {
        year: '2024',
        title: 'FAPESP Approval',
        description: 'Project approved with process nº 2024/01112-1',
        status: 'completed',
        icon: '✅'
      },
      {
        year: '2025',
        title: 'Activities Begin',
        description: 'Official launch of the center and start of work on the 8 thematic axes',
        status: 'completed',
        icon: '🚀'
      },
      {
        year: '2025',
        title: 'I Annual Workshop',
        description: 'First workshop bringing together researchers and signing of Internal Regulations',
        status: 'completed',
        icon: '🎯'
      },
      {
        year: '2026',
        title: 'Biogas Forum',
        description: 'São Paulo Biogas and Bioproducts Forum - May/2026',
        status: 'upcoming',
        icon: '🎪'
      },
      {
        year: '2030',
        title: 'Project Completion',
        description: 'End of the 60-month cycle with consolidated results',
        status: 'future',
        icon: '🏆'
      }
    ]
  }[language];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'var(--cp2b-green)';
      case 'upcoming': return 'var(--cp2b-orange)';
      case 'future': return 'var(--cp2b-petrol)';
      default: return 'var(--cp2b-border)';
    }
  };

  return (
    <section className="py-5 bg-warm">
      <Container>
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="mono-label text-petrol">{labels.tag}</span>
          <h2 className="display-6 fw-bold mb-2">{labels.title}</h2>
          <p className="text-muted">{labels.subtitle}</p>
        </motion.div>

        {/* Timeline */}
        <div className="position-relative">
          {/* Center line - desktop only */}
          <div
            className="d-none d-lg-block position-absolute start-50 translate-middle-x"
            style={{
              width: '2px',
              height: '100%',
              background: 'var(--cp2b-border)',
              top: 0
            }}
          />

          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              className={`d-flex mb-4 ${index % 2 === 0 ? 'flex-lg-row' : 'flex-lg-row-reverse'}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Content */}
              <div className="flex-grow-1 px-lg-4" style={{ maxWidth: '450px' }}>
                <div
                  className="bg-white p-4 position-relative"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    borderLeft: `3px solid ${getStatusColor(milestone.status)}`,
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span style={{ fontSize: '1.25rem' }}>{milestone.icon}</span>
                    <span
                      className="mono-label"
                      style={{ color: getStatusColor(milestone.status) }}
                    >
                      {milestone.year}
                    </span>
                    {milestone.status === 'upcoming' && (
                      <span
                        className="badge rounded-pill ms-auto"
                        style={{
                          background: 'var(--cp2b-orange-tint)',
                          color: 'var(--cp2b-orange)',
                          fontSize: '0.65rem'
                        }}
                      >
                        {language === 'pt' ? 'EM BREVE' : 'UPCOMING'}
                      </span>
                    )}
                  </div>
                  <h5 className="fw-bold mb-2" style={{ fontSize: '1rem' }}>
                    {milestone.title}
                  </h5>
                  <p className="text-muted mb-0 small" style={{ lineHeight: 1.6 }}>
                    {milestone.description}
                  </p>
                </div>
              </div>

              {/* Center dot - desktop only */}
              <div
                className="d-none d-lg-flex align-items-center justify-content-center position-relative"
                style={{ width: '40px', flexShrink: 0 }}
              >
                <div
                  className="rounded-circle"
                  style={{
                    width: '16px',
                    height: '16px',
                    background: getStatusColor(milestone.status),
                    border: '3px solid var(--cp2b-bg)',
                    zIndex: 1
                  }}
                />
              </div>

              {/* Spacer for alternating layout */}
              <div className="d-none d-lg-block flex-grow-1" style={{ maxWidth: '450px' }} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Timeline;
