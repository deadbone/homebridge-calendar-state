# Installation

Après publication npm :

```sh
npm install -g homebridge-calendar-state@alpha
```

Ajoutez ensuite la plateforme `CalendarState` dans Homebridge UI ou `config.json`.

## Développement local

```sh
npm install
npm run build
npm link
homebridge -D -U ~/.homebridge-dev
```
