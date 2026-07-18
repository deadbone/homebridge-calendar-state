import type { API, CharacteristicValue, Logging, PlatformAccessory, Service } from 'homebridge';

export class VacationModeAccessory {
  private service: Service;

  constructor(
    private readonly log: Logging,
    private readonly api: API,
    private readonly accessory: PlatformAccessory,
    private readonly name: string,
    private readonly onChange: (enabled: boolean) => void,
  ) {
    const { Service, Characteristic } = this.api.hap;
    accessory.context.vacationModeOn = Boolean(accessory.context.vacationModeOn);

    accessory.getService(Service.AccessoryInformation)
      ?.setCharacteristic(Characteristic.Manufacturer, 'homebridge-calendar-state')
      .setCharacteristic(Characteristic.Model, 'Calendar State Vacation Mode')
      .setCharacteristic(Characteristic.SerialNumber, 'vacation-mode');

    const staleSensorService = accessory.getService(Service.OccupancySensor);
    if (staleSensorService) {
      accessory.removeService(staleSensorService);
    }

    this.service = accessory.getService(Service.Switch)
      ?? accessory.addService(Service.Switch, name, 'vacation-mode');
    this.service.setCharacteristic(Characteristic.Name, name);
    this.service.getCharacteristic(Characteristic.On)
      .onGet(() => this.getValue())
      .onSet((value) => this.setValue(value));

    this.refresh();
  }

  refresh(): void {
    this.service.updateCharacteristic(this.api.hap.Characteristic.On, this.getValue());
  }

  private getValue(): boolean {
    return Boolean(this.accessory.context.vacationModeOn);
  }

  private setValue(value: CharacteristicValue): void {
    const enabled = Boolean(value);
    if (enabled === this.getValue()) {
      return;
    }

    this.accessory.context.vacationModeOn = enabled;
    this.log.info('%s set to %s.', this.name, enabled ? 'on' : 'off');
    this.onChange(enabled);
  }
}
