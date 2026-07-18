export type WeekdayName =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type SeasonName = 'spring' | 'summer' | 'autumn' | 'winter';
export type HemisphereName = 'northern' | 'southern';

export interface SpecialDateConfig {
  name?: string;
  date?: string;
}

export interface DateOverrideConfig {
  date?: string;
  dayOff?: boolean;
  workFromHome?: boolean;
  officeDay?: boolean;
}

export interface VacationModeConfig {
  enabled?: boolean;
  name?: string;
}

export interface SeasonsConfig {
  enabled?: boolean;
  hemisphere?: HemisphereName;
}

export interface ExposeConfig {
  weekend?: boolean;
  weekday?: boolean;
  dayOff?: boolean;
  workingDay?: boolean;
  workFromHome?: boolean;
  officeDay?: boolean;
  daysOfWeek?: boolean;
  firstDayOfMonth?: boolean;
  lastDayOfMonth?: boolean;
  specialDates?: boolean;
  seasons?: boolean;
}

export interface CalendarStateConfig {
  platform: string;
  name?: string;
  timezone?: string;
  locale?: string;
  weekendDays?: WeekdayName[];
  daysOff?: WeekdayName[];
  workFromHomeDays?: WeekdayName[];
  officeDays?: WeekdayName[];
  specialDates?: SpecialDateConfig[];
  dateOverrides?: DateOverrideConfig[];
  vacationMode?: VacationModeConfig;
  seasons?: SeasonsConfig;
  expose?: ExposeConfig;
}

export interface CalendarRuntimeState {
  vacationMode?: boolean;
}

export interface CalendarEvaluation {
  date: string;
  monthDay: string;
  weekday: WeekdayName;
  season: SeasonName;
  isWeekend: boolean;
  isWeekday: boolean;
  isDayOff: boolean;
  isWorkingDay: boolean;
  isWorkFromHomeDay: boolean;
  isOfficeDay: boolean;
  isVacationMode: boolean;
  isFirstDayOfMonth: boolean;
  isLastDayOfMonth: boolean;
  daysOfWeek: Record<WeekdayName, boolean>;
  seasons: Record<SeasonName, boolean>;
  specialDates: Record<string, boolean>;
}

export interface StateDefinition {
  id: string;
  name: string;
  getValue: (state: CalendarEvaluation) => boolean;
}
