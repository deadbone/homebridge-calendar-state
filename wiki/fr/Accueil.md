# homebridge-calendar-state Wiki

## Francais

`homebridge-calendar-state` expose des états calendaires locaux dans HomeKit via Homebridge.

Le plugin expose des capteurs d’occupation en lecture seule pour les règles comme week-end, jour de semaine, jour travaillé, jour off, télétravail, bureau, jours nommés, saisons, premier/dernier jour du mois et dates spéciales.

Il expose aussi un switch optionnel `Vacation Mode`. Quand ce switch est actif, le jour courant se comporte comme un jour off et les capteurs liés au travail passent à faux, ce qui permet d’ignorer facilement les automatisations de jours travaillés pendant les congés.

Ce plugin ne lit pas de calendriers distants. C’est volontaire : il privilégie des règles locales déterministes sans appels réseau inutiles.

### Pages

- [Installation](Installation.md)
- [Configuration](Configuration.md)
- [Logique calendrier](Logique-calendrier.md)
- [Dates speciales et exceptions](Dates-speciales-et-exceptions.md)
- [Exemples d'automatisations HomeKit](Exemples-automatisations-HomeKit.md)
- [Depannage](Depannage.md)
- [Developpement](Developpement.md)
- [Publication sur npm](Publication-sur-npm.md)
- [Checklist validation Homebridge](Checklist-validation-Homebridge.md)
- [FAQ](FAQ.md)

### Compatibilite

- Homebridge `^1.8.0 || ^2.0.0`.
- Node.js `^22.12.0 || ^24.0.0`.
- Type de plugin : plateforme dynamique.
- Format de module : CommonJS.

### Perimetre

Le plugin se concentre sur l'evaluation locale de regles deterministes. Il ne recupere pas de calendriers distants, de flux de jours feries ou de donnees de calendrier personnel, et n'inclut pas de telemetrie.

### Preparation aux plugins scopes

Le paquet npm actuel est `homebridge-calendar-state`.

Si l'equipe Homebridge accepte plus tard le plugin dans le programme des plugins scopes, le paquet scope serait `@homebridge-plugins/homebridge-calendar-state`. Le plugin conserve des UUID HomeKit stables bases sur les identifiants de definitions d'etats afin que cette future migration puisse preserver les accessoires HomeKit existants lorsque la procedure de migration scoped de Homebridge est respectee.

### Idees a venir

Ces idées sont notées pour discussion ultérieure et ne sont pas encore développées :

- `holidayRanges` : plages de dates pour congés ou périodes exceptionnelles longues.
- Capteurs orientés demain, comme `Is Tomorrow Working Day` ou `Is Tomorrow Day Off`, pour les automatisations de préparation du soir.
