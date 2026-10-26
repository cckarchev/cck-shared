# cck-shared

Shared configuration for CCK projects, so every repo follows the same standards
without copying files around.

## Biome

Install it as a git dependency pinned to a tag, next to Biome itself:

```sh
npm install --save-dev github:cckarchev/cck-shared#v1.1.0 @biomejs/biome@2.6.2
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

## Releasing

Bump `version` in `package.json`, tag the commit as `v<version>`, and push the
tag. Each project upgrades by changing the tag in its dependency.
