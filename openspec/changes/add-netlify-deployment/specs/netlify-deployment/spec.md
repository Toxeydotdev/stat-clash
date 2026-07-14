## ADDED Requirements

### Requirement: Reproducible Netlify site build

The repository SHALL provide file-based Netlify configuration that installs the committed npm graph with the declared Node version, builds the Nx applications, publishes the Vite output, and packages the Nest API function.

#### Scenario: Netlify builds a clean checkout

- **WHEN** Netlify builds the repository using its committed configuration and lockfile
- **THEN** the deploy contains the production web assets and the serverless Nest API
- **AND** no manually uploaded artifact or deployment-only secret is required for the exhibition experience

### Requirement: Same-origin Nest API

The deployed web experience SHALL continue to access the existing Nest endpoints through relative `/api` URLs on the site origin.

#### Scenario: Deployed API is ready

- **WHEN** a client sends `GET /api/health` to the Netlify site
- **THEN** the request is handled by the deployed Nest application
- **AND** the response reports status `ok` and identifies the Stat Clash API service

#### Scenario: Deployed comparison is requested

- **WHEN** a client sends `GET /api/comparisons/featured` to the Netlify site
- **THEN** the request is handled by the same Nest controller and service used by local development
- **AND** the response remains the typed, clearly labeled exhibition comparison

#### Scenario: Unknown deployed API route is requested

- **WHEN** a client requests an unknown path below `/api`
- **THEN** the Nest API returns a not-found response
- **AND** the static application shell is not returned as an API response

### Requirement: Static application routing

Netlify SHALL serve immutable built assets directly and SHALL fall back to the web application's `index.html` for non-API browser routes that do not match a static file.

#### Scenario: User opens the deployed arena

- **WHEN** a user opens the Netlify site
- **THEN** the production web application loads its built scripts, styles, and fonts
- **AND** it can render the featured comparison returned by the same-origin API
