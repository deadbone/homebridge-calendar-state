# Dépannage

## Aucun accessoire

Vérifiez que la plateforme s’appelle `CalendarState` et qu’au moins une option `expose` est active.

## Mauvais jour

Vérifiez `timezone`. Utilisez une valeur IANA comme `Europe/Paris`.

## Automatisations peu pratiques

Essayez `exposeAs: "switch"` si Maison gère mieux les conditions d’interrupteurs.

## Exception de date undefined

Si Homebridge affiche `Date override entries must include a date using YYYY-MM-DD`, supprimez la ligne d’exception partiellement remplie ou renseignez son champ `date`. Les lignes vides créées par Homebridge UI sont ignorées par le plugin.
