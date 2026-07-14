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

### Requirement: Post-deploy validation

Every production deployment SHALL be followed by a non-cached validation against its public URL. The validation MUST fail when the application shell, browser fallback, immutable asset delivery, health endpoint, featured comparison, or JSON API not-found behavior does not match the deployed contract.

#### Scenario: Production deployment completes

- **WHEN** Netlify reports a successful production deployment
- **THEN** Playwright runs the product journeys and deployment-specific checks against that deployment URL without local web servers
- **AND** the release is not considered validated unless every desktop and mobile Chromium scenario passes

#### Scenario: Contributor deploys from the CLI

- **WHEN** a contributor runs the repository production deployment command
- **THEN** the command deploys with a pinned Netlify CLI version and immediately runs the same post-deploy Playwright gate
- **AND** either a failed deployment or failed validation returns a non-zero exit code
