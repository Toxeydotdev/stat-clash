# Verified Lessons

This document stores non-obvious facts that were observed or verified while maintaining Stat Clash. It is not a chronological work log.

Each entry records evidence, consequence, and replacement criteria. Update or remove an entry when an upgrade makes it false.

## Nx 23 React Routing Generator Failure

**Observed:** 2026-07-13 with Nx `23.1.0`, Node `24.14.0`, and npm `11.9.0`.

Running the React application generator with `--routing=true --useReactRouter=false` failed in `@nx/react` `add-routing.js` while reading `PackageManagerCommands.Latest`. Generating with `--routing=false` succeeded.

**Consequence:** Generate routing-free React applications on this pinned Nx version and add an intentional router later when product routes require one. Do not add a router merely to work around the generator.

**Remove when:** An Nx upgrade is verified to generate the selected routing mode successfully.

## OpenSpec 1.6 OpenCode Delivery

**Observed:** `openspec init --tools opencode --profile core` with OpenSpec `1.6.0` generated six skills and six commands under `.opencode/`, plus `openspec/config.yaml`.

**Consequence:** Keep project operating rules in root/scoped `AGENTS.md`; do not add the legacy OpenSpec marker block or `openspec/AGENTS.md`. Refresh generated workflows with `npm exec openspec update` after an OpenSpec upgrade, then restart OpenCode.

**Remove when:** OpenSpec's supported-tool guidance changes and the upgraded CLI is verified in this repository.

## Type-Aware Oxlint Is Deferred

**Observed:** The current workspace uses TypeScript `6.0.x`; the available type-aware oxlint path requires a TypeScript 7-compatible toolchain.

**Consequence:** oxlint handles syntax/lint rules, while Nx TypeScript targets remain the type-safety gate. Do not enable type-aware lint flags until compatibility is verified.

**Remove when:** The workspace and oxlint type-aware engine share a supported TypeScript version and `npm run check` passes with it enabled.

## Nx 23 Generates Deprecated Vite Plugins

**Observed:** Nx `23.1.0` generated `nxViteTsPaths` and `nxCopyAssetsPlugin`, while its own test output reports that both will be removed in Nx 24.

Vite `8.1.4` also reports that `vite-tsconfig-paths` is unnecessary because alias resolution is native.

**Consequence:** Stat Clash uses Vite's `resolve.tsconfigPaths: true` and native public directory instead. Do not reintroduce the deprecated Nx plugins or a separate tsconfig-path plugin when generating another Vite project on this toolchain.

**Remove when:** An Nx upgrade generates and documents a different non-deprecated Vite configuration that is verified by this workspace.

## Exhibition Data Must Stay Explicit

**Observed:** The foundation has no selected provider, ownership verification, or normalization policy.

**Consequence:** The API returns `kind: 'exhibition'` and source metadata, and the web page displays that provenance. Never reinterpret a typed user handle as permission to fabricate or fetch live records.

**Remove when:** Do not remove this principle. Replace the implementation detail only through a provider OpenSpec change that preserves equivalent provenance and consent guarantees.

## Current Audit Findings Are Development-Only

**Observed:** On 2026-07-13, `npm run audit:prod` reported zero vulnerabilities. A full `npm audit` reported seven moderate findings rooted in `uuid <11.1.1` through `sockjs`, `webpack-dev-server`, and the Nx webpack/web/react development toolchain.

The automated fix proposes downgrading aligned Nx 23 packages to Nx 22.6.5, which is an incompatible toolchain change rather than a safe patch.

**Consequence:** Do not run `npm audit fix --force` or add an unverified transitive override. Keep the development server local, review Nx/webpack updates through Dependabot, and require the production audit to remain clean.

**Remove when:** An aligned Nx/webpack update removes the affected dependency path and both the full and production audits are re-run.
