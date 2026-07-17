# Development

```sh
npm install
npm run build
npm test
npm run lint
```

Calendar logic is isolated in `src/calendar-state.ts`. Homebridge integration is in `src/platform.ts` and `src/platformAccessory.ts`.

Do not add telemetry, unnecessary network calls, or post-install system changes.
