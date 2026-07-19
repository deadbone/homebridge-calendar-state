import type { API, DynamicPlatformPlugin, Logging, PlatformAccessory, PlatformConfig } from 'homebridge';

import { buildStateDefinitions, ConfigValidationError, getMillisecondsUntilNextLocalMidnight, validateConfig } from './calendar-state';
import { CalendarStateAccessory } from './platformAccessory';
import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { VacationModeAccessory } from './vacationModeAccessory';
import type { CalendarStateConfig } from './types';

export class CalendarStatePlatform implements DynamicPlatformPlugin {
  private readonly accessories = new Map<string, PlatformAccessory>();
  private readonly stateAccessories: CalendarStateAccessory[] = [];
  private midnightTimer?: NodeJS.Timeout;
  private vacationMode = false;
  private validConfig?: CalendarStateConfig;

  constructor(
    private readonly log: Logging,
    config: PlatformConfig,
    private readonly api: API,
  ) {
    const calendarConfig = config as CalendarStateConfig;

    try {
      validateConfig(calendarConfig);
      this.validConfig = calendarConfig;
    } catch (error) {
      const message = error instanceof ConfigValidationError ? error.message : String(error);
      this.log.error('Calendar State configuration is invalid: %s', message);
      return;
    }

    this.api.on('didFinishLaunching', () => {
      try {
        this.discoverDevices();
        this.scheduleNextMidnightRefresh();
      } catch (error) {
        this.log.error('Calendar State failed during startup: %s', error instanceof Error ? error.message : String(error));
      }
    });
    this.api.on('shutdown', () => this.clearMidnightTimer());
  }

  configureAccessory(accessory: PlatformAccessory): void {
    this.accessories.set(accessory.UUID, accessory);
  }

  private discoverDevices(): void {
    if (!this.validConfig) {
      return;
    }

    const expectedUuids = new Set<string>();
    this.stateAccessories.length = 0;

    if (this.validConfig.vacationMode?.enabled ?? true) {
      this.registerVacationModeAccessory(expectedUuids);
    }

    const definitions = buildStateDefinitions(this.validConfig);
    if (definitions.length === 0) {
      this.log.info('No Calendar State sensor accessories are enabled by configuration.');
    }

    for (const definition of definitions) {
      const uuid = this.api.hap.uuid.generate(`${PLUGIN_NAME}:${definition.id}`);
      expectedUuids.add(uuid);
      const cachedAccessory = this.accessories.get(uuid);
      const accessory = cachedAccessory ?? new this.api.platformAccessory(definition.name, uuid);

      if (!cachedAccessory) {
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      }

      this.stateAccessories.push(new CalendarStateAccessory(
        this.log,
        this.api,
        accessory,
        this.validConfig,
        definition,
        () => ({ vacationMode: this.vacationMode }),
      ));
    }

    const staleAccessories = [...this.accessories.values()].filter((accessory) => !expectedUuids.has(accessory.UUID));
    if (staleAccessories.length > 0) {
      this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, staleAccessories);
    }
  }

  private registerVacationModeAccessory(expectedUuids: Set<string>): void {
    if (!this.validConfig) {
      return;
    }

    const name = this.validConfig.vacationMode?.name ?? 'Vacation Mode';
    const uuid = this.api.hap.uuid.generate(`${PLUGIN_NAME}:vacation-mode`);
    expectedUuids.add(uuid);
    const cachedAccessory = this.accessories.get(uuid);
    const accessory = cachedAccessory ?? new this.api.platformAccessory(name, uuid);
    this.vacationMode = Boolean(accessory.context.vacationModeOn);

    if (!cachedAccessory) {
      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    }

    new VacationModeAccessory(this.log, this.api, accessory, name, (enabled) => {
      this.vacationMode = enabled;
      this.refreshAccessoriesSafely();
    });
  }

  private scheduleNextMidnightRefresh(): void {
    if (!this.validConfig) {
      return;
    }

    const timezone = this.validConfig.timezone ?? 'UTC';
    const delay = getMillisecondsUntilNextLocalMidnight(new Date(), timezone);
    this.clearMidnightTimer();
    this.midnightTimer = setTimeout(() => {
      this.refreshAccessoriesSafely();
      try {
        this.scheduleNextMidnightRefresh();
      } catch (error) {
        this.log.error('Calendar State failed to schedule the next midnight refresh: %s', error instanceof Error ? error.message : String(error));
      }
    }, delay);
    this.midnightTimer.unref();
  }

  private refreshAccessoriesSafely(): void {
    try {
      this.refreshAccessories();
    } catch (error) {
      this.log.error('Calendar State failed to refresh accessories: %s', error instanceof Error ? error.message : String(error));
    }
  }

  private refreshAccessories(): void {
    for (const accessory of this.stateAccessories) {
      accessory.refresh();
    }
  }

  private clearMidnightTimer(): void {
    if (this.midnightTimer) {
      clearTimeout(this.midnightTimer);
      this.midnightTimer = undefined;
    }
  }
}
