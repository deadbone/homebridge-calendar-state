# Configuration

Le plugin fournit `config.schema.json` pour Homebridge UI.

```json
{
  "platform": "CalendarState",
  "name": "Homebridge Calendar State",
  "timezone": "Europe/Paris",
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
  "officeDays": ["tuesday", "thursday"]
}
```

Options principales :

- `timezone` : fuseau IANA pour évaluer la date locale.
- `vacationMode` : switch HomeKit optionnel et persistant. Quand il est actif, le jour courant devient off et les capteurs liés au travail passent à faux.
- `seasons` : active les capteurs de saisons météorologiques et choisit l’hémisphère `northern` ou `southern`.
- `weekendDays` : jours de week-end configurables.
- `daysOff` : jours off hebdomadaires.
- `workFromHomeDays` : jours de télétravail réguliers.
- `officeDays` : jours au bureau réguliers.
- `specialDates` : dates spéciales récurrentes au format `MM-DD`.
- `dateOverrides` : exceptions exactes au format `YYYY-MM-DD`.
- `expose` : active ou désactive les groupes d’accessoires, y compris les saisons.
