## 1. Deployment Architecture

- [x] 1.1 Add shared Nest application configuration and a cached serverless HTTP entry point without changing standalone development behavior.
- [x] 1.2 Add the modern Netlify function wrapper, API rewrite, SPA fallback, build settings, and pinned runtime dependencies.
- [x] 1.3 Ensure the normal API production build emits the function input consumed by Netlify.

## 2. Verification

- [x] 2.1 Add focused coverage for shared application configuration and serverless API behavior where practical.
- [x] 2.2 Build with the Netlify CLI and verify the root page, health route, featured comparison route, static assets, and unknown API behavior.
- [x] 2.3 Run `npm run check` successfully, including production artifacts and desktop/mobile browser tests.

## 3. Durable Knowledge

- [x] 3.1 Document Netlify's static/function request flow, build command, publish directory, and connection steps.
- [x] 3.2 Validate the complete OpenSpec change strictly and review documentation for stale local-only deployment assumptions.
