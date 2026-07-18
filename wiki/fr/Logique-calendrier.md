# Logique calendrier

Le plugin évalue la date locale configurée au démarrage, à chaque lecture HomeKit, quand `Vacation Mode` change, et au prochain minuit local.

Règles :

- Le week-end est défini uniquement par `weekendDays`.
- Le jour off est défini par `daysOff`, sauf exception exacte.
- Télétravail et bureau viennent des règles hebdomadaires, sauf exception exacte.
- Jour travaillé vaut vrai uniquement si le jour n’est ni week-end ni off.
- `Vacation Mode` a priorité à l’exécution pour les états liés au travail : jour off devient vrai, et jour travaillé, bureau et télétravail deviennent faux.
- Les saisons sont météorologiques : printemps de mars à mai, été de juin à août, automne de septembre à novembre, hiver de décembre à février dans l’hémisphère nord. L’hémisphère sud les inverse.
- Les exceptions par date ont priorité sur les règles hebdomadaires quand Vacation Mode est désactivé.
