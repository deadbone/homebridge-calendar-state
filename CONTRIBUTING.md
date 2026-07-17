# Contributing

Thanks for helping improve `homebridge-calendar-state`.

## Development

```sh
npm install
npm run build
npm test
npm run lint
```

Keep calendar rules in `src/calendar-state.ts` independent from Homebridge runtime code so they remain easy to test.

## Pull Requests

- Include tests for calendar logic changes.
- Update `README.md`, `config.schema.json`, and wiki pages when user-facing configuration changes.
- Do not add telemetry, tracking, analytics, or unnecessary network calls.
- Do not add post-install scripts that modify a user's system.

## Verification

This alpha is not yet Verified by Homebridge. Contributions should keep the project aligned with the official Homebridge Verified Plugin checklist.
