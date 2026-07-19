# Changelog

## Unreleased

## 0.1.0

- First stable release line.
- Promote the package version from alpha to the stable release line.
- Includes the previous Homebridge UI date override fix and all previous calendar state features.
- Add GitHub Actions Trusted Publishing for internal PR beta packages and stable releases without npm tokens.
- Publish PR beta builds with unique `beta.pr.<PR>.<RUN>.<ATTEMPT>` versions under the npm `beta` tag.
- Release stable patch versions automatically after merged PRs to `main`, including the npm `latest` publish, git tag, and GitHub Release.
- Allow manually publishing the current stable package through GitHub Actions Trusted Publishing.
- Document the npm trusted publisher settings and beta/stable release flow for this repository.

## 0.1.0-alpha.7

- Treat Homebridge UI date override add forms with empty dates and unchecked boolean fields as empty rows so they do not affect saved configuration.

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
