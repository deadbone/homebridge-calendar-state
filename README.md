# homebridge-calendar-state

![Calendar State icon](assets/icon.png)

`homebridge-calendar-state` is an alpha Homebridge dynamic platform plugin that exposes configurable calendar states in HomeKit.

It can create read-only virtual accessories for weekend, weekday, day off, working day, work from home day, office day, each weekday, first/last day of month, and named special dates.

> Alpha status: `0.1.0-alpha.0` is functional but early. It is not yet Verified by Homebridge.

## Installation

After the package is published:

```sh
npm install -g homebridge-calendar-state@alpha
```

For local development:

```sh
npm install
npm run build
npm link
homebridge -D -U ~/.homebridge-dev
```

## Homebridge UI Configuration

This plugin includes `config.schema.json`, so Homebridge UI can render the configuration form. Add a platform named `CalendarState`.

## Example Configuration

```json
{
  "platform": "CalendarState",
  "name": "Calendar State",
  "timezone": "Europe/Paris",
  "locale": "fr-FR",
  "exposeAs": "sensor",
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
    "specialDates": true
  }
}
```

## Options

- `timezone`: IANA timezone used for local day evaluation, for example `Europe/Paris`.
- `locale`: reserved for display-oriented future behavior.
- `exposeAs`: `sensor` creates occupancy sensors; `switch` creates read-only switches for easier HomeKit automations.
- `weekendDays`: days considered weekend. Saturday and Sunday are not assumed unless configured.
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
- Exact date overrides have priority over weekly rules.

## HomeKit Automation Examples

- If `Is Working Day` detects occupancy at 07:00, open blinds and start a weekday scene.
- If `Is Work From Home Day` detects occupancy, keep office heating enabled.
- If `Is Office Day` detects occupancy, turn off home office plugs after departure.
- If `Is Special Date: Christmas` detects occupancy, run a holiday lighting scene.

## Known Limits

- This alpha does not fetch public holidays from remote calendars.
- Special dates are recurring month/day dates; one-off changes belong in `dateOverrides`.
- Sensor wording in Apple Home depends on the service type. Use `switch` mode if HomeKit automation conditions are easier.

## Similar Plugins

Existing plugins such as `homebridge-calendar-scheduler`, `homebridge-calendar-tempfix`, and `homebridge-daily-sensors` can trigger HomeKit accessories from iCal, webcal, or CalDAV events. `homebridge-calendar-state` has a different goal: it models local, deterministic day-state rules without requiring a remote calendar feed or network access.

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

1. Create or choose the package name. The suggested name is `homebridge-calendar-state`.
2. Check availability:

   ```sh
   npm view homebridge-calendar-state
   ```

3. Log in:

   ```sh
   npm login
   ```

4. Verify `package.json`, especially `name`, `version`, `description`, `keywords`, `engines`, `main`, `types`, `files`, `repository`, and `bugs`.
5. Run checks:

   ```sh
   npm run build
   npm test
   npm run lint
   npm pack --dry-run
   ```

6. Publish the alpha:

   ```sh
   npm publish --tag alpha
   ```

7. Install the alpha:

   ```sh
   npm install -g homebridge-calendar-state@alpha
   ```

8. Later, release stable by publishing a non-alpha semver version with the default `latest` tag.

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

`homebridge-calendar-state` est un plugin Homebridge dynamique en version alpha qui expose dans HomeKit des états calendaires configurables.

Il peut créer des accessoires virtuels en lecture seule pour week-end, jour de semaine, jour off, jour travaillé, télétravail, bureau, chaque jour de la semaine, premier/dernier jour du mois, et dates spéciales nommées.

> État alpha : `0.1.0-alpha.0` est fonctionnel mais préliminaire. Le plugin n’est pas encore validé Homebridge.

## Installation

Après publication du package :

```sh
npm install -g homebridge-calendar-state@alpha
```

Pour le développement local :

```sh
npm install
npm run build
npm link
homebridge -D -U ~/.homebridge-dev
```

## Configuration Homebridge UI

Le plugin inclut `config.schema.json`, ce qui permet à Homebridge UI d’afficher un formulaire de configuration. Ajoutez une plateforme nommée `CalendarState`.

## Exemple de configuration

Voir l’exemple JSON de la section anglaise ; les mêmes champs s’appliquent.

## Options

- `timezone` : fuseau IANA utilisé pour calculer le jour local, par exemple `Europe/Paris`.
- `locale` : réservé pour de futurs comportements d’affichage.
- `exposeAs` : `sensor` crée des capteurs d’occupation ; `switch` crée des interrupteurs en lecture seule, parfois plus pratiques pour les automatisations HomeKit.
- `weekendDays` : jours considérés comme week-end. Samedi/dimanche ne sont pas supposés sans configuration.
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
- Les exceptions par date ont priorité sur les règles hebdomadaires.

## Exemples d’automatisations HomeKit

- Si `Is Working Day` est actif à 07:00, ouvrir les volets et lancer la scène du matin.
- Si `Is Work From Home Day` est actif, garder le chauffage du bureau allumé.
- Si `Is Office Day` est actif, couper les prises du bureau à domicile après le départ.
- Si `Is Special Date: Christmas` est actif, lancer une scène lumineuse de fête.

## Limites connues

- L’alpha ne récupère pas les jours fériés depuis des calendriers distants.
- Les dates spéciales sont récurrentes au format mois/jour ; les changements ponctuels passent par `dateOverrides`.
- Le libellé dans Apple Maison dépend du type de service. Utilisez `switch` si les conditions d’automatisation sont plus simples ainsi.

## Plugins similaires

Des plugins comme `homebridge-calendar-scheduler`, `homebridge-calendar-tempfix` et `homebridge-daily-sensors` peuvent déclencher des accessoires HomeKit depuis des événements iCal, webcal ou CalDAV. `homebridge-calendar-state` vise autre chose : modéliser des états de journée locaux et déterministes sans flux calendrier distant ni accès réseau.

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
2. Create the first wiki page once in the GitHub web UI if the hidden `.wiki.git` repository does not exist yet.
3. Publish or update the wiki from this repository:

   ```sh
   scripts/publish-wiki.sh deadbone/homebridge-calendar-state
   ```

4. Keep wiki pages synchronized with README and `config.schema.json`.

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
2. Créer une première page wiki une seule fois dans l’interface GitHub si le dépôt caché `.wiki.git` n’existe pas encore.
3. Publier ou mettre à jour le wiki depuis ce dépôt :

   ```sh
   scripts/publish-wiki.sh deadbone/homebridge-calendar-state
   ```

4. Garder les pages synchronisées avec le README et `config.schema.json`.
