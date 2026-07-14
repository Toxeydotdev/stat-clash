## ADDED Requirements

### Requirement: Deployment behavior browser coverage

The complete deterministic gate SHALL exercise browser fallback routing and same-origin API success and not-found behavior through Playwright against owned local processes. CDN-only behavior SHALL be exercised by the post-deploy gate rather than inferred from local emulation.

#### Scenario: Deployment behavior changes

- **WHEN** a contributor runs `npm run check`
- **THEN** Playwright verifies a browser fallback route renders the arena
- **AND** the health, featured comparison, and unknown API routes retain their public response behavior
- **AND** the same scenarios remain runnable against a deployed URL without starting local servers
