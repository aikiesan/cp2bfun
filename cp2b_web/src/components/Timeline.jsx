import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TimelineEntry = ({ item, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="cp2b-timeline-card"
    >
      <div className="cp2b-timeline-card__head">
        <span
          className="cp2b-timeline-card__icon"
          style={{ background: item.status === 'completed' ? 'var(--gray-500)' : 'var(--cp2b-petrol)' }}
        >
          <i className={`bi ${item.icon}`} />
        </span>
        <span className="badge rounded-pill px-3 py-1" style={{ background: 'var(--cp2b-petrol)', fontWeight: 700, letterSpacing: '0.05em' }}>
          {item.year}
        </span>
      </div>

      <h6 className="fw-bold mt-3 mb-2" style={{ color: 'var(--cp2b-petrol)' }}>{item.title}</h6>
      <p className="text-muted small mb-3">{item.description}</p>
      <span
        className={`badge rounded-pill px-3 py-1 ${item.status === 'ongoing' ? 'text-success' : 'text-secondary'}`}
        style={{
          background: item.status === 'ongoing' ? 'color-mix(in srgb, var(--color-success) 12%, transparent)' : 'color-mix(in srgb, var(--gray-500) 12%, transparent)',
          fontWeight: 600
        }}
      >
        {item.status === 'ongoing' ? 'Em andamento' : 'Concluído'}
      </span>
    </motion.div>
  );
};

const Timeline = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="cp2b-timeline-grid">
      {items.map((item, index) => (
        <TimelineEntry key={index} item={item} index={index} />
      ))}
    </div>
  );
};

export default Timeline;
