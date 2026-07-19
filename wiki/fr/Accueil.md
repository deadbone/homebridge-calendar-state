# Accueil

`homebridge-calendar-state` expose des états calendaires locaux dans HomeKit via Homebridge.

Le plugin expose des capteurs d’occupation en lecture seule pour les règles comme week-end, jour de semaine, jour travaillé, jour off, télétravail, bureau, jours nommés, saisons, premier/dernier jour du mois et dates spéciales.

Il expose aussi un switch optionnel `Vacation Mode`. Quand ce switch est actif, le jour courant se comporte comme un jour off et les capteurs liés au travail passent à faux, ce qui permet d’ignorer facilement les automatisations de jours travaillés pendant les congés.

Ce plugin ne lit pas de calendriers distants. C’est volontaire : il privilégie des règles locales déterministes sans appels réseau inutiles.

## Idées à venir

Ces idées sont notées pour discussion ultérieure et ne sont pas encore développées :

- `holidayRanges` : plages de dates pour congés ou périodes exceptionnelles longues.
- Capteurs orientés demain, comme `Is Tomorrow Working Day` ou `Is Tomorrow Day Off`, pour les automatisations de préparation du soir.
