# Développement

```sh
npm install
npm run build
npm test
npm run lint
```

La logique calendrier est isolée dans `src/calendar-state.ts`. L’intégration Homebridge se trouve dans `src/platform.ts` et `src/platformAccessory.ts`.

N’ajoutez pas de télémétrie, appels réseau inutiles ou scripts post-install modifiant le système.
