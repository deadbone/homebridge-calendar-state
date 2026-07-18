# Exemples d’automatisations HomeKit

- Quand `Is Working Day` est actif à 07:00, lancer la scène matin de semaine.
- Quand `Is Work From Home Day` est actif, garder le chauffage du bureau.
- Quand `Is Office Day` est actif, couper les prises du bureau à domicile après le départ.
- Quand `Is Special Date: Christmas` est actif, lancer une scène lumineuse de fête.
- Quand `Vacation Mode` est actif, ignorer les automatisations de jours travaillés pendant les congés.
- Quand `Is Summer` est actif, utiliser un réglage climat plus léger.

Les états calendaires sont des capteurs en lecture seule ; les apps HomeKit ne peuvent pas modifier leur état manuellement. `Vacation Mode` est volontairement un switch car c’est une dérogation manuelle.
