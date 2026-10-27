import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ACCENT,
  ACCENT_RGB,
  ALPHA,
  BORDER,
  DURATION,
  FONT_FAMILY,
  FONT_WEIGHT,
  SPACE,
  TEXT_BODY,
  TOUCH_TARGET,
  TRACKING,
} from "./tokens.ts";
import { tokensCss } from "./tokensCss.ts";

const GENERATED_FILE = new URL("../tokens.css", import.meta.url);

const declarationsOf = (css: string): string[] =>
  css
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("--"));

const propertyOf = (declaration: string): string => {
  const [property = ""] = declaration.split(":");

  return property;
};

describe("tokensCss", () => {
  it("declares every token in a single :root block", () => {
    const css = tokensCss();
    const rootBlocks = css.match(/:root \{/g) ?? [];

    expect(rootBlocks).toHaveLength(1);
    expect(css.trimEnd().endsWith("}")).toBe(true);
  });

  it("declares each property once", () => {
    const properties = declarationsOf(tokensCss()).map(propertyOf);

    expect(new Set(properties).size).toBe(properties.length);
  });

  it("declares the palette and its RGB channels", () => {
    const declarations = declarationsOf(tokensCss());

    expect(declarations).toContain(`--color-accent: ${ACCENT};`);
    expect(declarations).toContain(`--rgb-accent: ${ACCENT_RGB};`);
  });

  it("declares the text tiers and role colors in kebab case", () => {
    const declarations = declarationsOf(tokensCss());

    expect(declarations).toContain(`--color-text-body: ${TEXT_BODY};`);
    expect(declarations).toContain(
      `--color-border-accent-soft: ${BORDER.accentSoft};`,
    );
  });

  it("adds the unit each scale is measured in", () => {
    const declarations = declarationsOf(tokensCss());

    expect(declarations).toContain(`--space-md: ${SPACE.md}px;`);
    expect(declarations).toContain(`--duration-fast: ${DURATION.fast}ms;`);
    expect(declarations).toContain(`--tracking-sm: ${TRACKING.sm}em;`);
    expect(declarations).toContain(`--touch-target: ${TOUCH_TARGET}px;`);
  });

  it("leaves unitless scales bare", () => {
    const declarations = declarationsOf(tokensCss());

    expect(declarations).toContain(`--alpha-10: ${ALPHA[10]};`);
    expect(declarations).toContain(
      `--font-weight-semibold: ${FONT_WEIGHT.semibold};`,
    );
  });

  it("declares the font families", () => {
    const declarations = declarationsOf(tokensCss());

    expect(declarations).toContain(`--font-body: ${FONT_FAMILY.body};`);
  });

  it("declares aliases as references, so they can part ways later", () => {
    const declarations = declarationsOf(tokensCss());

    expect(declarations).toContain(
      "--color-border-disabled: var(--color-border-divider);",
    );
    expect(declarations).toContain("--color-accent-ink: var(--color-bg-base);");
  });

  it("builds the shorthands from other tokens", () => {
    const declarations = declarationsOf(tokensCss());

    expect(declarations).toContain(
      "--focus-ring: var(--border-width-thick) solid var(--color-focus);",
    );
    expect(declarations).toContain(
      "--border-default: var(--border-width-thin) solid var(--color-border-default);",
    );
  });
});

describe("tokens.css", () => {
  it("is up to date with src/tokens.ts (run `npm run generate`)", () => {
    const generated = readFileSync(GENERATED_FILE, "utf8");

    expect(generated).toBe(tokensCss());
  });
});
