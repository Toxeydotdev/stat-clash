# Playwright Guidance

Follow the root `AGENTS.md` and `docs/testing.md`.

- Exercise the real web and API processes configured in `playwright.config.mts`.
- Write journeys in user language and verify outcomes a user can observe.
- Prefer `getByRole`, `getByLabel`, and `getByText`; use a test ID only when no stable user-facing identity exists and document why.
- Use web-first `expect` assertions. Never add fixed sleeps or manual polling loops.
- Keep tests isolated and safe for parallel execution. Deterministic seeded data may be shared only when tests do not mutate it.
- Use a local SIFERS `setup(page, options?)` for scenario-specific navigation and return only meaningful locators/domain state.
- Use Playwright fixtures for reusable infrastructure and teardown ownership, not hidden scenario behavior.
- Every critical responsive flow must run in both configured desktop and mobile projects unless a documented device-specific exclusion applies.
