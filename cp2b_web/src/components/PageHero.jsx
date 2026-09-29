import { useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { useReducedMotion } from 'framer-motion';
import './PageHero.css';

/**
 * Editorial page header band used across inner pages.
 * A strip of kraft paper with a torn lower edge, like the paper stations of
 * the educa CP2b videos: an eyebrow tag held by masking tape, the title,
 * the subtitle and, when the page gives one, a real photo taped on as a
 * print. A few paper bits (leaves and dots in the brand colours) lie on it.
 *
 * Motion (none of it loops, so there is nothing to pause):
 * - on arrival the tag is pressed on, the title rises from behind a mask,
 *   the subtitle follows and the print drops onto the band. The title stays
 *   one plain text node, as it always was: splitting it into word spans
 *   broke text lookups (tests, and potentially search and page translation);
 * - with a mouse, the paper bits drift against the pointer at different
 *   depths and the print tilts a little towards it. Touch screens keep the
 *   resting pose.
 * Reduced motion: PageHero.css switches the arrival off entirely and the
 * pointer is not tracked at all.
 */

// Where the paper bits lie on the band (% of its box), how far each one
// drifts with the pointer (px, negative = against it) and its resting angle.
const PAPER_BITS = [
  { x: 5, y: 26, kind: 'leaf-lima', depth: 18, angle: -24 },
  { x: 13, y: 80, kind: 'dot-ambar', depth: -12, angle: 0 },
  { x: 31, y: 12, kind: 'dot-verde', depth: 10, angle: 0 },
  { x: 45, y: 88, kind: 'leaf-verde', depth: -20, angle: 38 },
  { x: 56, y: 9, kind: 'dot-lima', depth: 14, angle: 0 },
  { x: 64, y: 74, kind: 'dot-petrol', depth: -8, angle: 0 },
  { x: 77, y: 90, kind: 'leaf-lima', depth: 22, angle: 12 },
  { x: 94, y: 16, kind: 'dot-ambar', depth: -16, angle: 0 },
];

const PageHero = ({ eyebrow, title, subtitle, photo, children, className }) => {
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
        el.style.setProperty('--hero-fx', (x - 0.5).toFixed(3));
        el.style.setProperty('--hero-fy', (y - 0.5).toFixed(3));
        el.dataset.pointer = 'on';
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      ['--hero-fx', '--hero-fy'].forEach((name) => el.style.removeProperty(name));
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

  const classes = ['page-hero', photo && 'page-hero--photo', className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes}>
      <span className="page-hero-ambient" aria-hidden="true">
        {PAPER_BITS.map((bit, i) => (
          <span
            key={i}
            className={`page-hero-bit page-hero-bit--${bit.kind}`}
            style={{ '--x': `${bit.x}%`, '--y': `${bit.y}%`, '--depth': bit.depth, '--angle': `${bit.angle}deg`, '--i': i }}
          />
        ))}
      </span>
      {/* The print is decoration: the page says the same in words, so it is
          hidden from assistive tech and carries an empty alt. */}
      {photo && (
        <span className="page-hero-photo" aria-hidden="true">
          <img
            src={photo.src}
            alt=""
            width={photo.width}
            height={photo.height}
            decoding="async"
            style={photo.position ? { objectPosition: photo.position } : undefined}
          />
        </span>
      )}
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
