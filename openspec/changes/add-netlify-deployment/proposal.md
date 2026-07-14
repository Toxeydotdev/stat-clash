## Why

Stat Clash currently runs only as separate local Vite and Nest processes. It needs a reproducible public deployment path that preserves the real browser-to-API flow and the existing same-origin `/api` contract without introducing live player data or long-running infrastructure.

## What Changes

- Configure Netlify to build and publish the Vite application from the Nx workspace.
- Package the existing Nest application as a Netlify Function and route `/api/*` to it on the same origin.
- Keep the standalone Nest process for local development and Playwright while sharing application setup between both runtimes.
- Add deployment documentation and verify that the Netlify artifacts are covered by the repository quality gate.
- Add Playwright coverage and a required post-deploy validation command for CDN, browser-routing, and serverless API behavior.
- Continue serving only clearly labeled deterministic exhibition data; no provider, account, persistence, or secret handling is introduced.

## Capabilities

### New Capabilities

- `netlify-deployment`: Build and route the Stat Clash web experience and Nest API as one Netlify site.

### Modified Capabilities

- `deterministic-quality-gates`: Exercise deployment routing behavior locally in the complete gate while keeping remote post-deploy checks explicit and non-cached.

## Impact

This adds Netlify configuration, a serverless API entry point, and small runtime adapter dependencies. The browser contract remains relative `/api`, the local development commands remain unchanged, and the existing web and API implementations remain the source of deployed behavior.
