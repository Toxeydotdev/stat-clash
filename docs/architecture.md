# Architecture

## System Context

Stat Clash currently serves one deterministic exhibition matchup. It proves the complete product seam without collecting live player data.

```text
Browser
  |
  | GET /api/comparisons/featured
  v
React + Vite (apps/web)
  |
  | shared FeaturedComparison contract
  v
NestJS (apps/api)
  |
  v
Seeded exhibition fixture
```

Vite proxies `/api` to Nest on `localhost:3333` during local development and Playwright. Netlify preserves the same relative path in production by rewriting `/api/*` to a serverless entry for the same Nest application.

## Deployment Context

```text
Netlify CDN
  |-- static request --> dist/apps/web
  `-- /api/* ---------> Netlify Function
                              |
                              v
                        Express adapter
                              |
                              v
                        Nest AppModule
```

The standalone API and Netlify function share global application configuration. Webpack compiles the function entry with TypeScript so Nest decorator metadata is retained; Netlify then packages a thin modern-runtime wrapper. See [`deployment.md`](deployment.md) for build and connection details.

## Nx Projects

| Project     | Type            | Purpose                                        |
| ----------- | --------------- | ---------------------------------------------- |
| `web`       | application     | React product experience and HTTP client state |
| `api`       | application     | Nest routes and comparison assembly            |
| `web-e2e`   | e2e application | Real-process Playwright journeys               |
| `ui`        | library         | Tailwind/Radix product primitives              |
| `contracts` | library         | Serializable browser/API boundary types        |
| `workspace` | root project    | Cached repository-wide Oxc and OpenSpec checks |

## Request Flow

1. The browser requests `/api/comparisons/featured`.
2. Vite proxies the request to `http://localhost:3333` locally, or Netlify rewrites it to the API function in production.
3. `AppController` delegates to `AppService`.
4. The service returns a `FeaturedComparison` with `kind: 'exhibition'` and provenance.
5. React renders explicit loading, error/retry, and success states.
6. Metric score and arena orientation are presentation derivations; swapping corners does not mutate source data.

`GET /api/health` is a lightweight readiness endpoint used by Playwright before browser tests start.

## Trust Boundaries

The seeded fixture is owned and deterministic, so it is typed directly. The first live provider will introduce an untrusted JSON boundary and must add runtime validation before creating a `FeaturedComparison`.

Types in `libs/shared/contracts` guarantee compile-time agreement between owned code only. They do not establish provider authenticity, account ownership, freshness, or comparison fairness.

## Intended Evolution

Provider work is deliberately deferred. Before adding it, an OpenSpec change must decide:

- supported game, platform, and provider;
- account ownership and consent;
- token and secret handling;
- freshness, caching, rate limits, and outage behavior;
- mode, season, platform, and sample-size normalization;
- public sharing, retention, deletion, and privacy controls.

Do not add persistence until a specified product behavior needs it. The current fixture has no migration or storage requirement.
