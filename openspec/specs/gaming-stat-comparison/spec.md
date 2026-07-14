# gaming-stat-comparison Specification

## Purpose

TBD - created by archiving change establish-stat-clash-foundation. Update Purpose after archive.

## Requirements

### Requirement: Featured exhibition comparison API

The system SHALL expose a Nest API endpoint at `/api/comparisons/featured` that returns a typed two-player comparison containing game context, player identity labels, comparable metrics, and data provenance. The response MUST identify itself as exhibition data.

#### Scenario: Client requests the featured comparison

- **WHEN** a client sends a successful `GET` request to `/api/comparisons/featured`
- **THEN** the API returns exactly two players and one or more metrics associated with those players
- **AND** the response includes the game, mode, source label, source description, capture timestamp, and `exhibition` kind

### Requirement: Transparent matchup presentation

The web experience SHALL present both players, every returned metric, a visible edge for each non-tied metric, an aggregate metric score, and the data source. A winning edge MUST NOT be communicated by color alone.

#### Scenario: Exhibition data loads

- **WHEN** a user opens the arena and the featured endpoint succeeds
- **THEN** the user sees both handles, their game context, formatted metric values, textual `EDGE` indicators, an aggregate score, and the exhibition source

#### Scenario: Exhibition data fails to load

- **WHEN** the featured endpoint fails or cannot be reached
- **THEN** the user sees an arena-specific error state and a control to retry the request
- **AND** stale or invented player statistics are not shown as current results

### Requirement: Arena corner swap

The web experience SHALL let a user swap which player appears in each arena corner without changing which metric values belong to each player.

#### Scenario: User swaps corners

- **WHEN** the user activates the `Swap corners` control
- **THEN** the players exchange visual positions
- **AND** each player's metric values and the aggregate result remain correctly associated with that player

### Requirement: API readiness

The system SHALL expose `/api/health` as a readiness endpoint for local development and automated browser tests.

#### Scenario: API is ready

- **WHEN** the Nest process is accepting requests
- **THEN** `GET /api/health` returns status `ok` and identifies the Stat Clash API service
