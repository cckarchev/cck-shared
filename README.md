# cck-shared

Shared configuration and design tokens for CCK projects, so every repo follows
the same standards and looks the same without copying files around.

## Biome

Install it as a git dependency pinned to a tag, next to Biome itself:

```sh
npm install --save-dev github:cckarchev/cck-shared#v1.5.0 @biomejs/biome@2.6.3
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

## TypeScript

`tsconfig.base.json` holds the compiler options every project shares: bundler
resolution, `noEmit`, `strict`, `verbatimModuleSyntax`, `erasableSyntaxOnly`
and the unused-code checks. Extend it and add only what belongs to the
project:

```jsonc
{
  "extends": "@cckarchev/shared/tsconfig",
  "compilerOptions": {
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

Keep `paths` in the project: TypeScript resolves them against the file that
declares them, which would be this package.

## Design tokens

The club palette and the scales every CCK project builds on: spacing, type,
weights, tracking, leading, motion, measure, layers, border widths, the touch
target and breakpoints. The club site's look is the reference; the tools use
the same tokens so they feel like part of it. Dark only, sharp corners, orange
accent, bright teal for brand and focus.

`src/tokens.ts` is the source. `tokens.css` and `breakpoints.css` are generated
from it with `npm run generate`, and a test fails when either drifts apart from
it.

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

| Prefix                                | Holds                                          |
| :------------------------------------ | :--------------------------------------------- |
| `--color-bg-*`, `--color-*`           | The palette (`--color-accent`)                 |
| `--rgb-*`                             | RGB channels, space separated                  |
| `--alpha-<percent>`                   | The opacity scale                              |
| `--color-text-*`, `--color-disabled`  | Text tiers, strong to faint, and disabled      |
| `--color-border-*`                    | Border colors by state                         |
| `--color-surface-*`                   | Panels, fields, scrims and tints               |
| `--color-highlight-*`                 | The one accent card that stands out            |
| `--color-secondary-*`                 | Teal fills and borders                         |
| `--color-focus`, `-error`, `-warning` | State colors, aliased to the palette           |
| `--border-*`, `--focus-ring*`         | Shorthands built from the tokens above         |
| `--background-selected`               | The accent tint for a picked option or row     |
| `--font-*`, `--font-size-*`           | Families and the type scale, in px             |
| `--font-weight-*`                     | The weight scale, regular and semibold         |
| `--space-*`, `--measure-*`            | Spacing and content widths, in px              |
| `--tracking-*`, `--leading-*`         | Letter spacing (em) and line height            |
| `--border-width-*`, `--touch-target`  | Border widths and the smallest tap area, in px |
| `--layer-*`, `--duration-*`           | z-index layers and motion, in ms               |

Compose a translucent color from a channel and a step of the scale instead of a
loose number: `rgb(var(--rgb-accent) / var(--alpha-20))`.

Any color from the brand manual that is too dark for small text on the
near-black background gets a lightened `-light` sibling that passes WCAG AA.
The tests check every text tier and text color against the three backgrounds.

### Breakpoints

Media queries cannot read custom properties, so the breakpoints (480, 768 and
1024 px) ship as `@custom-media` in `breakpoints.css`. It emits no CSS, so
import it at the top of every stylesheet that uses them, CSS modules included:

```css
@import "@cckarchev/shared/breakpoints.css";

@media (--below-tablet) {
  /* ... */
}
```

The queries are `--phone`, `--below-tablet`, `--tablet-up` and `--desktop-up`.
Custom media is still a draft, so the project has to compile it with Lightning
CSS (`css.lightningcss.drafts.customMedia: true` in Vite). For `matchMedia`,
use the same strings from `MEDIA_QUERY` in `@cckarchev/shared/tokens`.

Tokens that belong to one project (a card's aspect ratio, a header height, a
game's faction colors) stay in that project, defined on top of these.

## Commands

Requires Node 24.21 or later (`.node-version`).

| Command              | What it does                                                        |
| :------------------- | :------------------------------------------------------------------ |
| `npm run verify`     | Runs check, typecheck and test, as CI does                          |
| `npm run check`      | Lints and checks formatting with Biome                              |
| `npm run check:fix`  | Applies Biome's safe fixes and formatting                           |
| `npm run typecheck`  | Type checks with `tsc`                                              |
| `npm test`           | Runs the tests once                                                 |
| `npm run test:watch` | Runs the tests in watch mode                                        |
| `npm run generate`   | Regenerates `tokens.css` and `breakpoints.css` from `src/tokens.ts` |

## Releasing

Bump `version` in `package.json`, tag the commit as `v<version>`, and push the
tag. Each project upgrades by changing the tag in its dependency.
