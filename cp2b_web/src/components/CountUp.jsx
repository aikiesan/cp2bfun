import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/**
 * A whole number that counts up from zero (or from `from`) the first time it
 * scrolls into view, easing out as it lands on the real value.
 *
 * The real value is what renders first. The count only arms, dropping to
 * `from` before the first paint, when the number has a layout box and reduced
 * motion is off, so tests, crawlers and reduced-motion visitors always get
 * the figure itself. A new `value` counts again (remount with a new key to
 * replay the same one).
 *
 * `from` is for a number that sits in fixed text: "Faltam N dias" is only
 * right from 2 up, so that count starts at 2 and never reads "Faltam 0 dias"
 * or "Faltam 1 dias" on its way.
 */
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const CountUp = ({ value, from = 0, duration = 1.4, delay = 0, className }) => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [armed, setArmed] = useState(false);
  const [display, setDisplay] = useState(from);

  useLayoutEffect(() => {
    const el = ref.current;
    if (reduceMotion || !el) return;
    const box = el.getBoundingClientRect();
    if (box.width > 0 || box.height > 0) setArmed(true);
  }, [reduceMotion]);

  useEffect(() => {
    if (!armed || !inView) return undefined;
    const controls = animate(from, value, {
      duration,
      delay,
      ease: EASE_OUT_EXPO,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [armed, inView, value, from, duration, delay]);

  return (
    <span ref={ref} className={className ? `count-up ${className}` : 'count-up'}>
      {armed ? display : value}
    </span>
  );
};

export default CountUp;
