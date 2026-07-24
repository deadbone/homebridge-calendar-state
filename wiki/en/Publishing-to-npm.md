# Publishing to npm

Do not publish without an explicit release decision.

Publishing uses GitHub Actions Trusted Publishing. Do not create an npm token and do not configure `NODE_AUTH_TOKEN`.

Configure npmjs.com package settings > Trusted Publishing > GitHub Actions with:

- Organization or user: `deadbone`
- Repository: `homebridge-calendar-state`
- Workflow filename: `publish.yml`
- Allowed actions: `npm publish`
- Environment name: leave empty

Run checks locally before opening a release PR:

```sh
npm run build
npm test
npm run lint
npm --cache .npm-cache pack --dry-run
```

Open an internal pull request against `main`. The publish workflow validates the project with `npm ci`, lint, build, tests, and package verification, then publishes a beta package with the npm `beta` tag:

```sh
npm install -g homebridge-calendar-state@beta
```

Exact beta versions use:

```text
<next-patch>-beta.pr.<PR_NUMBER>.<RUN_NUMBER>.<RUN_ATTEMPT>
```

Example:

```sh
npm install -g homebridge-calendar-state@0.1.1-beta.pr.2.5.1
```

Beta publication only runs for PRs whose branch is inside `deadbone/homebridge-calendar-state`, not forks. The workflow must already exist in `main` or in the PR branch before a PR can publish its own beta.

When the PR is merged into `main`, the workflow validates the merged project, runs `npm version patch -m "chore: release v%s [skip ci]"`, pushes the release commit and tag, publishes the stable package with the default npm `latest` tag, and creates the latest GitHub Release with generated notes.

Install the stable release:

```sh
npm install -g homebridge-calendar-state@latest
```

If a stable version already exists in `package.json` and only needs to be published through Trusted Publishing, run the `Publish to npm` workflow manually from GitHub Actions. The manual workflow publishes npm, creates the matching `v<version>` git tag, and creates the latest GitHub Release.
