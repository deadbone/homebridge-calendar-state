# Configuration

Le plugin fournit `config.schema.json` pour Homebridge UI.

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

Options principales : `timezone`, `weekendDays`, `daysOff`, `workFromHomeDays`, `officeDays`, `specialDates`, `dateOverrides`, `expose`.
