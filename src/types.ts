export type WeekdayName =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';


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
  expose?: ExposeConfig;
}

export interface CalendarEvaluation {
  date: string;
  monthDay: string;
  weekday: WeekdayName;
  isWeekend: boolean;
  isWeekday: boolean;
  isDayOff: boolean;
  isWorkingDay: boolean;
  isWorkFromHomeDay: boolean;
  isOfficeDay: boolean;
  isFirstDayOfMonth: boolean;
  isLastDayOfMonth: boolean;
  daysOfWeek: Record<WeekdayName, boolean>;
  specialDates: Record<string, boolean>;
}

export interface StateDefinition {
  id: string;
  name: string;
  getValue: (state: CalendarEvaluation) => boolean;
}
