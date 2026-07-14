# Quality And Determinism

## Supported Environment

- Node: `24.14.0` from `.nvmrc` and `devEngines`.
- npm: `11.9.0` from `packageManager` and `devEngines`.
- Install: `npm ci` for existing lockfiles; exact versions are the default for intentional additions.

`package-lock.json` is part of the build input and must be committed. Do not use `npm audit fix --force`; investigate and upgrade the owning dependency intentionally.

## Commands

| Command                | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Run `api` and `web` serve targets in parallel  |
| `npm run format`       | Rewrite supported files with oxfmt             |
| `npm run format:check` | Cached repository formatting check             |
| `npm run lint`         | Cached oxlint scan with warnings denied        |
| `npm run typecheck`    | Run all inferred Nx TypeScript checks          |
| `npm test`             | Run all Jest/Vitest project tests              |
| `npm run build`        | Build every buildable project                  |
| `npm run spec:check`   | Strictly validate all OpenSpec artifacts       |
| `npm run e2e`          | Run real-process Playwright projects           |
| `npm run check:quick`  | Format, lint, typecheck, unit tests, and specs |
| `npm run check`        | Complete merge gate, including builds and E2E  |
| `npm run audit:prod`   | Network-dependent production dependency audit  |

The production audit is intentionally outside `npm run check` because advisory data changes independently of a commit and is not deterministic. Run it during dependency review and scheduled maintenance.

The API production build emits both the standalone Node entry and the generated input for the Netlify Function. A Netlify-specific parity build can additionally be run with `npx --yes netlify-cli@26.2.0 build --offline --filter web`; it is outside the deterministic gate because the CLI is an external deployment tool rather than a locked workspace dependency. See [`deployment.md`](deployment.md).

## Nx Cache

Build, test, and typecheck use Nx project inputs. Root `workspace` targets cache oxlint, oxfmt check, and OpenSpec validation once rather than scanning the complete repository once per project.

If a task produces a false cache hit, fix its declared inputs before disabling caching. Use `nx reset` only to diagnose local cache/daemon state, not as a CI requirement.

## CI

`.github/workflows/ci.yml`:

1. checks out with read-only contents permission;
2. reads the Node version from `.nvmrc`;
3. installs the lockfile with `npm ci`;
4. installs the Chromium binary and OS dependencies;
5. runs `npm run check`;
6. cancels superseded runs on the same ref.

Playwright runs desktop and mobile Chromium. Cross-browser projects can be added when support requirements justify their runtime; do not imply support that CI does not verify.

## Dependency Updates

Dependabot groups Nx and testing updates weekly. Review migrations and generated changes, then run the complete gate. Keep Nx package versions aligned. New dependencies require a clear owner, use case, bundle/runtime consideration, and documentation impact review.
