# HomeKit Automation Examples

- When `Is Working Day` is active at 07:00, run the weekday morning scene.
- When `Is Work From Home Day` is active, keep the home office heated.
- When `Is Office Day` is active, switch off home office plugs after departure.
- When `Is Special Date: Christmas` is active, run a holiday lighting scene.
- When `Vacation Mode` is on, skip workday automations while you are on leave.
- When `Is Summer` is active, use a lighter climate preset.

Calendar states are read-only sensors; HomeKit apps cannot manually change their state. `Vacation Mode` is intentionally a switch because it is a manual override.
