import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, screen, within } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// jsdom has no layout and no scrolling, so "in view" and the OS motion
// setting are driven from here. Mocking useInView also keeps Framer's own
// observers out of the list the tests below inspect.
const motion = vi.hoisted(() => ({ inView: false, reduce: false }));
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useInView: () => motion.inView,
    useReducedMotion: () => motion.reduce,
  };
});

import { renderWithProviders } from '../../test/utils';
import WasteToEnergy from '../WasteToEnergy';
import { researchAxes, wasteToEnergyFlow } from '../../data/content';
import { stripAxisPrefix } from '../../utils/teamGroups';

const copy = wasteToEnergyFlow.pt;
const axisNames = Object.fromEntries(researchAxes.pt.map((axis) => [axis.id, stripAxisPrefix(axis.title)]));

const here = path.dirname(fileURLToPath(import.meta.url));
const css = fs.readFileSync(path.resolve(here, '../WasteToEnergy.css'), 'utf8');

// An IntersectionObserver the test can fire by hand, standing in for the
// step that crosses the middle of the viewport.
let observers = [];
const OriginalObserver = window.IntersectionObserver;

class ControllableObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.targets = [];
    observers.push(this);
  }
  observe(target) { this.targets.push(target); }
  unobserve() {}
  disconnect() { this.targets = []; }
}

const cross = (target) =>
  act(() => {
    observers.forEach((o) => {
      if (o.targets.includes(target)) o.callback([{ isIntersecting: true, target }]);
    });
  });

// Give every element a layout box, which is what arms the arrival.
const giveLayout = () =>
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    top: 0, bottom: 400, left: 0, right: 600, width: 600, height: 400, x: 0, y: 0,
  });

const renderFlow = () => renderWithProviders(<WasteToEnergy copy={copy} axisNames={axisNames} />);

beforeEach(() => {
  motion.inView = false;
  motion.reduce = false;
  observers = [];
  window.IntersectionObserver = ControllableObserver;
});

afterEach(() => {
  window.IntersectionObserver = OriginalObserver;
  vi.restoreAllMocks();
});

describe('WasteToEnergy', () => {
  it('lists the five steps in order, each with its title and text', () => {
    renderFlow();

    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual(copy.steps.map((step) => step.title));
    copy.steps.forEach((step) => expect(screen.getByText(step.text)).toBeInTheDocument());
  });

  it('keeps the section title as one plain text node', () => {
    renderFlow();
    const heading = screen.getByRole('heading', { level: 2 });
    expect(screen.getByText(copy.title)).toBe(heading);
    expect(heading.children).toHaveLength(0);
  });

  it('links every axis of a step to that axis in the details, named without the "Eixo N –" prefix', () => {
    const { container } = renderFlow();
    const lastStep = container.querySelectorAll('.w2e-step')[4];

    const chips = within(lastStep).getAllByRole('link');
    expect(chips).toHaveLength(copy.steps[4].axes.length);
    chips.forEach((chip, i) => {
      expect(chip).toHaveAttribute('href', `/eixos?eixo=${copy.steps[4].axes[i]}#explorar-eixos`);
    });
    expect(chips[0]).toHaveTextContent(`Eixo 4 ${axisNames[4]}`);
    expect(chips[0].textContent).not.toMatch(/–/);
  });

  it('opens on the first step and follows the step crossing the middle of the viewport', () => {
    const { container } = renderFlow();
    const steps = container.querySelectorAll('.w2e-step');
    const stageNum = () => container.querySelector('.w2e-stage-num').textContent;
    const activeArt = () => container.querySelector('.w2e-stage-art.is-active').getAttribute('src');
    const progress = () => container.querySelector('.w2e-rail').style.getPropertyValue('--w2e-progress');

    expect(steps[0]).toHaveClass('is-active');
    expect(stageNum()).toBe('01');
    expect(progress()).toBe('0');

    cross(steps[2]);

    expect(steps[2]).toHaveClass('is-active');
    expect(steps[0]).not.toHaveClass('is-active');
    expect(stageNum()).toBe('03');
    expect(activeArt()).toBe(copy.steps[2].image);
    expect(progress()).toBe('0.5');
    expect(container.querySelectorAll('.w2e-rail-nodes li.is-reached')).toHaveLength(3);
  });

  it('watches a thin band across the middle of the viewport', () => {
    renderFlow();

    expect(observers).toHaveLength(1);
    expect(observers[0].options.rootMargin).toBe('-45% 0px -45% 0px');
    expect(observers[0].targets).toHaveLength(copy.steps.length);
  });

  it('moves the stage to the step a keyboard user tabs into', () => {
    const { container } = renderFlow();
    const steps = container.querySelectorAll('.w2e-step');

    fireEvent.focus(within(steps[3]).getAllByRole('link')[0]);

    expect(steps[3]).toHaveClass('is-active');
    expect(container.querySelector('.w2e-stage-num').textContent).toBe('04');
  });

  it('keeps the pinned stage out of the accessibility tree', () => {
    const { container } = renderFlow();

    expect(container.querySelector('.w2e-stage')).toHaveAttribute('aria-hidden', 'true');
    container.querySelectorAll('img').forEach((img) => expect(img).toHaveAttribute('alt', ''));
  });

  describe('arrival', () => {
    it('shows everything as is without layout (tests, crawlers)', () => {
      const { container } = renderFlow();
      expect(container.querySelector('.w2e-head')).not.toHaveAttribute('data-reveal');
      expect(container.querySelector('.w2e-stage')).not.toHaveAttribute('data-reveal');
    });

    it('holds the heading and the stage below the fold, then plays them once in view', () => {
      giveLayout();
      const { container, rerender } = renderFlow();
      expect(container.querySelector('.w2e-head')).toHaveAttribute('data-reveal', 'armed');
      expect(container.querySelector('.w2e-stage')).toHaveAttribute('data-reveal', 'armed');

      motion.inView = true;
      rerender(<WasteToEnergy copy={copy} axisNames={axisNames} />);
      expect(container.querySelector('.w2e-head')).toHaveAttribute('data-reveal', 'shown');
      expect(container.querySelector('.w2e-stage')).toHaveAttribute('data-reveal', 'shown');
    });

    it('never arms under reduced motion: nothing slides, nothing is held hidden', () => {
      motion.reduce = true;
      giveLayout();
      const { container } = renderFlow();
      expect(container.querySelector('.w2e-head')).not.toHaveAttribute('data-reveal');
      expect(container.querySelector('.w2e-stage')).not.toHaveAttribute('data-reveal');
      // The heading is plain markup, with no inline transform left by a
      // JavaScript animation.
      expect(container.querySelector('.w2e-head').getAttribute('style')).toBeNull();
    });
  });

  describe('stylesheet', () => {
    it('plays once and stops: no animation runs on a loop', () => {
      expect(css).not.toMatch(/infinite/);
    });

    it('clips the band instead of hiding its overflow, so the stage can stick', () => {
      const band = css.match(/\.w2e\s*\{[^}]*\}/)[0];
      expect(band).toMatch(/overflow:\s*clip/);
      expect(css).toMatch(/\.w2e-stage\s*\{[^}]*position:\s*sticky/);
      expect(band).not.toMatch(/overflow:\s*hidden/);
    });

    it('uses brand tokens, not literal colours', () => {
      expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
      expect(css).not.toMatch(/rgba?\(/);
    });
  });
});
