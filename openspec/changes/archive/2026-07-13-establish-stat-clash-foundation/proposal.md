## Why

Gaming comparisons are often scattered across screenshots, mismatched modes, and context-free totals. Stat Clash needs a trustworthy technical and product foundation that can make a matchup feel playful without implying that exhibition data is live or authoritative.

## What Changes

- Establish an Nx monorepo containing a React web experience, Nest API, Playwright browser tests, shared contracts, and a shared design-system library.
- Add a clearly labeled seeded matchup that proves the end-to-end comparison contract and lets a user swap the two arena corners.
- Introduce the Retro Future Arcade visual system using Tailwind CSS tokens and accessible Radix primitives.
- Add deterministic local and CI checks for formatting, linting, type safety, unit behavior, builds, OpenSpec artifacts, and desktop/mobile browser behavior.
- Establish OpenSpec, layered `AGENTS.md` guidance, architecture/design/testing docs, and a process for preserving durable discoveries.
- Keep live game providers, account verification, persistent profiles, social sharing, and production deployment out of scope until separate changes resolve their product, privacy, and data-quality constraints.

## Capabilities

### New Capabilities

- `gaming-stat-comparison`: Serve and present a transparent two-player exhibition matchup with metric-level and overall results.
- `retro-arcade-experience`: Provide the responsive, accessible Retro Future Arcade design language and reusable UI primitives.
- `deterministic-quality-gates`: Make the complete TypeScript/Nx workspace reproducibly verifiable locally and in CI.
- `living-project-knowledge`: Keep requirements, architecture, testing policy, agent guidance, and reusable discoveries current in the repository.

### Modified Capabilities

None.

## Impact

This creates the initial repository architecture and affects all workspace code, local development commands, CI, and contributor workflow. It adds the selected TypeScript/React/Nest/Nx/Playwright/Oxc/OpenSpec stack and establishes a versioned API contract at `/api/comparisons/featured`. No external game service or player account is contacted in this change.
