#!/usr/bin/env bash
set -euo pipefail

REPO_SLUG="${1:-deadbone/homebridge-calendar-state}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK_DIR="${TMPDIR:-/tmp}/homebridge-calendar-state-wiki"
REMOTE_URL="https://github.com/${REPO_SLUG}.wiki.git"

if [[ ! -d "${ROOT_DIR}/wiki/en" || ! -d "${ROOT_DIR}/wiki/fr" ]]; then
  echo "wiki/en and wiki/fr must exist." >&2
  exit 1
fi

rm -rf "${WORK_DIR}"
if ! git clone "${REMOTE_URL}" "${WORK_DIR}"; then
  cat >&2 <<EOF
Unable to clone ${REMOTE_URL}.

GitHub creates the hidden .wiki.git repository only after the first wiki page
has been saved once in the GitHub web UI:

  https://github.com/${REPO_SLUG}/wiki

Create a minimal first page, then rerun:

  scripts/publish-wiki.sh ${REPO_SLUG}
EOF
  exit 1
fi

find "${WORK_DIR}" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +

cp "${ROOT_DIR}"/wiki/en/*.md "${WORK_DIR}/"
cp "${ROOT_DIR}/wiki/fr/Accueil.md" "${WORK_DIR}/FR-Accueil.md"
cp "${ROOT_DIR}/wiki/fr/Installation.md" "${WORK_DIR}/FR-Installation.md"
cp "${ROOT_DIR}/wiki/fr/Configuration.md" "${WORK_DIR}/FR-Configuration.md"
cp "${ROOT_DIR}/wiki/fr/Logique-calendrier.md" "${WORK_DIR}/FR-Logique-calendrier.md"
cp "${ROOT_DIR}/wiki/fr/Exemples-automatisations-HomeKit.md" "${WORK_DIR}/FR-Exemples-automatisations-HomeKit.md"
cp "${ROOT_DIR}/wiki/fr/Dates-speciales-et-exceptions.md" "${WORK_DIR}/FR-Dates-speciales-et-exceptions.md"
cp "${ROOT_DIR}/wiki/fr/Depannage.md" "${WORK_DIR}/FR-Depannage.md"
cp "${ROOT_DIR}/wiki/fr/Developpement.md" "${WORK_DIR}/FR-Developpement.md"
cp "${ROOT_DIR}/wiki/fr/Publication-sur-npm.md" "${WORK_DIR}/FR-Publication-sur-npm.md"
cp "${ROOT_DIR}/wiki/fr/Checklist-validation-Homebridge.md" "${WORK_DIR}/FR-Checklist-validation-Homebridge.md"
cp "${ROOT_DIR}/wiki/fr/FAQ.md" "${WORK_DIR}/FR-FAQ.md"

cat > "${WORK_DIR}/Home.md" <<'EOF'
# homebridge-calendar-state Wiki

`homebridge-calendar-state` exposes local, configurable calendar states in HomeKit through Homebridge.

This wiki is published from the repository `wiki/` folder. Keep these pages synchronized when configuration, behavior, installation, publishing, or verification guidance changes.

## English

- [Installation](Installation)
- [Configuration](Configuration)
- [Calendar Logic](Calendar-Logic)
- [HomeKit Automation Examples](HomeKit-Automation-Examples)
- [Special Dates and Overrides](Special-Dates-and-Overrides)
- [Troubleshooting](Troubleshooting)
- [Development](Development)
- [Publishing to npm](Publishing-to-npm)
- [Homebridge Verification Checklist](Homebridge-Verification-Checklist)
- [FAQ](FAQ)

## Français

- [Accueil](FR-Accueil)
- [Installation](FR-Installation)
- [Configuration](FR-Configuration)
- [Logique calendrier](FR-Logique-calendrier)
- [Exemples d'automatisations HomeKit](FR-Exemples-automatisations-HomeKit)
- [Dates spéciales et exceptions](FR-Dates-speciales-et-exceptions)
- [Dépannage](FR-Depannage)
- [Développement](FR-Developpement)
- [Publication sur npm](FR-Publication-sur-npm)
- [Checklist de validation Homebridge](FR-Checklist-validation-Homebridge)
- [FAQ](FR-FAQ)

## Alpha Status

Version `0.1.0-alpha.0` is not yet Verified by Homebridge and has not been published to npm.
EOF

(
  cd "${WORK_DIR}"
  git add .
  if git diff --cached --quiet; then
    echo "Wiki is already up to date."
    exit 0
  fi
  git commit -m "Update wiki pages"
  git push origin master
)
