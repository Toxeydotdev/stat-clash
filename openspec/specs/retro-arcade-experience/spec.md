# retro-arcade-experience Specification

## Purpose

TBD - created by archiving change establish-stat-clash-foundation. Update Purpose after archive.

## Requirements

### Requirement: Retro Future Arcade visual language

The web experience SHALL use the approved Retro Future Arcade language: a dark neutral foundation, cyan and magenta player corners, acid status accents, bold display typography, monospaced metadata, crisp borders, and restrained arcade-inspired detail.

#### Scenario: User opens the landing experience

- **WHEN** the page renders
- **THEN** the proposition, featured clash, protocol, and roadmap read as one coherent branded experience
- **AND** exhibition status remains visually distinct from live-provider claims

### Requirement: Shared design-system primitives

Reusable interactive and structural UI SHALL be provided by `libs/ui` using Tailwind CSS theme tokens and Radix primitives where an accessible behavior primitive is needed.

#### Scenario: A feature needs an established UI pattern

- **WHEN** a contributor adds a button, badge, panel, tooltip, player avatar, or comparison metric
- **THEN** the contributor can use or extend the shared primitive instead of recreating product tokens in an app-local component

### Requirement: Responsive experience

The primary landing and comparison flows MUST remain usable at modern mobile and desktop viewport sizes without horizontal page scrolling or hidden essential controls.

#### Scenario: Comparison is viewed on mobile

- **WHEN** the viewport matches a modern mobile Chromium device
- **THEN** both players, every metric, provenance, and the corner-swap control remain visible and operable

#### Scenario: Comparison is viewed on desktop

- **WHEN** the viewport matches desktop Chromium
- **THEN** the comparison uses the available width while preserving clear player and metric hierarchy

### Requirement: Accessible interaction and motion

Interactive controls MUST be keyboard accessible, expose user-facing accessible names, show visible focus, and preserve meaning without color. Nonessential motion MUST be suppressed when the user requests reduced motion.

#### Scenario: User navigates without a pointer

- **WHEN** the user reaches navigation and arena controls by keyboard
- **THEN** every control has a visible focus indicator and an accessible name

#### Scenario: User requests reduced motion

- **WHEN** the operating system reports `prefers-reduced-motion: reduce`
- **THEN** decorative animation and smooth scrolling complete effectively without sustained motion
