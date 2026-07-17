import type { API, Logging, PlatformAccessory, Service } from 'homebridge';

import { evaluateCalendarState } from './calendar-state';
import type { CalendarStateConfig, StateDefinition } from './types';

export class CalendarStateAccessory {
  private service: Service;

  constructor(
    private readonly log: Logging,
    private readonly api: API,
    private readonly accessory: PlatformAccessory,
    private readonly config: CalendarStateConfig,
    private readonly definition: StateDefinition,
  ) {
    const { Service, Characteristic } = this.api.hap;
    accessory.context.stateDefinition = {
      id: definition.id,
      name: definition.name,
    };

    accessory.getService(Service.AccessoryInformation)
      ?.setCharacteristic(Characteristic.Manufacturer, 'homebridge-calendar-state')
      .setCharacteristic(Characteristic.Model, config.exposeAs === 'switch' ? 'Calendar State Switch' : 'Calendar State Sensor')
      .setCharacteristic(Characteristic.SerialNumber, definition.id);

    if (config.exposeAs === 'switch') {
      this.service = accessory.getService(Service.Switch) ?? accessory.addService(Service.Switch, definition.name, definition.id);
      this.service.getCharacteristic(Characteristic.On)
        .onGet(() => this.getBooleanValue())
        .onSet(() => {
          this.log.warn('%s is read-only; HomeKit writes are ignored.', definition.name);
          this.service.updateCharacteristic(Characteristic.On, this.getBooleanValue());
        });
    } else {
      this.service = accessory.getService(Service.OccupancySensor)
        ?? accessory.addService(Service.OccupancySensor, definition.name, definition.id);
      this.service.getCharacteristic(Characteristic.OccupancyDetected).onGet(() => {
        return this.getBooleanValue()
          ? Characteristic.OccupancyDetected.OCCUPANCY_DETECTED
          : Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED;
      });
    }

    this.refresh();
  }

  refresh(): void {
    const { Characteristic } = this.api.hap;
    const value = this.getBooleanValue();
    if (this.config.exposeAs === 'switch') {
      this.service.updateCharacteristic(Characteristic.On, value);
      return;
    }
    this.service.updateCharacteristic(
      Characteristic.OccupancyDetected,
      value ? Characteristic.OccupancyDetected.OCCUPANCY_DETECTED : Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED,
    );
  }

  private getBooleanValue(): boolean {
    return this.definition.getValue(evaluateCalendarState(this.config));
  }
}
