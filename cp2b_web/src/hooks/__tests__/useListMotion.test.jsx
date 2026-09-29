import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useRef } from 'react';

const motion = vi.hoisted(() => ({ reduce: false }));
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useReducedMotion: () => motion.reduce };
});

import useListMotion, { listItemMotion } from '../useListMotion';

const Probe = () => {
  const ref = useRef(null);
  const animate = useListMotion(ref);
  return <div ref={ref} data-testid="list">{animate ? 'animates' : 'plain'}</div>;
};

const giveLayout = () =>
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    top: 0, bottom: 40, left: 0, right: 600, width: 600, height: 40, x: 0, y: 0,
  });

beforeEach(() => {
  motion.reduce = false;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useListMotion', () => {
  it('stays plain without a layout box (tests, crawlers)', () => {
    render(<Probe />);
    expect(screen.getByTestId('list')).toHaveTextContent('plain');
  });

  it('animates once the list has a layout box', () => {
    giveLayout();
    render(<Probe />);
    expect(screen.getByTestId('list')).toHaveTextContent('animates');
  });

  it('stays plain under reduced motion, layout or not', () => {
    motion.reduce = true;
    giveLayout();
    render(<Probe />);
    expect(screen.getByTestId('list')).toHaveTextContent('plain');
  });
});

describe('listItemMotion', () => {
  it('gives nothing to a list that does not animate', () => {
    expect(listItemMotion(false, { index: 3 })).toEqual({});
  });

  it('moves position only, never size, and caps the entrance cascade', () => {
    const first = listItemMotion(true, { index: 0, layoutDependency: 'a' });
    const far = listItemMotion(true, { index: 90, layoutDependency: 'a' });
    expect(first.layout).toBe('position');
    expect(first.layoutDependency).toBe('a');
    expect(first.transition.delay).toBe(0);
    expect(far.transition.delay).toBe(listItemMotion(true, { index: 8 }).transition.delay);
    // The glide itself never waits for the cascade.
    expect(far.transition.layout.delay).toBeUndefined();
  });
});
