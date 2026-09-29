import { useLayoutEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Whether a filtered list animates its changes: the items that stay slide to
 * their new places, the ones that go fade out, the new ones rise in (see
 * listItemMotion and ListPresence).
 *
 * Same arming rule as useScrollReveal: only once the list has a layout box
 * and the visitor has not asked for reduced motion. Without layout (tests,
 * crawlers) or with reduced motion, the list renders plainly and a filter
 * change is instant, as it always was. The check has to be explicit: the
 * global reduced-motion CSS rule does not reach Framer's inline transforms.
 */
export function useListMotion(ref) {
  const reduceMotion = useReducedMotion();
  const [armed, setArmed] = useState(false);

  // Before the first paint, so arming never shows up as a flash.
  useLayoutEffect(() => {
    const el = ref.current;
    if (reduceMotion || !el) return;
    const box = el.getBoundingClientRect();
    if (box.width > 0 || box.height > 0) setArmed(true);
  }, [reduceMotion, ref]);

  return armed && !reduceMotion;
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

/**
 * Framer props for one item (or one block) of such a list; nothing at all
 * when it does not animate.
 *
 * layout="position" only: the item glides to its new place but its size is
 * never animated, which keeps a grid of a hundred cards cheap. Measuring
 * happens only when `layoutDependency` changes, so unrelated re-renders
 * (opening a profile, which also toggles the page scrollbar) never set the
 * cards moving. The entrance cascade is capped, so the last of a long list
 * never waits long.
 */
export function listItemMotion(animate, { index = 0, layoutDependency } = {}) {
  if (!animate) return {};
  return {
    layout: 'position',
    layoutDependency,
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2, ease: 'easeOut' } },
    transition: {
      duration: 0.4,
      ease: EASE_OUT_EXPO,
      delay: Math.min(index, 8) * 0.035,
      layout: { duration: 0.45, ease: EASE_OUT_EXPO },
    },
  };
}

export default useListMotion;
