# living-project-knowledge Specification

## Purpose

TBD - created by archiving change establish-stat-clash-foundation. Update Purpose after archive.

## Requirements

### Requirement: OpenSpec behavioral source of truth

Current product behavior MUST be represented in `openspec/specs`, and material behavior changes MUST use a validated OpenSpec change before their implementation is considered complete.

#### Scenario: Contributor starts a material behavior change

- **WHEN** the change adds, modifies, or removes a user-visible or operational requirement
- **THEN** the contributor creates or updates an OpenSpec change with proposal, delta specs, design when warranted, and verifiable tasks

#### Scenario: Implemented change is complete

- **WHEN** implementation and verification tasks are complete
- **THEN** strict OpenSpec validation passes and the change can be archived into current specs

### Requirement: Layered agent guidance

The repository SHALL provide a root `AGENTS.md` for universal rules and scoped `AGENTS.md` files where web, API, testing, or design-system work needs more specific guidance.

#### Scenario: Agent works in a scoped project

- **WHEN** an agent changes files under a directory with scoped guidance
- **THEN** it follows both root policy and the nearest applicable `AGENTS.md`

### Requirement: Durable documentation maintenance

Architecture, design-system, testing, and quality documentation MUST describe current repository behavior. A change that invalidates documented behavior or reveals a reusable non-obvious fact MUST update the relevant document in the same change.

#### Scenario: Implementation reveals reusable knowledge

- **WHEN** a contributor verifies a constraint, workaround, command, or architectural fact that future work will need
- **THEN** the contributor records it in the appropriate durable document with context
- **AND** does not rely on chat history or a transient task log as the only record

#### Scenario: Knowledge is no longer true

- **WHEN** implementation changes or disproves a documented fact
- **THEN** the contributor updates or removes the stale statement in the same change

### Requirement: Documentation review in delivery

Every material task list and review SHALL consider impact on OpenSpec, contributor guidance, architecture, design, testing, and verified lessons.

#### Scenario: Contributor prepares a change for completion

- **WHEN** code and tests are ready
- **THEN** the contributor reviews documentation impact and updates affected artifacts before running the complete quality gate
