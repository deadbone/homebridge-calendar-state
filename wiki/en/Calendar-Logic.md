# Calendar Logic

The plugin evaluates the configured local date at startup, on every HomeKit read, and at the next local midnight.

Rules:

- Weekend is defined only by `weekendDays`.
- Day off is defined by `daysOff`, unless an exact override changes it.
- Work from home and office states are defined by weekly rules, unless an exact override changes them.
- Working day is true only when the day is not weekend and not day off.
- Date overrides have priority over weekly rules.
