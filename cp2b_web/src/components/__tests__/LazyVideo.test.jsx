import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';

const motion = vi.hoisted(() => ({ reduce: false }));
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useReducedMotion: () => motion.reduce };
});

import LazyVideo from '../LazyVideo';

// IntersectionObserver controlável: o teste diz quanto do vídeo está na tela.
let observers = [];
class ControlledObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.disconnected = false;
    observers.push(this);
  }
  observe(el) { this.el = el; }
  unobserve() {}
  disconnect() { this.disconnected = true; }
}

const scrollTo = (ratio) => {
  act(() => {
    observers
      .filter((o) => !o.disconnected)
      .forEach((o) => o.callback([{ target: o.el, isIntersecting: ratio > 0, intersectionRatio: ratio }]));
  });
};

const SOURCES = [
  { src: '/assets/video-720.mp4', media: '(max-width: 767.98px)' },
  { src: '/assets/video.mp4' },
];

// O jsdom não toca mídia: play/pause viram um estado simples com os mesmos
// eventos do navegador.
const renderVideo = () => {
  const utils = render(<LazyVideo sources={SOURCES} poster="/assets/poster.jpg" label="Vídeo institucional" />);
  const video = utils.container.querySelector('video');
  let paused = true;
  let readyState = 0;
  Object.defineProperty(video, 'paused', { configurable: true, get: () => paused });
  Object.defineProperty(video, 'readyState', { configurable: true, get: () => readyState });
  video.play = vi.fn(() => {
    paused = false;
    readyState = 4;
    video.dispatchEvent(new Event('play'));
    return Promise.resolve();
  });
  video.pause = vi.fn(() => {
    paused = true;
    video.dispatchEvent(new Event('pause'));
  });
  video.load = vi.fn();
  return { ...utils, video };
};

const originalObserver = window.IntersectionObserver;
const originalConnection = Object.getOwnPropertyDescriptor(navigator, 'connection');

beforeEach(() => {
  motion.reduce = false;
  observers = [];
  window.IntersectionObserver = ControlledObserver;
});

afterEach(() => {
  window.IntersectionObserver = originalObserver;
  if (originalConnection) Object.defineProperty(navigator, 'connection', originalConnection);
  else delete navigator.connection;
});

describe('LazyVideo', () => {
  it('starts with only the poster: no autoplay attribute and preload none', () => {
    const { video } = renderVideo();
    expect(video).not.toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('preload', 'none');
    expect(video).toHaveAttribute('poster', '/assets/poster.jpg');
    expect(video).toHaveAttribute('aria-label', 'Vídeo institucional');
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('controls');
  });

  it('offers the small file to phones first, then the full one', () => {
    const { video } = renderVideo();
    const sources = [...video.querySelectorAll('source')];
    expect(sources.map((s) => s.getAttribute('src'))).toEqual(['/assets/video-720.mp4', '/assets/video.mp4']);
    expect(sources[0]).toHaveAttribute('media', '(max-width: 767.98px)');
    expect(sources[1]).not.toHaveAttribute('media');
    sources.forEach((s) => expect(s).toHaveAttribute('type', 'video/mp4'));
  });

  it('starts loading near the screen, plays in view and pauses out of it', () => {
    const { video } = renderVideo();
    expect(video.load).not.toHaveBeenCalled();

    scrollTo(0.1);
    expect(video.preload).toBe('auto');
    expect(video.load).toHaveBeenCalledTimes(1);
    expect(video.play).not.toHaveBeenCalled();

    scrollTo(0.6);
    expect(video.play).toHaveBeenCalledTimes(1);

    scrollTo(0);
    expect(video.pause).toHaveBeenCalledTimes(1);

    // Voltou à tela: volta a tocar, sem recarregar.
    scrollTo(0.8);
    expect(video.play).toHaveBeenCalledTimes(2);
    expect(video.load).toHaveBeenCalledTimes(1);
  });

  it('never resumes on its own after the visitor pauses it', () => {
    const { video } = renderVideo();
    scrollTo(0.9);
    expect(video.play).toHaveBeenCalledTimes(1);

    act(() => video.pause());
    scrollTo(0);
    scrollTo(0.9);
    expect(video.play).toHaveBeenCalledTimes(1);
  });

  it('with reduced motion nothing loads or plays on its own', () => {
    motion.reduce = true;
    const { video } = renderVideo();
    scrollTo(1);
    expect(observers).toHaveLength(0);
    expect(video.load).not.toHaveBeenCalled();
    expect(video.play).not.toHaveBeenCalled();
    expect(video).toHaveAttribute('preload', 'none');
  });

  it('with Save-Data nothing loads or plays on its own', () => {
    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } });
    const { video } = renderVideo();
    scrollTo(1);
    expect(observers).toHaveLength(0);
    expect(video.load).not.toHaveBeenCalled();
    expect(video.play).not.toHaveBeenCalled();
  });

  it('stops watching the screen when it leaves the page', () => {
    const { unmount } = renderVideo();
    expect(observers).toHaveLength(2);
    unmount();
    observers.forEach((o) => expect(o.disconnected).toBe(true));
  });
});
