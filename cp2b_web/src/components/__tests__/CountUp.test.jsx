import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';

// jsdom has no layout and no scrolling, so "in view" and the OS motion
// setting are driven from here.
const motion = vi.hoisted(() => ({ inView: false, reduce: false }));
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useInView: () => motion.inView,
    useReducedMotion: () => motion.reduce,
  };
});

import CountUp from '../CountUp';

const number = (container) => container.querySelector('.count-up');

// Give the number a layout box, which is what arms the count.
const giveLayout = () =>
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    top: 0, bottom: 40, left: 0, right: 60, width: 60, height: 40, x: 0, y: 0,
  });

beforeEach(() => {
  motion.inView = false;
  motion.reduce = false;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CountUp', () => {
  it('renders the real value when there is no layout (tests, crawlers)', () => {
    const { container } = render(<CountUp value={38} />);
    expect(number(container)).toHaveTextContent('38');
  });

  it('starts at 0 with a layout box and counts to the value once in view', async () => {
    giveLayout();
    const { container, rerender } = render(<CountUp value={25} duration={0.05} />);
    expect(number(container)).toHaveTextContent('0');

    motion.inView = true;
    rerender(<CountUp value={25} duration={0.05} />);
    await waitFor(() => expect(number(container)).toHaveTextContent('25'));
  });

  it('never counts under reduced motion', () => {
    motion.reduce = true;
    giveLayout();
    const { container } = render(<CountUp value={7} />);
    expect(number(container)).toHaveTextContent('7');
  });

  it('follows a new value when it has nothing to animate', () => {
    const { container, rerender } = render(<CountUp value={5} />);
    rerender(<CountUp value={9} />);
    expect(number(container)).toHaveTextContent('9');
  });
});
