# Home

`homebridge-calendar-state` exposes local calendar states in HomeKit through Homebridge.

It exposes read-only occupancy sensors for rule-based states such as weekend, weekday, working day, day off, work from home, office day, weekdays, seasons, first/last day of month, and named special dates.

It also exposes an optional `Vacation Mode` switch. When this switch is on, the current day behaves as day off and work-related sensors turn off, which makes it easy to skip workday automations during leave.

This alpha does not read remote calendars. That is intentional: the plugin focuses on deterministic local rules with no unnecessary network calls.

## Future Ideas

These ideas are documented for later discussion and are not implemented yet:

- `holidayRanges`: date ranges for vacations or longer exceptional periods.
- Tomorrow-oriented sensors, such as `Is Tomorrow Working Day` or `Is Tomorrow Day Off`, for evening preparation automations.

## Useful Pages

- Installation
- Configuration
- Calendar Logic
- HomeKit Automation Examples
- Special Dates and Overrides
- Troubleshooting
- Development
- Publishing to npm
- Homebridge Verification Checklist
- FAQ
