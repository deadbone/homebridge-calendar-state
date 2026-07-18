import type {
  CalendarEvaluation,
  CalendarRuntimeState,
  CalendarStateConfig,
  DateOverrideConfig,
  HemisphereName,
  SeasonName,
  SpecialDateConfig,
  StateDefinition,
  WeekdayName,
} from './types';

export const WEEKDAYS: WeekdayName[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const SEASONS: SeasonName[] = ['spring', 'summer', 'autumn', 'winter'];

const DEFAULT_EXPOSE = {
  weekend: true,
  weekday: true,
  dayOff: true,
  workingDay: true,
  workFromHome: true,
  officeDay: true,
  daysOfWeek: true,
  firstDayOfMonth: true,
  lastDayOfMonth: true,
  specialDates: true,
  seasons: true,
};

export class ConfigValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigValidationError';
  }
}

export function validateConfig(config: CalendarStateConfig): void {
  assertTimeZone(config.timezone ?? 'UTC');
  const weekdayLists = [
    ['weekendDays', config.weekendDays],
    ['daysOff', config.daysOff],
    ['workFromHomeDays', config.workFromHomeDays],
    ['officeDays', config.officeDays],
  ] as const;

  for (const [field, days] of weekdayLists) {
    for (const day of days ?? []) {
      if (!WEEKDAYS.includes(day)) {
        throw new ConfigValidationError(`${field} contains unsupported weekday "${day}".`);
      }
    }
  }

  const hemisphere = config.seasons?.hemisphere ?? 'northern';
  if (!['northern', 'southern'].includes(hemisphere)) {
    throw new ConfigValidationError(`seasons.hemisphere contains unsupported value "${hemisphere}".`);
  }

  for (const specialDate of config.specialDates ?? []) {
    if (isEmptyConfigEntry(specialDate)) {
      continue;
    }
    if (!specialDate.name) {
      throw new ConfigValidationError('Special date entries must include a name.');
    }
    if (!isMonthDay(specialDate.date)) {
      throw new ConfigValidationError(`Special date "${specialDate.name}" must use MM-DD.`);
    }
  }

  for (const override of config.dateOverrides ?? []) {
    if (isEmptyConfigEntry(override)) {
      continue;
    }
    if (!isIsoDate(override.date)) {
      throw new ConfigValidationError('Date override entries must include a date using YYYY-MM-DD.');
    }
  }
}

export function evaluateCalendarState(
  config: CalendarStateConfig,
  now = new Date(),
  runtimeState: CalendarRuntimeState = {},
): CalendarEvaluation {
  validateConfig(config);

  const timezone = config.timezone ?? 'UTC';
  const parts = getLocalDateParts(now, timezone);
  const date = `${parts.year}-${parts.month}-${parts.day}`;
  const monthDay = `${parts.month}-${parts.day}`;
  const weekday = parts.weekday;
  const season = getSeason(parts.month, config.seasons?.hemisphere ?? 'northern');
  const override = getConfiguredDateOverrides(config).find((entry) => entry.date === date);
  const isVacationMode = runtimeState.vacationMode ?? false;

  const isWeekend = Boolean(config.weekendDays?.includes(weekday));
  const regularDayOff = Boolean(config.daysOff?.includes(weekday));
  const isDayOff = isVacationMode || (override?.dayOff ?? regularDayOff);
  const isWorkFromHomeDay = isVacationMode ? false : (override?.workFromHome ?? Boolean(config.workFromHomeDays?.includes(weekday)));
  const isOfficeDay = isVacationMode ? false : (override?.officeDay ?? Boolean(config.officeDays?.includes(weekday)));
  const isWorkingDay = !isVacationMode && !isWeekend && !isDayOff;
  const daysOfWeek = Object.fromEntries(WEEKDAYS.map((day) => [day, day === weekday])) as Record<WeekdayName, boolean>;
  const seasons = Object.fromEntries(SEASONS.map((entry) => [entry, entry === season])) as Record<SeasonName, boolean>;
  const specialDates = Object.fromEntries(
    getConfiguredSpecialDates(config).map((specialDate) => [specialDate.name, specialDate.date === monthDay]),
  );

  return {
    date,
    monthDay,
    weekday,
    season,
    isWeekend,
    isWeekday: !isWeekend,
    isDayOff,
    isWorkingDay,
    isWorkFromHomeDay,
    isOfficeDay,
    isVacationMode,
    isFirstDayOfMonth: parts.day === '01',
    isLastDayOfMonth: isLastDayOfMonth(parts.year, parts.month, parts.day),
    daysOfWeek,
    seasons,
    specialDates,
  };
}

export function buildStateDefinitions(config: CalendarStateConfig): StateDefinition[] {
  const expose = { ...DEFAULT_EXPOSE, ...config.expose };
  const definitions: StateDefinition[] = [];

  if (expose.weekend) {
    definitions.push({ id: 'weekend', name: 'Is Weekend', getValue: (state) => state.isWeekend });
  }
  if (expose.weekday) {
    definitions.push({ id: 'weekday', name: 'Is Weekday', getValue: (state) => state.isWeekday });
  }
  if (expose.dayOff) {
    definitions.push({ id: 'day-off', name: 'Is Day Off', getValue: (state) => state.isDayOff });
  }
  if (expose.workingDay) {
    definitions.push({ id: 'working-day', name: 'Is Working Day', getValue: (state) => state.isWorkingDay });
  }
  if (expose.workFromHome) {
    definitions.push({ id: 'work-from-home', name: 'Is Work From Home Day', getValue: (state) => state.isWorkFromHomeDay });
  }
  if (expose.officeDay) {
    definitions.push({ id: 'office-day', name: 'Is Office Day', getValue: (state) => state.isOfficeDay });
  }
  if (expose.daysOfWeek) {
    for (const day of WEEKDAYS) {
      definitions.push({
        id: `is-${day}`,
        name: `Is ${capitalize(day)}`,
        getValue: (state) => state.daysOfWeek[day],
      });
    }
  }
  if (expose.seasons && (config.seasons?.enabled ?? true)) {
    for (const season of SEASONS) {
      definitions.push({
        id: `is-${season}`,
        name: `Is ${capitalize(season)}`,
        getValue: (state) => state.seasons[season],
      });
    }
  }
  if (expose.firstDayOfMonth) {
    definitions.push({ id: 'first-day-of-month', name: 'Is First Day Of Month', getValue: (state) => state.isFirstDayOfMonth });
  }
  if (expose.lastDayOfMonth) {
    definitions.push({ id: 'last-day-of-month', name: 'Is Last Day Of Month', getValue: (state) => state.isLastDayOfMonth });
  }
  if (expose.specialDates) {
    for (const specialDate of getConfiguredSpecialDates(config)) {
      definitions.push({
        id: `special-${slugify(specialDate.name)}`,
        name: `Is Special Date: ${specialDate.name}`,
        getValue: (state) => state.specialDates[specialDate.name] ?? false,
      });
    }
  }

  return definitions;
}

function getConfiguredSpecialDates(config: CalendarStateConfig): Array<Required<SpecialDateConfig>> {
  return (config.specialDates ?? []).filter((entry): entry is Required<SpecialDateConfig> => {
    return Boolean(entry.name && isMonthDay(entry.date));
  });
}

function getConfiguredDateOverrides(config: CalendarStateConfig): Array<DateOverrideConfig & { date: string }> {
  return (config.dateOverrides ?? []).filter((entry): entry is DateOverrideConfig & { date: string } => isIsoDate(entry.date));
}

export function getMillisecondsUntilNextLocalMidnight(now: Date, timezone: string): number {
  assertTimeZone(timezone);
  let cursor = new Date(now.getTime() + 60_000);
  const startDate = getLocalDateParts(now, timezone).dateKey;

  for (let i = 0; i < 60 * 24 * 3; i += 1) {
    const parts = getLocalDateParts(cursor, timezone);
    if (parts.dateKey !== startDate && parts.hour === 0 && parts.minute === 0) {
      return Math.max(1_000, cursor.getTime() - now.getTime());
    }
    cursor = new Date(cursor.getTime() + 60_000);
  }

  return 24 * 60 * 60 * 1_000;
}

function getLocalDateParts(date: Date, timezone: string): {
  year: string;
  month: string;
  day: string;
  weekday: WeekdayName;
  hour: number;
  minute: number;
  dateKey: string;
} {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const partMap = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  const year = requirePart(partMap, 'year');
  const month = requirePart(partMap, 'month');
  const day = requirePart(partMap, 'day');
  const weekday = requirePart(partMap, 'weekday').toLowerCase() as WeekdayName;
  return {
    year,
    month,
    day,
    weekday,
    hour: Number(requirePart(partMap, 'hour')),
    minute: Number(requirePart(partMap, 'minute')),
    dateKey: `${year}-${month}-${day}`,
  };
}

function getSeason(month: string, hemisphere: HemisphereName): SeasonName {
  const monthNumber = Number(month);
  let northernSeason: SeasonName;

  if (monthNumber >= 3 && monthNumber <= 5) {
    northernSeason = 'spring';
  } else if (monthNumber >= 6 && monthNumber <= 8) {
    northernSeason = 'summer';
  } else if (monthNumber >= 9 && monthNumber <= 11) {
    northernSeason = 'autumn';
  } else {
    northernSeason = 'winter';
  }

  if (hemisphere === 'northern') {
    return northernSeason;
  }

  const southernSeasons: Record<SeasonName, SeasonName> = {
    spring: 'autumn',
    summer: 'winter',
    autumn: 'spring',
    winter: 'summer',
  };
  return southernSeasons[northernSeason];
}

function isLastDayOfMonth(year: string, month: string, day: string): boolean {
  const nextDay = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) + 1));
  return nextDay.getUTCDate() === 1;
}

function assertTimeZone(timezone: string): void {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format(new Date());
  } catch {
    throw new ConfigValidationError(`Unsupported timezone "${timezone}". Use an IANA timezone such as Europe/Paris.`);
  }
}

function requirePart(parts: Record<string, string>, key: string): string {
  const value = parts[key];
  if (!value) {
    throw new ConfigValidationError(`Unable to read local date part "${key}".`);
  }
  return value;
}

function isEmptyConfigEntry(entry: object): boolean {
  return Object.values(entry).every((value) => value === undefined || value === null || value === '' || value === false);
}

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isMonthDay(value: unknown): value is string {
  return typeof value === 'string' && /^\d{2}-\d{2}$/.test(value);
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'date';
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
