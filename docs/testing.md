# Testing Philosophy

## Principle

Test the product through behavior users and external clients can observe. Prefer the highest practical real boundary, then add smaller tests only where they provide faster diagnosis or cover difficult states.

The current priority is:

1. Playwright for critical browser journeys across the real React and Nest processes.
2. HTTP/integration tests when route wiring or serialization needs focused coverage.
3. Component tests for reusable interaction/accessibility or difficult request states.
4. Unit tests for deterministic domain transformations and narrow service behavior.

This is not a quota pyramid. A test exists because it protects behavior at an appropriate boundary.

## User-Centered Tests

- Name tests in product language.
- Interact with role, label, and visible text.
- Assert visible result, accessible state, URL, persisted effect, or public response.
- Do not assert internal component state, private methods, exact class strings, or incidental DOM nesting.
- Use `userEvent` in Testing Library and web-first assertions in Playwright.
- Never use fixed sleeps. Readiness and assertions must wait on observable conditions.

## Minimal Mocks

Use real owned code by default. A mock is justified for an external provider, destructive operation, difficult failure boundary, clock/random source, or focused component request-state test.

Do not mock:

- a Nest service merely because the controller delegates to it;
- the API in the only test proving a browser/API flow;
- shared UI components inside feature tests;
- a response shape that is not also protected by a real boundary test.

When a component test replaces `fetch`, keep that mock at the HTTP boundary and use a real contract fixture. Playwright must still cover the normal real-process journey.

## SIFERS

SIFERS means **Simple Injectable Functions Explicitly Returning State**. It is an explicit arrangement pattern, not a replacement for Arrange/Act/Assert.

Use it when several tests share configurable setup:

```ts
interface SetupOptions {
  player?: string;
}

async function setup(page: Page, { player = 'NullByte' }: SetupOptions = {}) {
  await page.goto('/');

  return {
    player,
    leftChallenger: page.getByRole('article', { name: 'Left challenger' }),
  };
}

test('shows the left challenger', async ({ page }) => {
  // Arrange
  const { leftChallenger, player } = await setup(page);

  // Act is page load performed as an explicit setup precondition.

  // Assert
  await expect(leftChallenger).toContainText(player);
});
```

Rules:

- Call `setup()` in each test. Do not hide scenario arrangement in `beforeEach`.
- Accept a typed options object with domain defaults; avoid positional booleans.
- Create fresh mutable state and test doubles per invocation.
- Inject overrides before constructing, rendering, or navigating when initialization consumes them.
- Return only meaningful domain state, user drivers, locators, or public handles.
- Keep the behavior under test and assertions outside the helper.
- Inline setup that is already trivial; a helper should remove obscurity, not add indirection.
- Use Playwright fixtures, not returned ad hoc callbacks, when infrastructure owns teardown.

Lifecycle cleanup such as restoring globals or automatic Testing Library cleanup may remain in hooks because it is not hidden scenario arrangement.

## Current Coverage

- `apps/web-e2e`: seeded matchup visibility, corner swap, browser fallback routing, API boundary behavior, and deployment-only CDN caching in desktop and mobile Chromium.
- `apps/web`: focused render/request behavior with only the HTTP boundary replaced.
- `libs/ui`: user activation and accessible metric output.
- `apps/api`: deterministic controller/service outputs using real instances.

Add an HTTP-level Nest test when route status codes, middleware, serialization, or validation become more complex than the browser journey proves clearly.

The normal `npm run e2e` target starts owned local processes. `npm run check:deployment` sets deployment mode, starts no local servers, disables Nx caching, and runs the same product journeys plus CDN-only assertions against `DEPLOYMENT_URL` or the production Netlify URL.

## Failure Artifacts

Playwright captures a screenshot on failure and a trace on the first retry. CI runs one worker with deterministic fixture data. Investigate the first causal error rather than increasing timeouts or retries to hide it.
