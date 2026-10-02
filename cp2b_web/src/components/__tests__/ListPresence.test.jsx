import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { motion } from 'framer-motion';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ListPresence from '../ListPresence';

const here = path.dirname(fileURLToPath(import.meta.url));
const css = fs.readFileSync(path.resolve(here, '../ListPresence.css'), 'utf8');

const List = ({ items, animate = true, resetKey }) => (
  <ul className="list-motion">
    <ListPresence animate={animate} resetKey={resetKey}>
      {items.map((id) => (
        <motion.li
          key={id}
          className="item"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          {id}
        </motion.li>
      ))}
    </ListPresence>
  </ul>
);

describe('ListPresence', () => {
  it('marks an item on its way out, keeping its own classes, and lets it go once the fade is over', async () => {
    const { rerender } = render(<List items={['a', 'b']} />);
    const b = screen.getByText('b');
    expect(b).toHaveClass('item');
    expect(b).not.toHaveClass('is-leaving');

    rerender(<List items={['a']} />);
    expect(b).toHaveClass('item', 'is-leaving');
    expect(screen.getByText('a')).not.toHaveClass('is-leaving');
    await waitFor(() => expect(b).not.toBeInTheDocument());
  });

  it('unmarks an item that comes back before its fade is over', () => {
    const { rerender } = render(<List items={['a', 'b']} />);
    const b = screen.getByText('b');

    rerender(<List items={['a']} />);
    expect(b).toHaveClass('is-leaving');
    rerender(<List items={['a', 'b']} />);
    // The same element, back in the row, with nothing left of the way out.
    expect(screen.getByText('b')).toBe(b);
    expect(b).not.toHaveClass('is-leaving');
  });

  it('starts over at rest when resetKey changes, instead of animating the difference', () => {
    const { rerender } = render(<List items={['a']} resetKey="static" />);
    rerender(<List items={['a', 'b']} resetKey="static" />);
    // Same source: the new item rises in.
    expect(screen.getByText('b').style.opacity).toBe('0');

    rerender(<List items={['a', 'c']} resetKey="api" />);
    // New source: everything is simply there, and what went is gone at once.
    expect(screen.getByText('c').style.opacity).toBe('1');
    expect(screen.getByText('a').style.opacity).toBe('1');
    expect(screen.queryByText('b')).not.toBeInTheDocument();
  });

  it('renders the items as they are when not animating', () => {
    const { rerender } = render(<List items={['a', 'b']} animate={false} />);
    rerender(<List items={['a']} animate={false} />);
    expect(screen.queryByText('b')).not.toBeInTheDocument();
    expect(screen.getByText('a')).toHaveAttribute('class', 'item');
  });

  it('lifts the gutter off the marked item, not off an internal Framer attribute', () => {
    expect(css).toMatch(/\.list-motion > \.is-leaving\s*\{\s*margin-top:\s*0 !important;/);
    expect(css).not.toMatch(/\[data-motion-pop-id\]/);
  });
});
