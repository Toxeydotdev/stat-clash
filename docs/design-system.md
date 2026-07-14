# Design System

## Direction

Stat Clash uses **Retro Future Arcade**: dark and precise rather than nostalgic pixel art. The interface should feel like a competitive broadcast routed through a premium arcade cabinet.

The visual hierarchy is intentionally editorial: oversized proposition type, compact mono metadata, crisp stat rows, and asymmetric details. Avoid generic dashboard grids, glass cards, rainbow gradients, and excessive glow.

## Tokens

Tokens are declared in `apps/web/src/styles.css` through Tailwind CSS 4 `@theme`.

| Token           | Value     | Use                                |
| --------------- | --------- | ---------------------------------- |
| `void`          | `#07070c` | page and deepest surfaces          |
| `panel`         | `#0e1018` | raised comparison surfaces         |
| `clash-cyan`    | `#1fe8ff` | left corner, primary action, focus |
| `clash-magenta` | `#ff36d1` | right corner, secondary emphasis   |
| `clash-acid`    | `#dfff3f` | status, signal, compact highlights |
| `ink-soft`      | `#d9dbe6` | primary body copy                  |
| `ink-muted`     | `#858a9f` | metadata and secondary copy        |

Corner color is positional, not permanently attached to a player. When players swap corners, cyan remains left and magenta remains right.

## Typography

- Display: Space Grotesk Variable. Use for headlines, handles, values, and decisive labels.
- Mono: JetBrains Mono Variable. Use for metadata, controls, status, provenance, and compact system labels.
- Body: Space Grotesk at comfortable line height. Do not use mono for paragraphs.

Fonts are installed as local npm assets so visual checks do not depend on a remote font host.

## Shape And Detail

- Panels use thin low-contrast borders and clipped opposing corners.
- Primary controls use a hard offset magenta shadow rather than a soft generic glow.
- Grid and scanline textures are atmospheric and non-interactive.
- Dense metadata is uppercase with tracking; body copy remains sentence case.
- Use gradients only for a meaningful transition between player corners or a subtle ambient field.

## Components

The public `@stat-clash/ui` surface currently includes:

- `Button`: primary, secondary, and ghost actions with small/medium sizes.
- `Badge`: neutral, cyan, magenta, and acid metadata/status labels.
- `Panel`: clipped product surface.
- `Hint` and `HintProvider`: Radix tooltip behavior for supplementary explanation.
- `PlayerAvatar`: accessible deterministic initials presentation.
- `MetricBar`: two-sided value, textual edge, and proportional visual comparison.

Add a variant only when at least two product contexts share its semantic intent. Keep one-off layout composition in the app.

## Accessibility

- Color never carries the only meaning. Metric winners also receive `EDGE`; exhibition data has text labels.
- Interactive elements need an accessible name, keyboard operation, visible focus, and at least a 36px practical target.
- Tooltip content supplements a visible or accessible trigger and must not contain required actions.
- Decorative icons use `aria-hidden`; meaningful icons need names through surrounding text or ARIA.
- Reduced-motion users receive effectively instant transitions and no smooth scrolling.
- Mobile retains provenance and all comparison controls; hover cannot be required.

## Review Checklist

- Uses existing tokens and primitives.
- Reads clearly at 320px and a desktop viewport.
- Preserves left/right identity without relying on color alone.
- Has loading, empty/error, success, focus, disabled, and reduced-motion behavior where applicable.
- Does not imply seeded data is live.
