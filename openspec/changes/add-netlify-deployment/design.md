## Context

The web application already requests relative `/api` URLs, while local Vite proxies those requests to a standalone Nest process. Netlify serves static assets directly but does not run a persistent Node server, so production needs a serverless entry point without creating a second API implementation.

Nest relies on TypeScript decorator metadata for dependency injection. Netlify's function bundler uses esbuild, which does not emit `emitDecoratorMetadata` when compiling TypeScript source. The deploy build therefore needs to consume API JavaScript compiled by the existing TypeScript-backed Webpack build rather than asking esbuild to compile the Nest source directly.

## Goals / Non-Goals

**Goals:**

- Deploy the Vite site and current Nest routes under one Netlify origin.
- Preserve `/api/health` and `/api/comparisons/featured` behavior in local and serverless runtimes.
- Keep deployment inputs reproducible from the committed lockfile and Netlify configuration.
- Include the serverless entry point in normal type checks and production builds.

**Non-Goals:**

- Adding a live game provider, authentication, persistence, or secrets.
- Changing the comparison contract or visual experience.
- Adding a second API implementation specifically for Netlify.
- Automatically creating or publishing a Netlify site from CI.

## Decisions

### Static web plus one Nest function

Publish `dist/apps/web` through Netlify's CDN and rewrite `/api/*` to one API function. A single origin keeps the browser code environment-independent and avoids unnecessary CORS policy. Deploying the API to a separate host was rejected because it adds configuration and cross-origin behavior without a current scaling or ownership need.

### Adapt the existing Nest HTTP application

Create the Nest application on an Express adapter, initialize it without listening on a port, and pass that Express application to `serverless-http`. Cache the initialized handler for warm invocations. The standalone entry point continues to listen on `PORT`; both entry points share global Nest configuration so route behavior cannot drift.

Reimplementing the two routes as native Netlify handlers was rejected because it would bypass the required Nest HTTP boundary and create duplicate routing behavior.

### Compile Nest with the existing TypeScript-backed Webpack build

Add the serverless adapter as a secondary API build entry. A thin Netlify function wraps that compiled handler with `@netlify/aws-lambda-compat`, allowing `serverless-http` to run on Netlify's modern Functions runtime. This preserves emitted dependency-injection metadata. The generated handler leaves framework imports external, so Netlify configuration explicitly packages those modules and their dependency trees with the function.

Compiling the Nest source directly as a TypeScript Netlify function was rejected because esbuild does not support TypeScript's `emitDecoratorMetadata` output.

### File-based routing and SPA fallback

Keep routing explicit in `netlify.toml`: `/api/*` is a forced rewrite to the function and the final non-forced catch-all serves `index.html` for browser routes while allowing real static files to win. API failures and unknown API routes therefore cannot silently become HTML responses.

## Risks / Trade-offs

- [Nest cold starts add latency] -> Cache initialization for warm invocations and keep the current API dependency graph small.
- [Function and standalone setup could diverge] -> Centralize global Nest configuration and exercise the same controllers and services in both entry points.
- [Generated API JavaScript could be missing during function bundling] -> Make the Netlify build command run the normal production build before Netlify packages functions.
- [Local function emulation can resolve undeclared workspace packages] -> Declare every generated handler external in `external_node_modules` and validate an isolated production deploy.
- [A broad SPA fallback could capture API traffic] -> Place a forced `/api/*` rewrite before the non-forced fallback and verify both API endpoints through Netlify's local runtime.
- [Netlify runtime support changes] -> Use the modern Functions runtime through the maintained Lambda compatibility adapter rather than the deprecated legacy handler mode.

## Migration Plan

Add the deployment configuration and adapter, run the complete local quality gate, then run a Netlify production build and exercise the built site locally. Connect the repository to a Netlify site only after these checks pass. Rollback removes the Netlify configuration, function wrapper, serverless entry, and adapter dependencies; no data migration or external state is involved.

## Open Questions

- Which Netlify team, site name, and custom domain should own the production deployment?
- Should deployment remain Netlify Git-based continuous delivery or later move behind an explicit release workflow?
