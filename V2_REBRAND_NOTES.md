# V2 Rebrand Token Layer

## What this PR adds

A single additive stylesheet (`wellet-v2-tokens.css`) loaded after `style.css` on every page that uses the shared design system.

**Nothing visible changes** until a surface opts in by using the new classes.

## What's inside

### Typography

- **Display**: Gambetta (Fontshare) — weights 300/400/500/400i
- **Body**: Public Sans (Google Fonts) — weights 400/500/600/700

The tokens file exposes `--font-v2-serif` and `--font-v2-sans` aliases. To activate v2 typography on a page, also load the two fonts in `<head>`:

```html
<link href="https://api.fontshare.com/v2/css?f[]=gambetta@300,400,500,400i&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Fraunces and DM Sans remain loaded on v1 pages — no conflict, no replacement until each surface migrates.

### Color tokens (`--c-*`)
The v2 semantic palette:

- **Forest** (`--c-forest`, `--c-forest-deep`, `--c-forest-leaf`, `--c-forest-pine`) — primary brand
- **Mint** (`--c-mint`, `--c-mint-soft`, `--c-mint-deep`) — "fresh" status
- **Clay / Walnut / Clay-soft** — change states + self-reported provenance
- **Mist / Stone / Blue** — cool neutrals
- **Midnight** — depth accent, used sparingly
- **Alert** — ER red, used only in the ER surface

### rcard primitives
- `.rcard` — Forest 3px left border + Clay eyebrow + Mint pill = the v2 grammar
- `.rcard.is-change` — Clay border (dose changed, etc.)
- `.rcard.is-unavailable` — Stone bg, dimmed
- `.rcard.with-icon` — 34px Mint-soft icon tile
- `.rc-eyebrow.self-reported` — Walnut + "flag for next visit" appended

### Other primitives
- `.timeline-rail` — vertical rail with filled Forest dots (suppresses the rcard left border inside)
- `.btn-forest-outline` — demoted-CTA variant
- `.menu-tile`, `.menu-tile.is-emergency` — side-menu icon tiles (Walnut for ER)

## Reference

The full pattern library, including live examples of every primitive, lives at the v2 reference site (mockups.html).

## Migration plan

Surfaces will be migrated **one page at a time** in subsequent PRs — same discipline as the editorial rollout in the main app. This PR is plumbing only.
