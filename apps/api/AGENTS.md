# API Guidance

Follow the root `AGENTS.md` and these Nest-specific rules.

## Boundaries

- Keep controllers thin and explicit about routes and transport types.
- Put comparison assembly, normalization, and provider behavior behind injectable services.
- Share browser-facing payload types through `@stat-clash/contracts`.
- Validate all future untrusted request/provider data at runtime before mapping it to shared contracts.

## Data Trust

- Seeded data must remain deterministic and labeled `kind: 'exhibition'` with visible provenance.
- A live provider adapter requires an OpenSpec change and must not silently fall back to exhibition values.
- Preserve raw source timestamps and distinguish provider capture time from server response time.
- Do not log credentials, provider tokens, private identifiers, or full third-party payloads.

## Tests

- Prefer real service/controller instances when no external boundary exists.
- Use a Nest HTTP test or Playwright when route wiring, serialization, middleware, or status codes are the behavior under test.
- Mock only external provider/repository boundaries. Configure those mocks inside an explicitly called SIFERS `setup()` helper and return the handles needed for assertions.
- Keep `/api/health` fast and deterministic so Playwright can use it for readiness.
