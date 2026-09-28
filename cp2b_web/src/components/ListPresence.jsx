import { AnimatePresence } from 'framer-motion';
import './ListPresence.css';

/**
 * The presence boundary of a filtered list (see hooks/useListMotion).
 *
 * Animating, it is AnimatePresence in "popLayout" mode: a leaving item is
 * lifted out of the flow at once, so the rest slide into place while it fades
 * where it stood. The element that holds the items needs the `list-motion`
 * class (ListPresence.css) for the lifted item to stay put.
 *
 * Not animating, the items render as they always did and a removed one leaves
 * the DOM in the same update.
 */
const ListPresence = ({ animate, children }) =>
  animate ? (
    <AnimatePresence mode="popLayout" initial={false}>
      {children}
    </AnimatePresence>
  ) : (
    <>{children}</>
  );

export default ListPresence;
