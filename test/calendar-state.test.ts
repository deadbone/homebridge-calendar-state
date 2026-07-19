import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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

  it('ignores empty Homebridge UI date override rows', () => {
    const state = evaluateCalendarState(
      {
        ...baseConfig,
        dateOverrides: [{}, { date: '', dayOff: false, workFromHome: false, officeDay: false }],
      },
      new Date('2026-07-17T10:00:00.000Z'),
    );
    assert.equal(state.isWorkingDay, true);
  });

  it('rejects non-empty date override rows without a date', () => {
    assert.throws(
      () => evaluateCalendarState({ ...baseConfig, dateOverrides: [{ dayOff: true }] }, new Date('2026-07-17T10:00:00.000Z')),
      /Date override entries must include a date using YYYY-MM-DD/,
    );
  });

  it('detects first day, last day, and special dates', () => {
    const first = evaluateCalendarState(baseConfig, new Date('2026-07-01T10:00:00.000Z'));
    const last = evaluateCalendarState(baseConfig, new Date('2026-07-31T10:00:00.000Z'));
    const special = evaluateCalendarState(baseConfig, new Date('2026-07-14T10:00:00.000Z'));
    assert.equal(first.isFirstDayOfMonth, true);
    assert.equal(last.isLastDayOfMonth, true);
    assert.equal(special.specialDates['Bastille Day'], true);
  });

  it('lets vacation mode override working, office, and work from home states', () => {
    const state = evaluateCalendarState(baseConfig, new Date('2026-07-17T10:00:00.000Z'), { vacationMode: true });
    assert.equal(state.isVacationMode, true);
    assert.equal(state.isDayOff, true);
    assert.equal(state.isWorkingDay, false);
    assert.equal(state.isWorkFromHomeDay, false);
    assert.equal(state.isOfficeDay, false);
  });

  it('detects meteorological seasons for northern and southern hemispheres', () => {
    const northern = evaluateCalendarState(baseConfig, new Date('2026-07-17T10:00:00.000Z'));
    const southern = evaluateCalendarState(
      { ...baseConfig, seasons: { hemisphere: 'southern' } },
      new Date('2026-07-17T10:00:00.000Z'),
    );
    assert.equal(northern.season, 'summer');
    assert.equal(northern.seasons.summer, true);
    assert.equal(southern.season, 'winter');
    assert.equal(southern.seasons.winter, true);
  });
});

describe('buildStateDefinitions', () => {
  it('builds optional special date definitions', () => {
    const definitions = buildStateDefinitions(baseConfig);
    assert.ok(definitions.some((definition) => definition.name === 'Is Special Date: Christmas'));
    assert.ok(definitions.some((definition) => definition.name === 'Is Monday'));
    assert.ok(definitions.some((definition) => definition.name === 'Is Summer'));
  });

  it('can disable season definitions', () => {
    const definitions = buildStateDefinitions({ ...baseConfig, seasons: { enabled: false } });
    assert.equal(definitions.some((definition) => definition.name === 'Is Summer'), false);
  });
});

describe('getMillisecondsUntilNextLocalMidnight', () => {
  it('returns a positive delay', () => {
    const delay = getMillisecondsUntilNextLocalMidnight(new Date('2026-07-17T10:00:00.000Z'), 'Europe/Paris');
    assert.ok(delay > 0);
    assert.ok(delay <= 48 * 60 * 60 * 1000);
  });
});


describe('config.schema.json', () => {
  it('does not require fields in empty Homebridge UI array add forms', () => {
    const schema = JSON.parse(readFileSync(join(process.cwd(), 'config.schema.json'), 'utf8'));
    const properties = schema.schema.properties;

    assert.equal(properties.dateOverrides.items.properties.date.required, undefined);
    assert.equal(properties.specialDates.items.properties.name.required, undefined);
    assert.equal(properties.specialDates.items.properties.date.required, undefined);
  });

  it('uses object-level required arrays instead of field-level booleans', () => {
    const schema = JSON.parse(readFileSync(join(process.cwd(), 'config.schema.json'), 'utf8'));
    const invalidPaths: string[] = [];

    function collectFieldLevelRequiredBooleans(value: unknown, path: string): void {
      if (!value || typeof value !== 'object') {
        return;
      }

      if ('required' in value && typeof (value as { required?: unknown }).required === 'boolean') {
        invalidPaths.push(`${path}.required`);
      }

      for (const [key, child] of Object.entries(value)) {
        collectFieldLevelRequiredBooleans(child, `${path}.${key}`);
      }
    }

    collectFieldLevelRequiredBooleans(schema, 'schema');

    assert.deepEqual(invalidPaths, []);
    assert.deepEqual(schema.schema.required, ['name']);
  });
});
