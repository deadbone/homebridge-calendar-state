# Logique calendrier

Le plugin évalue la date locale configurée au démarrage, à chaque lecture HomeKit, et au prochain minuit local.

Règles :

- Le week-end est défini uniquement par `weekendDays`.
- Le jour off est défini par `daysOff`, sauf exception exacte.
- Télétravail et bureau viennent des règles hebdomadaires, sauf exception exacte.
- Jour travaillé vaut vrai uniquement si le jour n’est ni week-end ni off.
- Les exceptions par date ont priorité sur les règles hebdomadaires.
