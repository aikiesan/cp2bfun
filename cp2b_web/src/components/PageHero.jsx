import { useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { useReducedMotion } from 'framer-motion';
import './PageHero.css';

/**
 * Editorial page header band used across inner pages.
 * Renders the petrol gradient hero with an eyebrow label, title and subtitle.
 *
 * Motion (none of it loops, so there is nothing to pause):
 * - on arrival the eyebrow rule draws itself, the title rises from behind a
 *   mask and the subtitle follows. The title stays one plain text node, as it
 *   always was: splitting it into word spans broke text lookups (tests, and
 *   potentially search and page translation);
 * - with a mouse, a soft light trails the pointer across the band and the two
 *   colour fields drift the other way, a slow parallax. Touch screens keep the
 *   resting pose.
 * Reduced motion: PageHero.css switches the arrival off entirely and the
 * pointer is not tracked at all.
 */

const PageHero = ({ eyebrow, title, subtitle, children, className }) => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return undefined;
    if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return undefined;

    let frame = 0;
    const onMove = (event) => {
      const box = el.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width;
      const y = (event.clientY - box.top) / box.height;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--hero-x', `${(x * 100).toFixed(2)}%`);
        el.style.setProperty('--hero-y', `${(y * 100).toFixed(2)}%`);
        el.style.setProperty('--hero-fx', (x - 0.5).toFixed(3));
        el.style.setProperty('--hero-fy', (y - 0.5).toFixed(3));
        el.dataset.pointer = 'on';
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      ['--hero-x', '--hero-y', '--hero-fx', '--hero-fy'].forEach((name) => el.style.removeProperty(name));
      delete el.dataset.pointer;
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [reduceMotion]);

  return (
    <div ref={ref} className={className ? `page-hero ${className}` : 'page-hero'}>
      <span className="page-hero-ambient" aria-hidden="true">
        <span className="page-hero-field page-hero-field--a" />
        <span className="page-hero-field page-hero-field--b" />
        <span className="page-hero-glow" />
      </span>
      <Container className="page-hero-inner">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {subtitle && <p className="page-hero-sub">{subtitle}</p>}
        {children}
      </Container>
    </div>
  );
};

export default PageHero;
