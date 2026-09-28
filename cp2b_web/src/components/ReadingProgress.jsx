import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import './ReadingProgress.css';

/**
 * A thin bar pinned to the top of the window that fills as the reader goes
 * through `target` (a ref to the article): empty when the article's top meets
 * the top of the window, full when its end meets the bottom.
 *
 * It renders into <body> because main#main-content is its own stacking
 * context (z-index 1, below the navbar's), so from inside the page the bar
 * could never sit above the fixed menu.
 *
 * Decorative, so it stays out of the accessibility tree. With reduced motion
 * it still follows the scroll, since the reader is the one moving it, but it
 * tracks the position directly instead of gliding after it on a spring.
 */
const SPRING = { stiffness: 260, damping: 40, restDelta: 0.001 };

const ReadingProgress = ({ target }) => {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] });
  const smoothProgress = useSpring(scrollYProgress, SPRING);
  const [trackable, setTrackable] = useState(false);

  // An article no taller than the window makes the two offsets cross, and the
  // progress would then run backwards (full at the top, emptying on the way
  // down). There is nothing to track in that case, so the bar stays hidden.
  // Re-checked when the article grows (photos loading) or the window resizes.
  useEffect(() => {
    const el = target.current;
    if (!el) return undefined;
    const check = () => {
      setTrackable(el.getBoundingClientRect().height > document.documentElement.clientHeight);
    };
    check();
    window.addEventListener('resize', check);
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(check) : null;
    observer?.observe(el);
    return () => {
      window.removeEventListener('resize', check);
      observer?.disconnect();
    };
  }, [target]);

  return createPortal(
    <motion.div
      className="reading-progress"
      aria-hidden="true"
      data-idle={trackable ? undefined : ''}
      style={{ scaleX: reduceMotion ? scrollYProgress : smoothProgress }}
    />,
    document.body,
  );
};

export default ReadingProgress;
