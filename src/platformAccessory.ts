import type { API, Logging, PlatformAccessory, Service } from 'homebridge';

import { evaluateCalendarState } from './calendar-state';
import type { CalendarRuntimeState, CalendarStateConfig, StateDefinition } from './types';

export class CalendarStateAccessory {
  private service: Service;
  private lastValue = false;

  constructor(
    private readonly log: Logging,
    private readonly api: API,
    private readonly accessory: PlatformAccessory,
    private readonly config: CalendarStateConfig,
    private readonly definition: StateDefinition,
    private readonly getRuntimeState: () => CalendarRuntimeState,
  ) {
    const { Service, Characteristic } = this.api.hap;
    accessory.context.stateDefinition = {
      id: definition.id,
      name: definition.name,
    };

    accessory.getService(Service.AccessoryInformation)
      ?.setCharacteristic(Characteristic.Manufacturer, 'homebridge-calendar-state')
      .setCharacteristic(Characteristic.Model, 'Calendar State Sensor')
      .setCharacteristic(Characteristic.SerialNumber, definition.id);

    const staleSwitchService = accessory.getService(Service.Switch);
    if (staleSwitchService) {
      accessory.removeService(staleSwitchService);
    }

    this.service = accessory.getService(Service.OccupancySensor)
      ?? accessory.addService(Service.OccupancySensor, definition.name, definition.id);
    this.service.getCharacteristic(Characteristic.OccupancyDetected).onGet(() => {
      return this.getBooleanValueSafely()
        ? Characteristic.OccupancyDetected.OCCUPANCY_DETECTED
        : Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED;
    });

    this.refresh();
  }

  refresh(): void {
    const { Characteristic } = this.api.hap;
    const value = this.getBooleanValueSafely();
    this.service.updateCharacteristic(
      Characteristic.OccupancyDetected,
      value ? Characteristic.OccupancyDetected.OCCUPANCY_DETECTED : Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED,
    );
  }

  private getBooleanValueSafely(): boolean {
    try {
      this.lastValue = this.getBooleanValue();
    } catch (error) {
      this.log.error('Failed to evaluate Calendar State sensor "%s": %s', this.definition.name, error instanceof Error ? error.message : String(error));
    }
    return this.lastValue;
  }

  private getBooleanValue(): boolean {
    return this.definition.getValue(evaluateCalendarState(this.config, new Date(), this.getRuntimeState()));
  }
}
