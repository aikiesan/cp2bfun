import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';

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

vi.mock('../../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  fetchEventBySlug: vi.fn(),
  fetchGallery: vi.fn(),
}));

import { fetchEventBySlug } from '../../services/api';
import EventDetail from '../EventDetail';

const baseEvent = {
  id: 7,
  slug: 'workshop-biogas',
  title_pt: 'Workshop de Biogás',
  title_en: 'Biogas Workshop',
  event_type: 'workshop',
  location_type: 'in-person',
  location: 'Unicamp',
  status: 'upcoming',
  schedule: [],
  gallery_album_ids: [],
};

const renderEvent = async (overrides = {}) => {
  fetchEventBySlug.mockResolvedValueOnce({ ...baseEvent, ...overrides });
  const utils = renderWithProviders(<EventDetail />);
  await screen.findByRole('heading', { level: 1 });
  return utils;
};

const countdown = () => document.querySelector('.event-countdown');

beforeEach(() => {
  motion.inView = false;
  motion.reduce = false;
  localStorage.clear();
  // Only the clock is frozen (5 October 2026, local noon); timers stay real
  // so the page's async load still resolves.
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 9, 5, 12, 0));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  fetchEventBySlug.mockReset();
});

describe('EventDetail — countdown', () => {
  it('shows no countdown for a past event', async () => {
    await renderEvent({ start_date: '2020-03-10T12:00:00.000Z', end_date: '2020-03-11T20:00:00.000Z', status: 'completed' });
    expect(countdown()).toBeNull();
    expect(screen.queryByText(/Faltam|É amanhã|É hoje/)).toBeNull();
  });

  it('shows no countdown for a past event even without a status', async () => {
    await renderEvent({ start_date: '2026-10-01', end_date: '2026-10-02', status: null });
    expect(countdown()).toBeNull();
  });

  it('shows the days left, next to the date', async () => {
    await renderEvent({ start_date: '2026-10-17T13:00:00.000Z', end_date: '2026-10-17T20:00:00.000Z' });
    const badge = countdown();
    expect(badge).toHaveTextContent('Faltam 12 dias');
    // Inside the date's <dd>, right below it.
    expect(badge.closest('dd')).toHaveTextContent(/17 de outubro de 2026/);
    expect(badge.querySelector('.count-up')).toHaveTextContent('12');
  });

  it('says "É amanhã" the day before and "É hoje" on the day', async () => {
    const { unmount } = await renderEvent({ start_date: '2026-10-06', end_date: '2026-10-06' });
    expect(countdown()).toHaveTextContent('É amanhã');
    unmount();

    await renderEvent({ start_date: '2026-10-05', end_date: '2026-10-05' });
    expect(countdown()).toHaveTextContent('É hoje');
  });

  it('says "Acontecendo agora" while a multi-day event is under way', async () => {
    await renderEvent({ start_date: '2026-10-04', end_date: '2026-10-06', status: 'ongoing' });
    expect(countdown()).toHaveTextContent('Acontecendo agora');
  });

  it('does not count down to a cancelled event', async () => {
    await renderEvent({ start_date: '2026-10-17', end_date: '2026-10-17', status: 'cancelled' });
    expect(countdown()).toBeNull();
  });

  it('translates the countdown to English', async () => {
    localStorage.setItem('cp2b_lang', 'en');
    await renderEvent({ start_date: '2026-10-17', end_date: '2026-10-17' });
    expect(countdown()).toHaveTextContent('12 days to go');
  });

  it('keeps the badge icon out of the accessibility tree', async () => {
    await renderEvent({ start_date: '2026-10-17', end_date: '2026-10-17' });
    expect(countdown().querySelector('.bi')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('EventDetail — schedule', () => {
  const schedule = [
    { time: '09:00', title_pt: 'Abertura', title_en: 'Opening', speaker: 'Coordenação' },
    { time: '10:00', title_pt: 'Painel', title_en: 'Panel' },
    { time: '11:30', title_pt: 'Encerramento', title_en: 'Closing' },
  ];
  const list = () => document.querySelector('.event-schedule');

  it('shows the whole schedule, in order, when there is no layout', async () => {
    await renderEvent({ start_date: '2026-10-17', end_date: '2026-10-17', schedule });
    expect(screen.getByText('Programação')).toBeInTheDocument();
    expect(list()).not.toHaveAttribute('data-reveal');
    const rows = [...list().querySelectorAll('.event-schedule__item')];
    expect(rows.map((row) => within(row).getByText(/^\d{2}:\d{2}$/).textContent)).toEqual(['09:00', '10:00', '11:30']);
    expect(rows.map((row) => row.style.getPropertyValue('--i'))).toEqual(['0', '1', '2']);
  });

  it('holds the rows until the list scrolls into view, then releases them in sequence', async () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 0, bottom: 300, left: 0, right: 600, width: 600, height: 300, x: 0, y: 0,
    });
    const { rerender } = await renderEvent({ start_date: '2026-10-17', end_date: '2026-10-17', schedule });
    expect(list()).toHaveAttribute('data-reveal', 'armed');

    motion.inView = true;
    rerender(<EventDetail />);
    expect(list()).toHaveAttribute('data-reveal', 'shown');
  });

  it('never arms under reduced motion', async () => {
    motion.reduce = true;
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 0, bottom: 300, left: 0, right: 600, width: 600, height: 300, x: 0, y: 0,
    });
    await renderEvent({ start_date: '2026-10-17', end_date: '2026-10-17', schedule });
    expect(list()).not.toHaveAttribute('data-reveal');
  });
});
