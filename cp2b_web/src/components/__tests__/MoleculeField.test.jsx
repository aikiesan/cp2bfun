import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import MoleculeField from '../MoleculeField';

afterEach(cleanup);

describe('MoleculeField', () => {
  it('renders a decorative canvas that is hidden from assistive tech', () => {
    const { container } = render(<MoleculeField />);

    const canvas = container.querySelector('canvas.molecule-field');
    expect(canvas).not.toBeNull();
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
  });

  it('degrades quietly when the browser gives no 2D context', () => {
    // jsdom already returns null here, which is exactly the case a browser
    // with canvas disabled hits. The field is decoration, so the page must
    // render without it rather than throw.
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    expect(() => render(<MoleculeField />)).not.toThrow();

    getContext.mockRestore();
  });

  it('paints nothing and starts no animation loop without a context', () => {
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const raf = vi.spyOn(window, 'requestAnimationFrame');

    render(<MoleculeField />);

    expect(raf).not.toHaveBeenCalled();

    raf.mockRestore();
    getContext.mockRestore();
  });
});
