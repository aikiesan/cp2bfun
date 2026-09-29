import { Children, cloneElement, forwardRef, isValidElement } from 'react';
import { AnimatePresence, useIsPresent } from 'framer-motion';
import './ListPresence.css';

/**
 * The presence boundary of a filtered list (see hooks/useListMotion).
 *
 * Animating, it is AnimatePresence in "popLayout" mode: a leaving item is
 * lifted out of the flow at once, so the rest slide into place while it fades
 * where it stood. The element that holds the items needs the `list-motion`
 * class (ListPresence.css) for the lifted item to stay put.
 *
 * Each item goes through LeavingMark, which gives it the `is-leaving` class
 * while it is on its way out (ListPresence.css uses it) and takes it off again
 * if the item comes back before its fade is over.
 *
 * `resetKey` starts the boundary over when it changes, for a change of data
 * source rather than of filter (Team: the static list, then the API's): the
 * new list arrives at rest, like the first one, instead of animating the
 * difference between the two.
 *
 * Not animating, the items render as they always did and a removed one leaves
 * the DOM in the same update.
 */

// The ref comes from AnimatePresence (popLayout measures the leaving item
// through it) and goes on to the item's own element. The class goes on in the
// same commit in which the item is measured: the measurement runs before the
// DOM changes, so it still sees the item where it stood. (The item has no ref
// of its own: this one would take its place.)
const LeavingMark = forwardRef(function LeavingMark({ children }, ref) {
  const isPresent = useIsPresent();
  const className = [children.props.className, isPresent ? null : 'is-leaving'].filter(Boolean).join(' ');
  return cloneElement(children, { ref, className: className || undefined });
});

const ListPresence = ({ animate, resetKey, children }) =>
  animate ? (
    <AnimatePresence key={resetKey} mode="popLayout" initial={false}>
      {Children.map(children, (child) =>
        isValidElement(child) ? <LeavingMark key={child.key}>{child}</LeavingMark> : child
      )}
    </AnimatePresence>
  ) : (
    <>{children}</>
  );

export default ListPresence;
