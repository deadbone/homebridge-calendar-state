# Troubleshooting

## No Accessories Appear

Check that the platform entry is named `CalendarState` and at least one `expose` option is enabled.

## Wrong Day

Check `timezone`. Use an IANA value such as `Europe/Paris`.

## Automations Are Awkward

Try `exposeAs: "switch"` if HomeKit handles switch conditions more naturally than occupancy sensors.

## Date Override Undefined

If Homebridge logs `Date override entries must include a date using YYYY-MM-DD`, remove any partially filled override row or set its `date` field. Empty override rows created by Homebridge UI are ignored by the plugin.
