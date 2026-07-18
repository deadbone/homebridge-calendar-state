# Troubleshooting

## No Accessories Appear

Check that the platform entry is named `CalendarState` and at least one `expose` option is enabled.

## Wrong Day

Check `timezone`. Use an IANA value such as `Europe/Paris`.

## Can I Manually Change a State?

No. Calendar states are exposed as read-only occupancy sensors so HomeKit apps cannot manually change them.

## Date Override Undefined

If Homebridge logs `Date override entries must include a date using YYYY-MM-DD`, remove any partially filled override row or set its `date` field. Empty override rows created by Homebridge UI are ignored by the plugin, and the schema does not require the empty add form to be completed.

## Security

- No cloud service is used.
- No telemetry, analytics, or tracking is included.
- The plugin does not fetch remote calendars or public-holiday feeds.
- Calendar rules are evaluated locally from Homebridge configuration.
- No API keys, credentials, or personal calendar data are required.
- No post-install script modifies the user's system.
