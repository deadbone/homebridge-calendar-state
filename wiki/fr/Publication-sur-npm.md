# Publication sur npm

Ne publiez pas sans décision explicite.

```sh
npm login
npm run build
npm test
npm run lint
npm pack --dry-run
npm publish --tag alpha
```

Installer l’alpha :

```sh
npm install -g homebridge-calendar-state@alpha
```

Pour une version stable, publier une version semver non prérelease avec le tag `latest`.
