# Configuration

The plugin ships with `config.schema.json` for Homebridge UI.

```json
{
  "platform": "CalendarState",
  "name": "Homebridge Calendar State",
  "timezone": "Europe/Paris",
  "vacationMode": {
    "enabled": true,
    "name": "Vacation Mode"
  },
  "seasons": {
    "enabled": true,
    "hemisphere": "northern"
  },
  "weekendDays": ["saturday", "sunday"],
  "daysOff": ["wednesday"],
  "workFromHomeDays": ["monday", "friday"],
  "officeDays": ["tuesday", "thursday"]
}
```

## Key Options

- `timezone`: IANA timezone for local date evaluation.
- `vacationMode`: optional persisted HomeKit switch. When on, the current day is treated as day off and work-related sensors turn off.
- `seasons`: enables meteorological season sensors and selects the `northern` or `southern` hemisphere.
- `weekendDays`: configurable weekend days.
- `daysOff`: regular weekly days off.
- `workFromHomeDays`: regular WFH days.
- `officeDays`: regular office days.
- `specialDates`: recurring `MM-DD` special dates.
- `dateOverrides`: exact `YYYY-MM-DD` exceptions.
- `expose`: toggles accessory groups, including season sensors.
