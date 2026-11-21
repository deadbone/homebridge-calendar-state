# Installation

# Compatibilité

- Homebridge : `^1.8.0 || ^2.0.0`
- Node.js : `^22.12.0 || ^24.0.0 || ^26.0.0`. Node.js 26 nécessite Homebridge 2.5.0 ou une version ultérieure.
- Type de plugin : plateforme dynamique
- Format de module : CommonJS


Après publication npm :

```sh
npm install -g homebridge-calendar-state@latest
```

Ajoutez ensuite la plateforme `CalendarState` dans Homebridge UI ou `config.json`.

## Développement local

```sh
npm install
npm run build
npm link
homebridge -D -U ~/.homebridge-dev
```
