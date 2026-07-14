# Stat Clash

Settle the lobby debate.

Stat Clash is a playful arena for fair player-versus-player gaming stat comparisons. The foundation currently presents a clearly labeled, deterministic Apex Legends exhibition matchup while live provider, account verification, privacy, and normalization requirements are designed through OpenSpec.

## Stack

- TypeScript, React 19, Vite, and Tailwind CSS 4
- Radix UI primitives and the custom Retro Future Arcade design system
- NestJS 11 API
- Nx 23 integrated monorepo
- Vitest/Jest focused tests and Playwright real-process browser tests
- oxlint and oxfmt
- OpenSpec spec-driven delivery and OpenCode workflows

## Quick Start

Requirements: Node `24.14.0`, npm `11.9.0`, and Chromium for Playwright.

```sh
npm ci
npx playwright install chromium
npm run dev
```

Open `http://localhost:4200`. The Nest API listens at `http://localhost:3333/api` and Vite proxies relative `/api` requests.

## Quality Gate

```sh
npm run check
```

The complete gate verifies formatting, linting, TypeScript, focused tests, production builds, strict OpenSpec artifacts, and Playwright in desktop and mobile Chromium.

Useful narrower commands:

```sh
npm run check:quick
npm run format
npm run build
npm run e2e
npm run spec:check
```

See [`docs/quality.md`](docs/quality.md) for task and CI details.

## Deploy

The repository includes a Netlify deployment for both parts of the application:

- Vite assets publish from `dist/apps/web`;
- `/api/*` routes to the existing Nest application through a Netlify Function;
- all build, publish, rewrite, and Node/npm settings live in `netlify.toml`.

Import the Git repository into Netlify and select `web` if its Nx monorepo picker appears. No environment variables are required for the current exhibition build. See [`docs/deployment.md`](docs/deployment.md) for architecture, local parity checks, and post-deploy verification.

## Workspace

```text
apps/
  api/          Nest API and exhibition comparison
  web/          React product experience
  web-e2e/      Playwright journeys against real processes
libs/
  shared/contracts/  Serializable web/API contracts
  ui/                Reusable Tailwind/Radix primitives
openspec/       Current requirements and change packages
docs/           Architecture, design, testing, quality, lessons
```

## OpenSpec Workflow

Behavioral changes start with OpenSpec so requirements do not disappear into chat history:

```text
/opsx:explore <idea>       # optional, no artifacts
/opsx:propose <change>     # proposal, specs, design, tasks
/opsx:apply <change>       # implement and track tasks
/opsx:archive <change>     # merge completed behavior into current specs
```

OpenCode uses hyphenated command aliases when required by the command palette, such as `/opsx-propose`. Validate all artifacts with `npm run spec:check`.

OpenSpec-generated commands and skills live in `.opencode/`. Restart OpenCode after initialization or workflow updates.

## Engineering Guidance

Read [`AGENTS.md`](AGENTS.md) before making changes. Scoped guides under apps and libraries add local rules.

- [`docs/architecture.md`](docs/architecture.md): system boundaries and data flow
- [`docs/design-system.md`](docs/design-system.md): Retro Future Arcade tokens and components
- [`docs/testing.md`](docs/testing.md): user-centered, minimal-mock, SIFERS testing
- [`docs/quality.md`](docs/quality.md): deterministic checks and CI
- [`docs/deployment.md`](docs/deployment.md): Netlify build, routing, and release verification
- [`docs/verified-lessons.md`](docs/verified-lessons.md): maintained non-obvious constraints

## Data Notice

The current matchup is seeded exhibition data. Stat Clash does not yet contact a game provider, verify account ownership, or claim that displayed handles and statistics belong to live players. Those capabilities require a separate reviewed specification.
