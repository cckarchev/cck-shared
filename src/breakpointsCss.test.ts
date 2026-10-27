import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { breakpointsCss } from "./breakpointsCss.ts";
import { BREAKPOINT, MEDIA_QUERY } from "./tokens.ts";

const GENERATED_FILE = new URL("../breakpoints.css", import.meta.url);

const customMediaOf = (css: string): string[] =>
  css
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("@custom-media"));

describe("MEDIA_QUERY", () => {
  it("builds every query from the breakpoint scale", () => {
    expect(MEDIA_QUERY.phone).toBe(`(max-width: ${BREAKPOINT.phone}px)`);
    expect(MEDIA_QUERY.tabletUp).toBe(`(min-width: ${BREAKPOINT.tablet}px)`);
    expect(MEDIA_QUERY.desktopUp).toBe(`(min-width: ${BREAKPOINT.desktop}px)`);
  });

  it("ends below-tablet just under tablet-up, so no width matches both", () => {
    const belowTabletMax = Number(
      MEDIA_QUERY.belowTablet.match(/max-width: ([\d.]+)px/)?.[1],
    );

    expect(belowTabletMax).toBeLessThan(BREAKPOINT.tablet);
    expect(belowTabletMax).toBeGreaterThan(BREAKPOINT.tablet - 1);
  });
});

describe("breakpointsCss", () => {
  it("declares one custom media per query, in kebab case", () => {
    const declarations = customMediaOf(breakpointsCss());

    expect(declarations).toEqual([
      `@custom-media --phone ${MEDIA_QUERY.phone};`,
      `@custom-media --below-tablet ${MEDIA_QUERY.belowTablet};`,
      `@custom-media --tablet-up ${MEDIA_QUERY.tabletUp};`,
      `@custom-media --desktop-up ${MEDIA_QUERY.desktopUp};`,
    ]);
  });

  it("emits no rules of its own", () => {
    const css = breakpointsCss();

    expect(css).not.toContain("{");
  });

  it("is up to date with src/tokens.ts (run `npm run generate`)", () => {
    const generated = readFileSync(GENERATED_FILE, "utf8");

    expect(generated).toBe(breakpointsCss());
  });
});
