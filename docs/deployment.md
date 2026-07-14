# Netlify Deployment

## Deployment Shape

Stat Clash deploys as one Netlify site:

```text
Browser
  |
  | static files
  v
Netlify CDN --------> dist/apps/web
  |
  | /api/* rewrite
  v
Netlify Function --> Express adapter --> Nest controllers and services
```

The browser continues to request relative `/api` URLs. Netlify routes those requests to the serverless Nest entry point on the same origin, so deployment does not require a browser API URL or CORS configuration.

## File-Based Configuration

`netlify.toml` is authoritative for the site:

| Setting             | Value                 |
| ------------------- | --------------------- |
| Base directory      | Repository root (`.`) |
| Build command       | `npm run build`       |
| Publish directory   | `dist/apps/web`       |
| Functions directory | `netlify/functions`   |
| Node                | `24.14.0`             |
| npm                 | `11.9.0`              |

The forced `/api/*` rewrite must remain before the non-forced `/*` SPA fallback. This ordering keeps API misses inside Nest instead of returning `index.html`. Hashed files below `/assets` receive a one-year immutable cache header in deployed environments.

## Function Build

The API production build has two Webpack entries:

- `dist/apps/api/main.js` starts the standalone process used by local development and Playwright.
- `dist/apps/api/netlify.js` exports the serverless handler consumed by `netlify/functions/api.mjs`.

Both entries use the TypeScript-backed Nx Webpack build. This is required because Nest dependency injection relies on `emitDecoratorMetadata`, which Netlify's esbuild function bundler does not emit from TypeScript source. The thin `.mjs` function wraps the already compiled handler with `@netlify/aws-lambda-compat`, placing `serverless-http` on Netlify's modern Functions runtime.

Do not commit `dist`. Netlify runs the production build before packaging functions, so the generated handler exists when the function bundler resolves it.

## Connect The Site

1. Push this repository to its Git provider.
2. In Netlify, choose **Add new project** and import the repository.
3. If Netlify presents the Nx monorepo picker, select `web`.
4. Keep the repository root as the base; Netlify reads build, publish, function, and runtime settings from `netlify.toml`.
5. Deploy without environment variables. The current exhibition build has no secrets.
6. Verify `/`, `/api/health`, and `/api/comparisons/featured` on the deploy URL before promoting a deploy preview.

Netlify should report `dist/apps/web` as the publish directory and package `api.mjs` as a function. Do not replace the file-based settings with conflicting dashboard values.

## Local Parity Check

The complete repository gate already type-checks and tests the adapter and emits both API entries:

```sh
npm run check
```

For a Netlify-specific build, use the pinned CLI version. The `web` filter avoids an interactive Nx monorepo prompt:

```sh
npx --yes netlify-cli@26.2.0 build --offline --filter web
```

After a build, the production files and rewrites can be served through Netlify Dev. Pass an absolute publish-directory path because the CLI resolves relative paths from the selected monorepo package:

```sh
npx --yes netlify-cli@26.2.0 dev --offline --filter web --dir <absolute-path-to-dist/apps/web> --framework "#static"
```

Then check:

- `/` returns the Vite application shell;
- a non-API browser route falls back to `index.html`;
- `/api/health` returns the health contract;
- `/api/comparisons/featured` returns `kind: "exhibition"`;
- an unknown `/api/*` path returns a JSON Nest 404.

Netlify Dev disables long-lived browser caching, so its local `Cache-Control` header does not prove the production asset-cache rule.

## Operational Notes

- Function instances can cold start. The adapter caches Nest initialization for warm invocations.
- `/api/health` remains independent of optional downstream services.
- Function logs must not contain provider credentials, access tokens, private identifiers, or raw provider payloads when live integrations are added later.
- A future provider, database, region choice, or secret requires its own reviewed OpenSpec change before changing this deployment shape.
