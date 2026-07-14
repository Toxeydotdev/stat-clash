# deterministic-quality-gates Specification

## Purpose

TBD - created by archiving change establish-stat-clash-foundation. Update Purpose after archive.

## Requirements

### Requirement: Reproducible toolchain

The repository MUST declare the supported Node and npm versions, commit `package-lock.json`, save new npm dependencies exactly, and use `npm ci` in CI.

#### Scenario: CI installs the workspace

- **WHEN** CI starts from a clean checkout with the declared Node version
- **THEN** `npm ci` installs the lockfile graph without modifying dependency metadata

### Requirement: Complete root quality gate

The repository SHALL provide `npm run check` as the complete deterministic gate covering oxfmt, oxlint, TypeScript checks, unit tests, production builds, strict OpenSpec validation, and Playwright end-to-end tests.

#### Scenario: A change is ready to merge

- **WHEN** a contributor runs `npm run check`
- **THEN** formatting, linting, type checks, unit behavior, builds, specifications, and browser behavior are all verified
- **AND** any failing stage returns a non-zero exit code

### Requirement: Browser verification

Playwright tests MUST launch the real web and API processes, exercise user-visible behavior with user-facing locators and web-first assertions, and cover desktop and mobile Chromium in the complete quality gate.

#### Scenario: Featured comparison is verified

- **WHEN** Playwright runs the featured comparison flow
- **THEN** it waits for the real API and web readiness endpoints
- **AND** verifies that a user can see the seeded result and swap arena corners in both configured viewport classes

### Requirement: Behavior-first minimal-mock testing

Tests SHALL prioritize observable user behavior and real owned boundaries. Mocks MUST be limited to boundaries that are impractical or intentionally isolated, and repeated scenario arrangement SHALL use SIFERS setup helpers: Simple Injectable Functions Explicitly Returning State.

#### Scenario: Several tests share configurable arrangement

- **WHEN** repeated setup is needed
- **THEN** each test explicitly calls a local typed `setup()` function with meaningful options
- **AND** the helper creates fresh state and returns only handles required by the test
- **AND** the behavior under test and its assertions remain visible in the test body

#### Scenario: A browser flow crosses web and API code

- **WHEN** the owned processes can run deterministically in the test environment
- **THEN** the test uses the real processes rather than mocking the API response

### Requirement: CI enforcement

The repository SHALL run the complete root quality gate for pushes to the main branch and pull requests, with concurrency cancellation and read-only repository permissions.

#### Scenario: A pull request updates project files

- **WHEN** GitHub Actions starts the CI workflow
- **THEN** it installs locked dependencies and Chromium before running `npm run check`
