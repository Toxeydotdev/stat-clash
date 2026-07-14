# Stat Clash Agent Guide

This file applies to the entire repository. A scoped `AGENTS.md` adds rules for its directory; follow both, with the nearest file taking precedence when guidance is more specific.

## Mission

Build Stat Clash as a trustworthy, playful arena for comparing gaming performance. Preserve the distinction between verified live data and seeded exhibition data. A polished visual must never hide uncertainty about source, freshness, mode, season, or fairness.

## Sources Of Truth

Use repository knowledge in this order:

1. `openspec/specs/` for current required behavior.
2. An active package under `openspec/changes/` for an approved behavioral change.
3. `docs/` for current architecture, design, testing, quality, and verified constraints.
4. The nearest `AGENTS.md` for implementation and collaboration rules.
5. Code and tests for implementation details that do not conflict with the sources above.

Chat history is context, not durable project truth. If a decision must survive the session, put it in the correct repository artifact.

## Required Workflow

1. Read the nearest `AGENTS.md`, relevant current specs, and affected docs before editing.
2. Inspect the Nx project graph and existing patterns; do not infer boundaries from folder names alone.
3. For material behavior, architecture, data handling, dependencies, or operational changes, create or update an OpenSpec change before implementation is considered complete.
4. Implement the smallest coherent change across contracts, API, web, and shared UI.
5. Test observable behavior at the highest practical real boundary.
6. Review documentation impact and update stale or newly discovered durable knowledge.
7. Run `npm run check`. A change is not complete while a required stage is skipped or failing.

Small typo, comment, or test-only corrections do not need a new OpenSpec proposal when they do not alter behavior. They still require relevant checks and documentation accuracy.

## Repository Map

- `apps/web`: React 19 and Vite browser application.
- `apps/api`: NestJS HTTP API, defaulting to port `3333` with global `/api` prefix.
- `apps/web-e2e`: Playwright tests that start the real web and API processes.
- `libs/ui`: reusable Tailwind/Radix design-system primitives.
- `libs/shared/contracts`: serializable TypeScript transport contracts shared by web and API.
- `openspec`: current specs and active/archived changes.
- `docs`: maintained technical and product-engineering knowledge.
- `.opencode`: OpenSpec-managed OpenCode skills and commands. Regenerate with `npm exec openspec update`; do not hand-edit generated workflow files unless OpenSpec documentation requires it.

## Architecture Boundaries

- `apps/web` may import `@stat-clash/ui` and `@stat-clash/contracts`. It must not import API implementation files.
- `apps/api` may import `@stat-clash/contracts`. It must not import browser or UI code.
- `libs/ui` must not fetch data, own routes, or know API implementation details. Keep product-domain composition in applications unless a shared primitive has a demonstrated contract-level need.
- `libs/shared/contracts` must stay runtime-light and platform-neutral. Add runtime validation at untrusted boundaries; TypeScript types do not validate JSON.
- Controllers translate HTTP intent and delegate. Domain/data-provider behavior belongs in services or focused libraries.
- External game providers require a dedicated OpenSpec change covering ownership verification, consent, freshness, rate limits, normalization, failure behavior, privacy, and deletion.

## Toolchain Rules

- Use the Node/npm versions declared by `.nvmrc`, `package.json`, and `devEngines`.
- Install with `npm ci` from a clean checkout. Use `npm install --save-exact` for intentional dependency additions and commit `package-lock.json` changes.
- Use Nx to run project tasks. Inspect with `npm exec nx show project <name>` and `npm run graph`.
- oxlint is the only JavaScript/TypeScript linter. oxfmt is the only repository formatter. Do not add ESLint or Prettier configs.
- Do not enable type-aware oxlint until its supported TypeScript version matches the workspace. Nx/TypeScript typecheck targets are authoritative meanwhile.
- Do not suppress a warning globally to make a check green. Fix it or document and narrowly configure a justified exception.

## Standard Commands

- `npm run dev`: run API and web development servers.
- `npm run format`: format supported repository files with oxfmt.
- `npm run check:quick`: format check, lint, typecheck, unit tests, and OpenSpec validation.
- `npm run build`: build all buildable Nx projects.
- `npm run e2e`: run Playwright against real local processes.
- `npm run check`: the complete merge gate.
- `npm run spec:check`: strict validation of all OpenSpec specs and changes.

Do not claim a command passed unless it was run in the current worktree. Report any skipped stage and the reason.

## Testing Philosophy

Test as users, not as implementation authors:

- Prefer Playwright for critical product journeys and cross-process behavior.
- Use accessible roles, labels, and visible names. Avoid CSS structure and test IDs when a user-facing locator is available.
- Use Playwright web-first assertions. Never use arbitrary sleeps such as `waitForTimeout`.
- Prefer real owned processes, services, and components. Mock only an expensive, unstable, destructive, or intentionally isolated boundary.
- Do not mock owned code merely to simplify arrangement. Do not make mocked component tests the only proof of a browser-to-API behavior.
- Keep snapshots small and intentional; do not use broad snapshots as behavioral assertions.

SIFERS means **Simple Injectable Functions Explicitly Returning State**:

- Use a local typed `setup(options?)` when tests share configurable arrangement. Inline trivial arrangement.
- Call `setup()` explicitly inside each test, not in scenario-dependent `beforeEach` hooks.
- Create fresh mutable state on every invocation and inject overrides before rendering, constructing, or navigating.
- Return only the user driver, locators, records, or system handles the test needs.
- Keep the action under test and all outcome assertions in the test body.
- SIFERS structures Arrange; continue to keep Arrange, Act, and Assert legible.
- Framework lifecycle cleanup is allowed. Resource-owning Playwright fixtures should guarantee teardown.

See `docs/testing.md` and scoped test guidance before adding a new test layer.

## Frontend And Design

- Preserve the Retro Future Arcade direction documented in `docs/design-system.md`; do not fall back to a generic dashboard layout.
- Use shared tokens and `libs/ui` primitives before adding app-local variants.
- Cyan identifies the left arena corner, magenta the right, and acid marks status/highlights. Never use color as the only status or winner signal.
- Every interactive element needs an accessible name, visible focus, keyboard operation, sufficient contrast, and a usable mobile layout.
- Honor `prefers-reduced-motion`. Motion should explain hierarchy or response, not decorate continuously.
- Model loading, empty, error, and success states deliberately for data-driven UI.

## API And Data Integrity

- Return types at HTTP boundaries must come from `@stat-clash/contracts` when shared with the browser.
- Keep seeded fixtures explicitly labeled `exhibition` in payloads and UI.
- Never fabricate a live result from a typed handle or silently mix game modes, seasons, platforms, or sample windows.
- Do not log secrets, access tokens, private player data, or raw provider payloads.
- Add runtime validation before consuming untrusted provider data.
- Keep `/api/health` lightweight and independent of optional downstream integrations unless readiness semantics are intentionally changed in OpenSpec.

## Documentation And Self-Improvement

Every material change must include a documentation impact review. Update documentation when behavior changes or implementation reveals a reusable, non-obvious fact.

Put knowledge in the narrowest durable home:

- Behavioral requirement or scenario: `openspec/specs/` through an OpenSpec change.
- Pending behavior/design/tasks: `openspec/changes/<change>/`.
- Current component/data flow: `docs/architecture.md`.
- Visual tokens and component rules: `docs/design-system.md`.
- Test strategy or SIFERS examples: `docs/testing.md`.
- Commands, CI, and deterministic constraints: `docs/quality.md`.
- Verified workaround or tooling fact: `docs/verified-lessons.md`.
- Reusable agent rule: root or scoped `AGENTS.md`.

Do not duplicate the same detailed rule across several files. Link to the canonical document. Do not append speculative notes to the lessons file: record evidence, consequence, and replacement criteria, then update or remove the entry when it stops being true.

## Completion Checklist

- Required behavior is represented in OpenSpec.
- Loading, failure, accessibility, responsive, and data-provenance implications were considered.
- Tests exercise observable behavior with minimal mocks and explicit SIFERS setup where useful.
- Relevant docs and scoped agent guidance remain accurate.
- Dependency and lockfile changes are intentional.
- `npm run check` passes, including desktop and mobile Playwright.
