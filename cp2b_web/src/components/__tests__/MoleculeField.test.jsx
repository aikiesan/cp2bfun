import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MoleculeField from '../MoleculeField';

afterEach(cleanup);

// The component reads its route via useLocation to pick a density, so every
// render needs a Router ancestor — exactly like it gets in the real app,
// where it is mounted once in App.jsx's layout.
const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <MoleculeField />
    </MemoryRouter>
  );

describe('MoleculeField', () => {
  it('renders a decorative canvas that is hidden from assistive tech', () => {
    const { container } = renderAt('/');

    const canvas = container.querySelector('canvas.molecule-field');
    expect(canvas).not.toBeNull();
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
  });

  it('degrades quietly when the browser gives no 2D context', () => {
    // jsdom already returns null here, which is exactly the case a browser
    // with canvas disabled hits. The field is decoration, so the page must
    // render without it rather than throw.
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    expect(() => renderAt('/')).not.toThrow();

    getContext.mockRestore();
  });

  it('paints nothing and starts no animation loop without a context', () => {
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const raf = vi.spyOn(window, 'requestAnimationFrame');

    renderAt('/');

    expect(raf).not.toHaveBeenCalled();

    raf.mockRestore();
    getContext.mockRestore();
  });

  it('renders the same decorative canvas on a non-Home route, at lower density', () => {
    // Density itself lives inside the animation loop and isn't observable
    // from the DOM, but the component must still mount cleanly off Home —
    // that's the whole point of moving it into the shared layout.
    const { container } = renderAt('/equipe');

    expect(container.querySelector('canvas.molecule-field')).not.toBeNull();
  });
});
