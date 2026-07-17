# Configuration

The plugin ships with `config.schema.json` for Homebridge UI.

```json
{
  "platform": "CalendarState",
  "name": "Calendar State",
  "timezone": "Europe/Paris",
  "weekendDays": ["saturday", "sunday"],
  "daysOff": ["wednesday"],
  "workFromHomeDays": ["monday", "friday"],
  "officeDays": ["tuesday", "thursday"]
}
```

## Key Options

- `timezone`: IANA timezone for local date evaluation.
- `weekendDays`: configurable weekend days.
- `daysOff`: regular weekly days off.
- `workFromHomeDays`: regular WFH days.
- `officeDays`: regular office days.
- `specialDates`: recurring `MM-DD` special dates.
- `dateOverrides`: exact `YYYY-MM-DD` exceptions.
