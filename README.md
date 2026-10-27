# cck-shared

Shared configuration and design tokens for CCK projects, so every repo follows
the same standards and looks the same without copying files around.

## Biome

Install it as a git dependency pinned to a tag, next to Biome itself:

```sh
npm install --save-dev github:cckarchev/cck-shared#v1.2.0 @biomejs/biome@2.6.2
```

Then extend the preset from the project's `biome.jsonc` and add only what is
specific to that project:

```jsonc
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["@cckarchev/shared/biome"],
  "files": {
    "includes": ["**", "!public"]
  }
}
```

The preset uses Biome's formatter defaults (double quotes, line width 80,
trailing commas everywhere) with space indentation, the `recommended` rule set,
and a set of stricter rules on top, all reported as errors. Those include the
naming conventions: camelCase or PascalCase file names, camelCase identifiers
(acronyms too, as in `parseSvg`), and CONSTANT_CASE only for module-level
constants.

## Design tokens

The club palette and the scales every CCK project builds on: spacing, type,
tracking, leading, motion, measure, layers and border widths. The club site's
look is the reference; the tools use the same tokens so they feel like part of
it. Dark only, sharp corners, orange accent, bright teal for brand and focus.

`src/tokens.ts` is the source. `tokens.css` is generated from it with
`npm run generate`, and a test fails when the two drift apart.

In CSS, import the font faces and the tokens once, from the global stylesheet:

```css
@import "@cckarchev/shared/fonts.css";
@import "@cckarchev/shared/tokens.css";
```

The three families (Big Noodle Titling, Barlow and JetBrains Mono) ship with
this package, so a project needs no Google Fonts link. Licenses are in
`NOTICE`.

In TS and TSX, import the constants and helpers:

```ts
import { ACCENT, text, withAlpha } from "@cckarchev/shared/tokens";
```

### Naming

| Prefix                        | Holds                                  |
| :---------------------------- | :------------------------------------- |
| `--color-bg-*`, `--color-*`   | The palette (`--color-accent`)         |
| `--rgb-*`                     | RGB channels, space separated          |
| `--alpha-<percent>`           | The opacity scale                      |
| `--color-text-*`              | Text tiers, strong to faint            |
| `--color-border-*`            | Border colors by state                 |
| `--color-surface-*`           | Panels, fields, scrims and tints       |
| `--color-highlight-*`         | The one accent card that stands out    |
| `--color-secondary-*`         | Teal fills and borders                 |
| `--border-*`, `--focus-ring`  | Shorthands built from the tokens above |
| `--font-*`, `--font-size-*`   | Families and the type scale, in px     |
| `--space-*`, `--measure-*`    | Spacing and content widths, in px      |
| `--tracking-*`, `--leading-*` | Letter spacing (em) and line height    |
| `--layer-*`, `--duration-*`   | z-index layers and motion, in ms       |

Compose a translucent color from a channel and a step of the scale instead of a
loose number: `rgb(var(--rgb-accent) / var(--alpha-20))`.

Any color from the brand manual that is too dark for small text on the
near-black background gets a lightened `-light` sibling that passes WCAG AA.
The tests check every text tier and text color against the three backgrounds.

Tokens that belong to one project (a card's aspect ratio, a header height, a
game's faction colors) stay in that project, defined on top of these.

## Releasing

Bump `version` in `package.json`, tag the commit as `v<version>`, and push the
tag. Each project upgrades by changing the tag in its dependency.
