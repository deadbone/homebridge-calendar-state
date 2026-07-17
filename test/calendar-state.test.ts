import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildStateDefinitions, evaluateCalendarState, getMillisecondsUntilNextLocalMidnight } from '../src/calendar-state';
import type { CalendarStateConfig } from '../src/types';

const baseConfig: CalendarStateConfig = {
  platform: 'CalendarState',
  timezone: 'Europe/Paris',
  weekendDays: ['saturday', 'sunday'],
  daysOff: ['wednesday'],
  workFromHomeDays: ['monday', 'friday'],
  officeDays: ['tuesday', 'thursday'],
  specialDates: [
    { name: 'Bastille Day', date: '07-14' },
    { name: 'Christmas', date: '12-25' },
  ],
};

describe('evaluateCalendarState', () => {
  it('evaluates regular weekly rules in the configured timezone', () => {
    const state = evaluateCalendarState(baseConfig, new Date('2026-07-17T10:00:00.000Z'));
    assert.equal(state.date, '2026-07-17');
    assert.equal(state.weekday, 'friday');
    assert.equal(state.isWeekend, false);
    assert.equal(state.isWeekday, true);
    assert.equal(state.isWorkingDay, true);
    assert.equal(state.isWorkFromHomeDay, true);
    assert.equal(state.isOfficeDay, false);
    assert.equal(state.daysOfWeek.friday, true);
  });

  it('does not assume Saturday and Sunday are always weekend days', () => {
    const state = evaluateCalendarState(
      { ...baseConfig, weekendDays: ['friday'] },
      new Date('2026-07-17T10:00:00.000Z'),
    );
    assert.equal(state.isWeekend, true);
    assert.equal(state.isWorkingDay, false);
  });

  it('lets explicit date overrides take priority over weekly rules', () => {
    const state = evaluateCalendarState(
      {
        ...baseConfig,
        dateOverrides: [{ date: '2026-07-17', dayOff: true, workFromHome: false, officeDay: true }],
      },
      new Date('2026-07-17T10:00:00.000Z'),
    );
    assert.equal(state.isDayOff, true);
    assert.equal(state.isWorkingDay, false);
    assert.equal(state.isWorkFromHomeDay, false);
    assert.equal(state.isOfficeDay, true);
  });

  it('detects first day, last day, and special dates', () => {
    const first = evaluateCalendarState(baseConfig, new Date('2026-07-01T10:00:00.000Z'));
    const last = evaluateCalendarState(baseConfig, new Date('2026-07-31T10:00:00.000Z'));
    const special = evaluateCalendarState(baseConfig, new Date('2026-07-14T10:00:00.000Z'));
    assert.equal(first.isFirstDayOfMonth, true);
    assert.equal(last.isLastDayOfMonth, true);
    assert.equal(special.specialDates['Bastille Day'], true);
  });
});

describe('buildStateDefinitions', () => {
  it('builds optional special date definitions', () => {
    const definitions = buildStateDefinitions(baseConfig);
    assert.ok(definitions.some((definition) => definition.name === 'Is Special Date: Christmas'));
    assert.ok(definitions.some((definition) => definition.name === 'Is Monday'));
  });
});

describe('getMillisecondsUntilNextLocalMidnight', () => {
  it('returns a positive delay', () => {
    const delay = getMillisecondsUntilNextLocalMidnight(new Date('2026-07-17T10:00:00.000Z'), 'Europe/Paris');
    assert.ok(delay > 0);
    assert.ok(delay <= 48 * 60 * 60 * 1000);
  });
});
