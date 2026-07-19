# homebridge-calendar-state

![Calendar State icon](assets/icon.png)

`homebridge-calendar-state` is a Homebridge dynamic platform plugin that exposes configurable calendar states in HomeKit.

It creates read-only virtual sensor accessories for weekend, weekday, day off, working day, work from home day, office day, each weekday, seasons, first/last day of month, and named special dates. It also exposes an optional `Vacation Mode` switch that can temporarily force day-off behavior from HomeKit.

> Current stable line: `0.1.x`. The plugin is not yet Verified by Homebridge.

## Compatibility

- Homebridge: `^1.8.0 || ^2.0.0`
- Node.js: `^22.12.0 || ^24.0.0`
- Plugin type: dynamic platform
- Module format: CommonJS
- Network behavior: local rule evaluation only, with no calendar fetching or telemetry

## Installation

### Homebridge UI

After the package is published to npm:

1. Open Homebridge UI.
2. Go to **Plugins**.
3. Search for `homebridge-calendar-state`.
4. Click **Install**.
5. Restart Homebridge.

### npm

After the package is published:

```sh
npm install -g homebridge-calendar-state@latest
```

### Local development install

For local development:

```sh
npm install
npm run build
npm link
homebridge -D -U ~/.homebridge-dev
```

## Homebridge UI Configuration

This plugin includes `config.schema.json`, so Homebridge UI can render the configuration form without a custom UI. Add a platform named `CalendarState`.

## Scoped Homebridge Plugin Compatibility

Homebridge scoped plugins use the npm organization `@homebridge-plugins/`. A future scoped package for this plugin would therefore be named:

```text
@homebridge-plugins/homebridge-calendar-state
```

Only the Homebridge collaborators team can initially publish packages under that scope. The current public package remains:

```text
homebridge-calendar-state
```

The plugin keeps stable accessory UUIDs based on the state definition IDs, not on a scoped package name. This is intended to make a future scoped migration safer for existing HomeKit accessories, rooms, scenes, and automations.


## Example Configuration

```json
{
  "platform": "CalendarState",
  "name": "Homebridge Calendar State",
  "timezone": "Europe/Paris",
  "locale": "fr-FR",
  "vacationMode": {
    "enabled": true,
    "name": "Vacation Mode"
  },
  "seasons": {
    "enabled": true,
    "hemisphere": "northern"
  },
  "weekendDays": ["saturday", "sunday"],
  "daysOff": ["wednesday"],
  "workFromHomeDays": ["monday", "friday"],
  "officeDays": ["tuesday", "thursday"],
  "specialDates": [
    { "name": "Christmas", "date": "12-25" },
    { "name": "Bastille Day", "date": "07-14" }
  ],
  "dateOverrides": [
    {
      "date": "2026-07-17",
      "dayOff": false,
      "workFromHome": true,
      "officeDay": false
    }
  ],
  "expose": {
    "weekend": true,
    "weekday": true,
    "dayOff": true,
    "workingDay": true,
    "workFromHome": true,
    "officeDay": true,
    "daysOfWeek": true,
    "firstDayOfMonth": true,
    "lastDayOfMonth": true,
    "specialDates": true,
    "seasons": true
  }
}
```

## Options

- `timezone`: IANA timezone used for local day evaluation, for example `Europe/Paris`.
- `locale`: reserved for display-oriented future behavior.
- `weekendDays`: days considered weekend. Saturday and Sunday are not assumed unless configured.
- `vacationMode`: exposes a persisted HomeKit switch. When on, the day is treated as day off and working, office, and work-from-home states are false.
- `seasons`: enables meteorological season sensors and selects the `northern` or `southern` hemisphere.
- `daysOff`: regular weekly days off.
- `workFromHomeDays`: regular weekly work from home days.
- `officeDays`: regular weekly office days.
- `specialDates`: named `MM-DD` dates exposed as `Is Special Date: <name>`.
- `dateOverrides`: exact `YYYY-MM-DD` overrides for day off, work from home, and office day.
- `expose`: toggles each accessory group.

## Calendar Logic

The plugin recalculates state at startup, whenever HomeKit reads a characteristic, and automatically at the next local midnight.

Rules:

- `weekendDays` defines weekend days.
- `daysOff` defines regular days off.
- `workFromHomeDays` defines regular work from home days.
- `officeDays` defines regular office days.
- `Is Working Day` is true only when the day is not weekend and not day off.
- `Vacation Mode` has runtime priority over weekly rules and date overrides for working, office, and work-from-home states.
- Seasons are meteorological: spring is March-May, summer is June-August, autumn is September-November, and winter is December-February in the northern hemisphere. The southern hemisphere inverts them.
- Exact date overrides have priority over weekly rules when Vacation Mode is off.

## HomeKit Automation Examples

- If `Is Working Day` detects occupancy at 07:00, open blinds and start a weekday scene.
- If `Is Work From Home Day` detects occupancy, keep office heating enabled.
- If `Is Office Day` detects occupancy, turn off home office plugs after departure.
- If `Is Special Date: Christmas` detects occupancy, run a holiday lighting scene.
- If `Vacation Mode` is on, skip workday automations that would normally trigger during leave.
- If `Is Summer` detects occupancy, use a lighter climate preset.


## Troubleshooting

`Date override entries must include a date using YYYY-MM-DD`: remove the partially filled override row in Homebridge UI or set its `date` field. Fully empty override rows are ignored, and the Homebridge UI schema does not require the empty add form to be completed.

Wrong day or state: verify `timezone` uses an IANA value such as `Europe/Paris`, then restart Homebridge.

No accessories appear: verify the platform is named `CalendarState` and at least one `expose` option is enabled.

## Security

- No cloud service is used.
- No telemetry, analytics, or tracking is included.
- The plugin does not fetch remote calendars or public-holiday feeds.
- Calendar rules are evaluated locally using the configured Homebridge settings.
- No API keys, credentials, or personal calendar data are required.
- No post-install script modifies the user's system.

## Known Limits

- The plugin does not fetch public holidays from remote calendars.
- Special dates are recurring month/day dates; one-off changes belong in `dateOverrides`.
- Calendar states are exposed as read-only occupancy sensors so users cannot manually change their state in HomeKit apps.
- `Vacation Mode` is intentionally exposed as a HomeKit switch because it is a manual override.

## Similar Plugins

Existing plugins such as `homebridge-calendar-scheduler`, `homebridge-calendar-tempfix`, and `homebridge-daily-sensors` can trigger HomeKit accessories from iCal, webcal, or CalDAV events. `homebridge-calendar-state` has a different goal: it models local, deterministic day-state rules without requiring a remote calendar feed or network access.

## Future Ideas

These ideas are documented for later discussion and are not implemented yet:

- `holidayRanges`: date ranges for vacations or longer exceptional periods.
- Tomorrow-oriented sensors, such as `Is Tomorrow Working Day` or `Is Tomorrow Day Off`, for evening preparation automations.

## Roadmap

- More HomeKit service-type options.
- Optional generated preview of upcoming state changes.
- Better validation messages in Homebridge UI.
- Homebridge verification request after wider testing.

## Development

```sh
npm install
npm run build
npm test
npm run lint
```

The calendar engine lives in `src/calendar-state.ts`; Homebridge integration lives in `src/platform.ts` and `src/platformAccessory.ts`.

## Publishing to npm

Do not publish without an explicit release decision.

Publishing is automated through GitHub Actions Trusted Publishing. Do not create an npm token and do not add `NODE_AUTH_TOKEN` to GitHub secrets.

1. Create or choose the package name. The suggested name is `homebridge-calendar-state`.
2. Check availability:

   ```sh
   npm view homebridge-calendar-state
   ```

3. On npmjs.com, open the package settings, choose **Trusted Publishing**, select **GitHub Actions**, and enter:

   - Organization or user: `deadbone`
   - Repository: `homebridge-calendar-state`
   - Workflow filename: `publish.yml`
   - Allowed actions: `npm publish`
   - Environment name: leave empty

4. Verify `package.json`, especially `name`, `version`, `description`, `keywords`, `engines`, `main`, `types`, `files`, `repository`, and `bugs`.
5. Run checks locally before opening a release PR:

   ```sh
   npm run build
   npm test
   npm run lint
   npm --cache .npm-cache pack --dry-run
   ```

6. Open an internal pull request against `main`. The `.github/workflows/publish.yml` workflow validates the project with `npm ci`, lint, build, tests, and package verification, then publishes a uniquely versioned beta package with the npm `beta` tag:

   ```sh
   npm install -g homebridge-calendar-state@beta
   ```

   Exact beta versions use:

   ```text
   <next-patch>-beta.pr.<PR_NUMBER>.<RUN_NUMBER>.<RUN_ATTEMPT>
   ```

   Example install:

   ```sh
   npm install -g homebridge-calendar-state@0.1.1-beta.pr.2.5.1
   ```

   Beta publication only runs for PRs whose branch is inside `deadbone/homebridge-calendar-state`, not forks. The beta workflow must already exist in `main` or in the PR branch before a PR can publish its own beta.

7. Merge the PR into `main` when ready. The same workflow validates the merged project, runs `npm version patch -m "chore: release v%s [skip ci]"`, pushes the release commit and tag, publishes the stable package with the default npm `latest` tag, and creates the latest GitHub Release with generated notes.

8. Install the stable release after the workflow publishes it:

   ```sh
   npm install -g homebridge-calendar-state@latest
   ```

If a stable version already exists in `package.json` and only needs to be published through Trusted Publishing, run the `Publish to npm` workflow manually from GitHub Actions.

## Homebridge Verification

This plugin is not yet Verified by Homebridge. Before applying:

- Publish the package to npm.
- Publish source on GitHub with issues enabled.
- Create GitHub releases with release notes.
- Keep the plugin as a dynamic platform.
- Keep `config.schema.json` working in Homebridge UI.
- Support current Homebridge Node.js LTS versions.
- Ensure install succeeds and the plugin does not start accessories unless configured.
- Avoid post-install system changes.
- Avoid telemetry, analytics, tracking, and unnecessary network calls.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).

---

# Documentation française

`homebridge-calendar-state` est un plugin Homebridge dynamique qui expose dans HomeKit des états calendaires configurables.

Il crée des accessoires virtuels de type capteur en lecture seule pour week-end, jour de semaine, jour off, jour travaillé, télétravail, bureau, chaque jour de la semaine, saisons, premier/dernier jour du mois, et dates spéciales nommées. Il expose aussi un switch optionnel `Vacation Mode` pour forcer temporairement le comportement jour off depuis HomeKit.

> Ligne stable actuelle : `0.1.x`. Le plugin n’est pas encore validé Homebridge.

## Compatibilité

- Homebridge : `^1.8.0 || ^2.0.0`
- Node.js : `^22.12.0 || ^24.0.0`
- Type de plugin : plateforme dynamique
- Format de module : CommonJS
- Comportement réseau : évaluation locale des règles uniquement, sans récupération de calendrier ni télémétrie

## Installation

### Homebridge UI

Une fois le paquet publié sur npm :

1. Ouvrez Homebridge UI.
2. Allez dans **Plugins**.
3. Recherchez `homebridge-calendar-state`.
4. Cliquez sur **Install**.
5. Redémarrez Homebridge.

### npm

Après publication du package :

```sh
npm install -g homebridge-calendar-state@latest
```

Pour le développement local :

```sh
npm install
npm run build
npm link
homebridge -D -U ~/.homebridge-dev
```

## Configuration Homebridge UI

Le plugin inclut `config.schema.json`, ce qui permet à Homebridge UI d’afficher un formulaire de configuration sans interface personnalisée. Ajoutez une plateforme nommée `CalendarState`.

## Compatibilité avec les plugins scopés Homebridge

Les plugins Homebridge scopés utilisent l’organisation npm `@homebridge-plugins/`. Un futur paquet scopé pour ce plugin s’appellerait donc :

```text
@homebridge-plugins/homebridge-calendar-state
```

Seule l’équipe de collaboration Homebridge peut publier initialement sous ce scope. Le paquet public actuel reste :

```text
homebridge-calendar-state
```

Le plugin conserve des UUID d’accessoires stables basés sur les identifiants d’états, pas sur le nom du paquet scopé. Cela vise à rendre une future migration plus sûre pour les accessoires, pièces, scènes et automatisations HomeKit existants.


## Exemple de configuration

Voir l’exemple JSON de la section anglaise ; les mêmes champs s’appliquent.

## Options

- `timezone` : fuseau IANA utilisé pour calculer le jour local, par exemple `Europe/Paris`.
- `locale` : réservé pour de futurs comportements d’affichage.
- `weekendDays` : jours considérés comme week-end. Samedi/dimanche ne sont pas supposés sans configuration.
- `vacationMode` : expose un switch HomeKit persistant. Quand il est actif, le jour devient off et les états jour travaillé, bureau et télétravail passent à faux.
- `seasons` : active les capteurs de saisons météorologiques et choisit l’hémisphère `northern` ou `southern`.
- `daysOff` : jours libres réguliers.
- `workFromHomeDays` : jours de télétravail réguliers.
- `officeDays` : jours au bureau réguliers.
- `specialDates` : dates nommées au format `MM-DD`, exposées comme `Is Special Date: <nom>`.
- `dateOverrides` : exceptions exactes au format `YYYY-MM-DD`.
- `expose` : active ou désactive les groupes d’accessoires.

## Logique calendrier

Le plugin recalcule les états au démarrage, à chaque lecture HomeKit, et automatiquement au prochain minuit local.

Règles :

- `weekendDays` définit les jours de week-end.
- `daysOff` définit les jours off réguliers.
- `workFromHomeDays` définit les jours de télétravail réguliers.
- `officeDays` définit les jours au bureau réguliers.
- `Is Working Day` vaut vrai uniquement si le jour n’est ni week-end ni off.
- `Vacation Mode` a priorité à l’exécution sur les règles hebdomadaires et exceptions pour les états jour travaillé, bureau et télétravail.
- Les saisons sont météorologiques : printemps de mars à mai, été de juin à août, automne de septembre à novembre, hiver de décembre à février dans l’hémisphère nord. L’hémisphère sud les inverse.
- Les exceptions par date ont priorité sur les règles hebdomadaires quand Vacation Mode est désactivé.

## Exemples d’automatisations HomeKit

- Si `Is Working Day` est actif à 07:00, ouvrir les volets et lancer la scène du matin.
- Si `Is Work From Home Day` est actif, garder le chauffage du bureau allumé.
- Si `Is Office Day` est actif, couper les prises du bureau à domicile après le départ.
- Si `Is Special Date: Christmas` est actif, lancer une scène lumineuse de fête.
- Si `Vacation Mode` est actif, ignorer les automatisations de jours travaillés pendant les congés.
- Si `Is Summer` est actif, utiliser un réglage climat plus léger.


## Dépannage

`Date override entries must include a date using YYYY-MM-DD` : supprimez la ligne d’exception partiellement remplie dans Homebridge UI ou renseignez son champ `date`. Les lignes entièrement vides sont ignorées, et le schéma Homebridge UI ne force pas la saisie du formulaire d’ajout vide.

Mauvais jour ou mauvais état : vérifiez que `timezone` utilise une valeur IANA comme `Europe/Paris`, puis redémarrez Homebridge.

Aucun accessoire n’apparaît : vérifiez que la plateforme s’appelle `CalendarState` et qu’au moins une option `expose` est activée.

## Sécurité

- Aucun service cloud n’est utilisé.
- Aucune télémétrie, analytics ou tracking n’est inclus.
- Le plugin ne récupère pas de calendriers distants ni de flux de jours fériés.
- Les règles calendaires sont évaluées localement à partir de la configuration Homebridge.
- Aucune clé API, aucun identifiant et aucune donnée de calendrier personnel ne sont requis.
- Aucun script post-install ne modifie le système utilisateur.

## Limites connues

- Le plugin ne récupère pas les jours fériés depuis des calendriers distants.
- Les dates spéciales sont récurrentes au format mois/jour ; les changements ponctuels passent par `dateOverrides`.
- Les états calendaires sont exposés comme capteurs d’occupation en lecture seule afin que les utilisateurs ne puissent pas modifier manuellement leur état dans les apps HomeKit.
- `Vacation Mode` est volontairement exposé comme switch HomeKit car c’est une dérogation manuelle.

## Plugins similaires

Des plugins comme `homebridge-calendar-scheduler`, `homebridge-calendar-tempfix` et `homebridge-daily-sensors` peuvent déclencher des accessoires HomeKit depuis des événements iCal, webcal ou CalDAV. `homebridge-calendar-state` vise autre chose : modéliser des états de journée locaux et déterministes sans flux calendrier distant ni accès réseau.

## Idées à venir

Ces idées sont notées pour discussion ultérieure et ne sont pas encore développées :

- `holidayRanges` : plages de dates pour congés ou périodes exceptionnelles longues.
- Capteurs orientés demain, comme `Is Tomorrow Working Day` ou `Is Tomorrow Day Off`, pour les automatisations de préparation du soir.

## Feuille de route

- Plus d’options de types de services HomeKit.
- Aperçu optionnel des prochains changements d’état.
- Messages de validation plus détaillés dans Homebridge UI.
- Demande de validation Homebridge après tests plus larges.

## Publication npm

Voir la section anglaise “Publishing to npm”. Ne publiez pas sans décision explicite de release.

## Contribution

Voir [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

MIT. Voir [LICENSE](LICENSE).

---

# Dedicated Wiki Section

The repository includes ready-to-copy GitHub wiki pages under `wiki/en/`:

- `Home.md`
- `Installation.md`
- `Configuration.md`
- `Calendar-Logic.md`
- `HomeKit-Automation-Examples.md`
- `Special-Dates-and-Overrides.md`
- `Troubleshooting.md`
- `Development.md`
- `Publishing-to-npm.md`
- `Homebridge-Verification-Checklist.md`
- `FAQ.md`

Suggested workflow:

1. Enable the GitHub wiki.
2. Keep the Markdown sources under `wiki/en/` and `wiki/fr/` synchronized with README and `config.schema.json`.
3. Update the GitHub wiki separately after wiki source changes by editing the GitHub wiki or by cloning `https://github.com/deadbone/homebridge-calendar-state.wiki.git`, copying the prepared Markdown pages, committing, and pushing the wiki repository.

---

# Section Wiki dédiée

Le dépôt inclut des pages wiki prêtes à copier sous `wiki/fr/` :

- `Accueil.md`
- `Installation.md`
- `Configuration.md`
- `Logique-calendrier.md`
- `Exemples-automatisations-HomeKit.md`
- `Dates-speciales-et-exceptions.md`
- `Depannage.md`
- `Developpement.md`
- `Publication-sur-npm.md`
- `Checklist-validation-Homebridge.md`
- `FAQ.md`

Flux conseillé :

1. Activer le wiki GitHub.
2. Garder les sources Markdown sous `wiki/en/` et `wiki/fr/` synchronisées avec le README et `config.schema.json`.
3. Mettre à jour le wiki GitHub séparément après modification des sources wiki, soit depuis l’interface GitHub, soit en clonant `https://github.com/deadbone/homebridge-calendar-state.wiki.git`, en copiant les pages Markdown préparées, puis en commitant et poussant le dépôt wiki.
