# homebridge-calendar-state Wiki

## English

`homebridge-calendar-state` exposes local calendar states in HomeKit through Homebridge.

It exposes read-only occupancy sensors for rule-based states such as weekend, weekday, working day, day off, work from home, office day, weekdays, seasons, first/last day of month, and named special dates.

It also exposes an optional `Vacation Mode` switch. When this switch is on, the current day behaves as day off and work-related sensors turn off, which makes it easy to skip workday automations during leave.

This plugin does not read remote calendars. That is intentional: it focuses on deterministic local rules with no unnecessary network calls.

### Pages

- [Installation](Installation.md)
- [Configuration](Configuration.md)
- [Calendar logic](Calendar-Logic.md)
- [Special dates and overrides](Special-Dates-and-Overrides.md)
- [HomeKit automation examples](HomeKit-Automation-Examples.md)
- [Troubleshooting](Troubleshooting.md)
- [Development](Development.md)
- [Publishing to npm](Publishing-to-npm.md)
- [Homebridge verification checklist](Homebridge-Verification-Checklist.md)
- [FAQ](FAQ.md)

### Compatibility

- Homebridge `^1.8.0 || ^2.0.0`.
- Node.js `^22.12.0 || ^24.0.0`.
- Plugin type: dynamic platform.
- Module format: CommonJS.

### Scope

The plugin focuses on deterministic local rule evaluation. It does not fetch remote calendars, public-holiday feeds, or personal calendar data, and it does not include telemetry.

### Scoped plugin readiness

The current npm package is `homebridge-calendar-state`.

If the Homebridge team later accepts the plugin into the scoped plugin program, the scoped package would be `@homebridge-plugins/homebridge-calendar-state`. The plugin keeps stable accessory UUIDs based on state definition IDs so this future migration can preserve existing HomeKit accessories when the Homebridge scoped-plugin migration process is followed.

### Support

If this plugin is useful to you, you can support its maintenance through [GitHub Sponsors](https://github.com/sponsors/deadbone) or [Ko-fi](https://ko-fi.com/deadbone111019).

### Future ideas

These ideas are documented for later discussion and are not implemented yet:

- `holidayRanges`: date ranges for vacations or longer exceptional periods.
- Tomorrow-oriented sensors, such as `Is Tomorrow Working Day` or `Is Tomorrow Day Off`, for evening preparation automations.
