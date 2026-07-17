# Publishing to npm

Do not publish without an explicit release decision.

```sh
npm login
npm run build
npm test
npm run lint
npm pack --dry-run
npm publish --tag alpha
```

Install the alpha:

```sh
npm install -g homebridge-calendar-state@alpha
```

For stable, publish a non-prerelease semver version with the default `latest` tag.
