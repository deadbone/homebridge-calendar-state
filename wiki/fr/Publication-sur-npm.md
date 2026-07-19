# Publication sur npm

Ne publiez pas sans décision explicite.

La publication utilise GitHub Actions Trusted Publishing. Ne créez pas de token npm et ne configurez pas `NODE_AUTH_TOKEN`.

Configurez les paramètres du package sur npmjs.com > Trusted Publishing > GitHub Actions avec :

- Organization or user: `deadbone`
- Repository: `homebridge-calendar-state`
- Workflow filename: `publish.yml`
- Allowed actions: `npm publish`
- Environment name: laisser vide

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

Le workflow de publication s'exécute uniquement pour les tags `v*`, vérifie que le tag correspond exactement à `package.json.version`, puis publie avec `npm publish` via npm OIDC trusted publishing.

Installer l’alpha :

```sh
npm install -g homebridge-calendar-state@alpha
```

Pour une version stable, publier une version semver non prérelease avec le tag `latest`.
