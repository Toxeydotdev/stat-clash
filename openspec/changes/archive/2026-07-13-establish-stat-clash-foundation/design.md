## Context

Stat Clash starts as a greenfield product with a known technology stack but unresolved live-data providers. The first slice must exercise a real browser-to-API path, demonstrate a distinctive design direction, and make future changes safe without pretending that seeded statistics are live player records.

The repository will be used by humans and coding agents. Requirements and implementation knowledge therefore need durable, discoverable homes rather than relying on chat history.

## Goals / Non-Goals

**Goals:**

- Prove a typed end-to-end matchup from Nest through React.
- Make the first page responsive, accessible, and visually specific to Stat Clash.
- Create one deterministic command that verifies every required quality boundary.
- Establish explicit OpenSpec and documentation maintenance habits.
- Favor user-observable tests and real process boundaries.

**Non-Goals:**

- Selecting a game-data provider or collecting live player data.
- Authenticating users, linking game accounts, or persisting profiles.
- Defining cross-game normalization, ranking algorithms, or monetization.
- Shipping production infrastructure or a public deployment.

## Decisions

### Nx integrated monorepo

Use Nx projects under `apps/` and `libs/`: `web`, `api`, `web-e2e`, `ui`, and `contracts`. This keeps the browser, server, tests, and shared boundaries independently addressable while one lockfile and task graph provide reproducibility. A package-per-service repository was rejected because it adds release and dependency overhead before there are independent deployment needs.

### Contract-first exhibition endpoint

Define serializable comparison types in `libs/shared/contracts` and return a deterministic fixture from Nest at `/api/comparisons/featured`. The web app always displays the exhibition source and capture date. Calling a third-party API or synthesizing results from entered handles was rejected because no provider, consent, freshness, or normalization policy has been chosen.

### Tailwind tokens plus Radix primitives

Build the design system in `libs/ui` with Tailwind CSS 4 theme tokens and focused Radix primitives. This retains control over the Retro Future Arcade identity while relying on tested interaction primitives. Mantine, Chakra UI, and MUI were considered but rejected for the foundation because their stronger visual/runtime opinions make a distinctive compact system harder to maintain.

### Oxc tools as cached workspace targets

Run `oxlint` and `oxfmt` directly through one root Nx project rather than attaching full-repository scans to every app. Type-aware oxlint is deferred because the current Nx TypeScript version is not compatible with its TypeScript 7 requirement; Nx/TypeScript typecheck targets remain authoritative.

### Behavior-first testing with SIFERS setup

Playwright launches the real Nest and Vite processes and verifies the primary flow in desktop and mobile Chromium using role/name locators and web-first assertions. Focused React tests may replace only the HTTP boundary; Nest and UI unit tests use real instances and observable output. Repeated setup uses explicit local SIFERS helpers, while actions and assertions remain in each test. Broad snapshots, implementation selectors, shared mutable `beforeEach` state, and mocks of owned code are rejected.

### Repository-native knowledge

OpenSpec specs are the behavioral source of truth. Root and scoped `AGENTS.md` files define working rules, while `docs/` explains architecture, design, testing, and verified lessons. New reusable facts are added to docs in the same change that discovers them; changed behavior updates OpenSpec before archive.

## Risks / Trade-offs

- [Seeded statistics could be mistaken for real records] -> Label the experience and API payload as `exhibition` and show provenance in the UI.
- [A custom visual system can drift] -> Centralize tokens and primitives in `libs/ui`, document usage, and test accessible behavior.
- [Root-wide Oxc scans grow with the repository] -> Cache them through Nx and revisit project-level inputs only when measured runtime justifies it.
- [Browser tests can become flaky] -> Use deterministic fixture data, real readiness URLs, role-based locators, web-first assertions, and one CI worker.
- [Documentation becomes stale] -> Make documentation impact part of OpenSpec tasks, review criteria, and agent instructions.
- [Shared TypeScript contracts do not validate runtime JSON] -> Add schema validation with the first untrusted provider boundary rather than claiming compile-time types validate external data.

## Migration Plan

This is an additive greenfield foundation. Build the workspace, validate all artifacts, then archive this change so its delta specs become the current requirements. If the foundation must be rolled back before release, remove the repository; there is no persisted data or external consumer to migrate.

## Open Questions

- Which game and official or third-party provider should be integrated first?
- What account ownership verification and consent are required before showing live data?
- How should modes, seasons, sample sizes, and platform differences be normalized?
- Which comparisons may be public or shareable, and what deletion/privacy controls are required?
- What persistence and deployment architecture is justified after the first provider is chosen?
