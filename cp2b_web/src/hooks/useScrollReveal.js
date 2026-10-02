import { useLayoutEffect, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/**
 * State for a block that animates the first time it scrolls into view,
 * meant to go straight onto a data-reveal attribute:
 *
 *   undefined  nothing to animate: the block shows in its final state
 *   'armed'    waiting below the fold, held in its starting pose by CSS
 *   'shown'    entered the viewport; the CSS transitions run once
 *
 * A block only arms when it actually has a layout box and the visitor has not
 * asked for reduced motion. So without layout (tests, crawlers) or with
 * reduced motion, the content is simply there, never stuck hidden.
 */
export function useScrollReveal(ref, { amount = 0.3 } = {}) {
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount });
  const [armed, setArmed] = useState(false);

  // Before the first paint, so the starting pose never flashes the final one.
  useLayoutEffect(() => {
    const el = ref.current;
    if (reduceMotion || !el) return;
    const box = el.getBoundingClientRect();
    if (box.width > 0 || box.height > 0) setArmed(true);
  }, [reduceMotion, ref]);

  if (!armed) return undefined;
  return inView ? 'shown' : 'armed';
}

export default useScrollReveal;
