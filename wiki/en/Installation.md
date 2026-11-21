# Installation

# Compatibility

- Homebridge: `^1.8.0 || ^2.0.0`
- Node.js: `^22.12.0 || ^24.0.0 || ^26.0.0`. Node.js 26 requires Homebridge 2.5.0 or later.
- Plugin type: dynamic platform
- Module format: CommonJS


After npm publication:

```sh
npm install -g homebridge-calendar-state@latest
```

Then add the `CalendarState` platform in Homebridge UI or `config.json`.

## Local Development Install

```sh
npm install
npm run build
npm link
homebridge -D -U ~/.homebridge-dev
```

Use a separate Homebridge user directory for development to avoid disturbing a production bridge.
