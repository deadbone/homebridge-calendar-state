# Dépannage

## Aucun accessoire

Vérifiez que la plateforme s’appelle `CalendarState` et qu’au moins une option `expose` est active.

## Mauvais jour

Vérifiez `timezone`. Utilisez une valeur IANA comme `Europe/Paris`.

## Automatisations peu pratiques

Essayez `exposeAs: "switch"` si Maison gère mieux les conditions d’interrupteurs.

## Exception de date undefined

Si Homebridge affiche `Date override entries must include a date using YYYY-MM-DD`, supprimez la ligne d’exception partiellement remplie ou renseignez son champ `date`. Les lignes vides créées par Homebridge UI sont ignorées par le plugin.

## Sécurité

- Aucun service cloud n’est utilisé.
- Aucune télémétrie, analytics ou tracking n’est inclus.
- Le plugin ne récupère pas de calendriers distants ni de flux de jours fériés.
- Les règles calendaires sont évaluées localement depuis la configuration Homebridge.
- Aucune clé API, aucun identifiant et aucune donnée de calendrier personnel ne sont requis.
- Aucun script post-install ne modifie le système utilisateur.
