import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TimelineEntry = ({ item, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="cp2b-timeline-entry position-relative">
      {/* Connector dot */}
      <div
        className="cp2b-timeline-dot"
        style={{ top: '2rem', background: item.status === 'completed' ? '#6c757d' : 'var(--cp2b-petrol)' }}
      />

      {/* Card — alternates left/right on desktop */}
      <div className={`row ${isLeft ? 'justify-content-start' : 'justify-content-end'}`}>
        <div className="col-12 col-md-5">
          <motion.div
            initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            className={`cp2b-timeline-card ${isLeft ? 'me-md-4' : 'ms-md-4'}`}
          >
            <div className="d-flex align-items-center gap-2 mb-3">
              <span
                className="badge rounded-pill px-3 py-2 fs-6"
                style={{ background: 'var(--cp2b-petrol)', fontWeight: 700, letterSpacing: '0.05em' }}
              >
                {item.year}
              </span>
              <i className={`bi ${item.icon} fs-5`} style={{ color: 'var(--cp2b-petrol)' }} />
            </div>

            <h5 className="fw-bold mb-2" style={{ color: 'var(--cp2b-petrol)' }}>{item.title}</h5>
            <p className="text-muted small mb-3">{item.description}</p>

            <span
              className={`badge rounded-pill px-3 py-1 ${item.status === 'ongoing' ? 'text-success' : 'text-secondary'}`}
              style={{
                background: item.status === 'ongoing' ? 'rgba(25,135,84,0.12)' : 'rgba(108,117,125,0.12)',
                fontWeight: 600
              }}
            >
              {item.status === 'ongoing' ? 'Em andamento' : 'Concluído'}
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Timeline = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="cp2b-timeline">
      {items.map((item, index) => (
        <TimelineEntry key={index} item={item} index={index} />
      ))}
    </div>
  );
};

export default Timeline;
