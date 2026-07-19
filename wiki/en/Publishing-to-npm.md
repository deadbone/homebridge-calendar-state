# Publishing to npm

Do not publish without an explicit release decision.

Publishing uses GitHub Actions Trusted Publishing. Do not create an npm token and do not configure `NODE_AUTH_TOKEN`.

Configure npmjs.com package settings > Trusted Publishing > GitHub Actions with:

- Organization or user: `deadbone`
- Repository: `homebridge-calendar-state`
- Workflow filename: `publish.yml`
- Allowed actions: `npm publish`
- Environment name: leave empty

```sh
npm run build
npm test
npm run lint
npm --cache .npm-cache pack --dry-run
VERSION=$(node -p "require('./package.json').version")
git tag "v$VERSION"
git push origin main
git push origin "v$VERSION"
```

The publish workflow runs only for tags matching `v*`, verifies that the tag exactly matches `package.json.version`, and publishes with `npm publish` through npm OIDC trusted publishing.

Install the alpha:

```sh
npm install -g homebridge-calendar-state@alpha
```

For stable, publish a non-prerelease semver version with the default `latest` tag.
