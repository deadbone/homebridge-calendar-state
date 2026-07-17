# Installation

After npm publication:

```sh
npm install -g homebridge-calendar-state@alpha
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
