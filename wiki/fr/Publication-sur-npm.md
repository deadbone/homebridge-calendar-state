# Publication sur npm

Ne publiez pas sans décision explicite.

La publication utilise GitHub Actions Trusted Publishing. Ne créez pas de token npm et ne configurez pas `NODE_AUTH_TOKEN`.

Configurez les paramètres du package sur npmjs.com > Trusted Publishing > GitHub Actions avec :

- Organization or user: `deadbone`
- Repository: `homebridge-calendar-state`
- Workflow filename: `publish.yml`
- Allowed actions: `npm publish`
- Environment name: laisser vide

Exécutez les vérifications localement avant d'ouvrir une PR de release :

```sh
npm run build
npm test
npm run lint
npm --cache .npm-cache pack --dry-run
```

Ouvrez une pull request interne vers `main`. Le workflow de publication valide le projet avec `npm ci`, lint, build, tests et vérification du paquet, puis publie une beta avec le tag npm `beta` :

```sh
npm install -g homebridge-calendar-state@beta
```

Les versions beta exactes utilisent :

```text
<next-patch>-beta.pr.<PR_NUMBER>.<RUN_NUMBER>.<RUN_ATTEMPT>
```

Exemple :

```sh
npm install -g homebridge-calendar-state@0.1.1-beta.pr.2.5.1
```

La publication beta ne s'exécute que pour les PR dont la branche est dans `deadbone/homebridge-calendar-state`, pas pour les forks. Le workflow doit deja exister dans `main` ou dans la branche de la PR avant qu'une PR puisse publier sa propre beta.

Quand la PR est mergée dans `main`, le workflow valide le projet fusionné, exécute `npm version patch -m "chore: release v%s [skip ci]"`, pousse le commit de release et le tag, publie la version stable avec le tag npm `latest` par défaut, puis crée la GitHub Release latest avec les notes générées.

Installer la version stable :

```sh
npm install -g homebridge-calendar-state@latest
```

Si une version stable existe deja dans `package.json` et doit seulement etre publiee via Trusted Publishing, lancez manuellement le workflow `Publish to npm` depuis GitHub Actions.
