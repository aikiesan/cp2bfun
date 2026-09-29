/* eslint-env node */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { calendarDay, getEventCountdown } from '../eventCountdown';

// Run in Brasília's time zone, where new Date() reads a date-only string as
// the evening before: that is where the one-day slip showed up.
const ORIGINAL_TZ = process.env.TZ;
beforeAll(() => { process.env.TZ = 'America/Sao_Paulo'; });
afterAll(() => {
  if (ORIGINAL_TZ === undefined) delete process.env.TZ;
  else process.env.TZ = ORIGINAL_TZ;
});

// "Now" in Brasília local time (months from 1, to read naturally).
const at = (y, m, d, h = 12, min = 0) => new Date(y, m - 1, d, h, min);

describe('getEventCountdown', () => {
  it('reproduces the one-day slip it guards against (sanity check of the time zone)', () => {
    expect(new Date('2026-10-05').getDate()).toBe(4);
  });

  it('counts the days left to a future event', () => {
    expect(getEventCountdown('2026-10-20', '2026-10-20', at(2026, 10, 5))).toEqual({ kind: 'days', days: 15 });
    expect(getEventCountdown('2026-10-07', null, at(2026, 10, 5))).toEqual({ kind: 'days', days: 2 });
  });

  it('says tomorrow the day before', () => {
    expect(getEventCountdown('2026-10-06', '2026-10-06', at(2026, 10, 5, 23, 59))).toEqual({ kind: 'tomorrow', days: 1 });
  });

  it('says today on the day, at any hour', () => {
    expect(getEventCountdown('2026-10-05', '2026-10-05', at(2026, 10, 5, 0, 5))).toEqual({ kind: 'today', days: 0 });
    expect(getEventCountdown('2026-10-05', '2026-10-05', at(2026, 10, 5, 23, 55))).toEqual({ kind: 'today', days: 0 });
  });

  it('treats the first day of a multi-day event as today and the following days as ongoing', () => {
    expect(getEventCountdown('2026-10-05', '2026-10-07', at(2026, 10, 5))).toEqual({ kind: 'today', days: 0 });
    expect(getEventCountdown('2026-10-05', '2026-10-07', at(2026, 10, 6))).toEqual({ kind: 'ongoing', days: 0 });
    expect(getEventCountdown('2026-10-05', '2026-10-07', at(2026, 10, 7, 22))).toEqual({ kind: 'ongoing', days: 0 });
  });

  it('shows nothing once the event is over', () => {
    expect(getEventCountdown('2026-10-05', '2026-10-05', at(2026, 10, 6, 0, 1))).toBeNull();
    expect(getEventCountdown('2026-10-05', '2026-10-07', at(2026, 10, 8))).toBeNull();
    expect(getEventCountdown('2020-03-10T12:00:00.000Z', '2020-03-11T20:00:00.000Z', at(2026, 10, 5))).toBeNull();
  });

  it('reads a date-only "YYYY-MM-DD" as the day it writes, not as UTC midnight', () => {
    // UTC midnight of the 5th is 21:00 on the 4th in Brasília; the event is
    // still on the 5th: today on the 5th, tomorrow on the 4th.
    expect(getEventCountdown('2026-10-05', '2026-10-05', at(2026, 10, 5, 8))).toEqual({ kind: 'today', days: 0 });
    expect(getEventCountdown('2026-10-05', '2026-10-05', at(2026, 10, 4, 22))).toEqual({ kind: 'tomorrow', days: 1 });
    // And it is not over yet on the evening of the 5th.
    expect(getEventCountdown('2026-10-05', '2026-10-05', at(2026, 10, 5, 22))).toEqual({ kind: 'today', days: 0 });
  });

  it('reads an ISO date with a time by the local calendar day, the one the page shows', () => {
    // 01:00 UTC on the 5th is 22:00 on the 4th in Brasília.
    expect(getEventCountdown('2026-10-05T01:00:00.000Z', null, at(2026, 10, 4, 9))).toEqual({ kind: 'today', days: 0 });
    expect(getEventCountdown('2026-10-05T01:00:00.000Z', null, at(2026, 10, 3, 9))).toEqual({ kind: 'tomorrow', days: 1 });
    // 14:00 in Brasília, written with its offset.
    expect(getEventCountdown('2026-10-05T14:00:00-03:00', '2026-10-05T18:00:00-03:00', at(2026, 10, 5, 20))).toEqual({ kind: 'today', days: 0 });
    // A local date-time without a zone, as the admin's datetime-local field writes it.
    expect(getEventCountdown('2026-10-09T09:30', null, at(2026, 10, 5, 23))).toEqual({ kind: 'days', days: 4 });
  });

  it('falls back to the start day when the end is missing, invalid or before the start', () => {
    expect(getEventCountdown('2026-10-05', undefined, at(2026, 10, 6))).toBeNull();
    expect(getEventCountdown('2026-10-05', 'not a date', at(2026, 10, 5))).toEqual({ kind: 'today', days: 0 });
    expect(getEventCountdown('2026-10-05', '2026-10-01', at(2026, 10, 6))).toBeNull();
  });

  it('returns null for a missing or invalid start date', () => {
    expect(getEventCountdown(null, null, at(2026, 10, 5))).toBeNull();
    expect(getEventCountdown('', '', at(2026, 10, 5))).toBeNull();
    expect(getEventCountdown('soon', null, at(2026, 10, 5))).toBeNull();
  });

  it('counts across a month and a year boundary', () => {
    expect(getEventCountdown('2027-01-02', null, at(2026, 12, 30))).toEqual({ kind: 'days', days: 3 });
  });
});

describe('calendarDay', () => {
  it('gives the same day number to a date-only string and to that local day at any hour', () => {
    expect(calendarDay('2026-10-05')).toBe(calendarDay(at(2026, 10, 5, 0, 0)));
    expect(calendarDay('2026-10-05')).toBe(calendarDay(at(2026, 10, 5, 23, 59)));
    expect(calendarDay('2026-10-06') - calendarDay('2026-10-05')).toBe(1);
  });
});
