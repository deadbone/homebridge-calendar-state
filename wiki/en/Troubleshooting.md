# Troubleshooting

## No Accessories Appear

Check that the platform entry is named `CalendarState` and at least one `expose` option is enabled.

## Wrong Day

Check `timezone`. Use an IANA value such as `Europe/Paris`.

## Automations Are Awkward

Try `exposeAs: "switch"` if HomeKit handles switch conditions more naturally than occupancy sensors.
