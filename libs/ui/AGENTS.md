# Design-System Guidance

Follow the root `AGENTS.md` and `docs/design-system.md`.

- Components are product primitives, not page sections. They must not fetch, navigate, or own API state.
- Compose Tailwind theme tokens; do not duplicate raw brand colors in feature code.
- Use Radix when it provides meaningful accessible behavior. Do not wrap native HTML without a product-level reason.
- Accept native element props so labels, event handlers, ARIA attributes, and test interactions flow through.
- Defaults must include keyboard operation, visible focus, disabled behavior, and reduced-motion compatibility.
- Variants must represent reusable semantic intent, not one-off page coordinates.
- Test components through roles, names, and visible output with `userEvent`. Avoid asserting class strings or implementation structure.
- Keep the public surface in `src/index.ts` deliberate; do not export internal class helpers without a consumer need.
