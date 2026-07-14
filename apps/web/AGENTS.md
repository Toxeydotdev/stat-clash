# Web App Guidance

Follow the root `AGENTS.md` and these browser-specific rules.

## Responsibilities

- Render product behavior from typed contracts; do not import Nest implementation code.
- Fetch through relative `/api` URLs so Vite proxying and deployment routing stay replaceable.
- Make data provenance and exhibition/live status visible wherever player statistics appear.
- Keep request states explicit: loading, success, failure with recovery, and empty when the API can return no result.

## React

- Use function components and React 19 patterns. Keep state local until multiple features truly share it.
- Derive presentation values during render instead of syncing redundant state in effects.
- Effects are for external synchronization such as HTTP requests. Abort in-flight requests on cleanup.
- Do not add `useMemo` or `useCallback` by default. Add them only for measured identity/performance requirements or an established library contract.
- Split a component when the extracted unit owns a coherent behavior or reusable visual pattern, not merely to reduce line count.

## UI

- Use `@stat-clash/ui` and tokens from `apps/web/src/styles.css` before creating new primitives.
- Keep arena-corner colors positional: cyan left, magenta right. Include text/icon meaning for every edge or status.
- Test mobile and desktop composition. Essential content and controls must not rely on hover.
- Prefer semantic landmarks, headings, articles, buttons, and links. Tooltips supplement visible labels; they do not replace them.

## Tests

- The real happy path belongs in Playwright.
- A component test may mock the HTTP boundary to cover focused loading/failure/retry behavior, but it must not be the only proof of API integration.
- Use `userEvent`, accessible queries, and explicit local SIFERS setup helpers. Avoid `fireEvent`, implementation selectors, and broad snapshots.
