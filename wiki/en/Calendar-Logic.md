# Calendar Logic

The plugin evaluates the configured local date at startup, on every HomeKit read, when `Vacation Mode` changes, and at the next local midnight.

Rules:

- Weekend is defined only by `weekendDays`.
- Day off is defined by `daysOff`, unless an exact override changes it.
- Work from home and office states are defined by weekly rules, unless an exact override changes them.
- Working day is true only when the day is not weekend and not day off.
- `Vacation Mode` has runtime priority for work-related states: day off becomes true, and working day, office day, and work from home become false.
- Seasons are meteorological: spring is March-May, summer is June-August, autumn is September-November, and winter is December-February in the northern hemisphere. The southern hemisphere inverts them.
- Date overrides have priority over weekly rules when Vacation Mode is off.
