# Changelog

## 0.1.0-alpha.6

- Fixes Homebridge UI array forms so empty `dateOverrides` and `specialDates` add rows do not block configuration saves.
- Keeps runtime validation for partially filled date override and special date entries.

## 0.1.0-alpha.5

- Adds a persisted `Vacation Mode` HomeKit switch that marks the day off and disables working, office, and work-from-home states while active.
- Adds read-only meteorological season sensors: `Is Spring`, `Is Summer`, `Is Autumn`, and `Is Winter`.
- Adds Homebridge UI schema options for Vacation Mode and season hemisphere.
- Documents future ideas for holiday ranges and tomorrow-oriented sensors without implementing them yet.

## 0.1.0-alpha.4

- Expose calendar states only as read-only occupancy sensors.
- Remove the Homebridge UI `exposeAs` switch option.
- Remove stale switch services from cached accessories during migration.

## 0.1.0-alpha.3

- Rename the Homebridge UI package display name to `Homebridge Calendar State`.
- Update the default platform display name for new configurations.

## 0.1.0-alpha.2

- Ignore empty Homebridge UI rows in `dateOverrides` while still rejecting partially filled override entries without a valid `YYYY-MM-DD` date.
- Fix npm metadata links to point to the published GitHub repository.

## 0.1.0-alpha.0

- Initial alpha dynamic platform plugin.
- Adds configurable calendar state sensors or read-only switches.
- Adds timezone-aware evaluation, date overrides, special dates, Homebridge UI schema, tests, assets, and wiki drafts.
