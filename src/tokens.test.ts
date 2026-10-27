import { describe, expect, it } from "vitest";
import {
  blendOver,
  contrastRatio,
  parseHexColor,
  parseRgbChannels,
} from "./contrast.ts";
import {
  ACCENT,
  ACCENT_RGB,
  BACKGROUND_BASE,
  BACKGROUND_SURFACE,
  BACKGROUND_TINT,
  BORDER,
  BORDER_DISABLED,
  BRAND_TEAL,
  FONT_SIZE,
  GOLD,
  INK_ON_ACCENT,
  MEASURE,
  RUST_LIGHT,
  SPACE,
  SUCCESS,
  TEXT_RGB,
  TEXT_TIER_ALPHA,
  text,
  withAlpha,
} from "./tokens.ts";

const OPACITY = 70;
const LIGHT_OPACITY = 30;
const BODY_ALPHA = 0.8;
// Two steps of a size scale closer than this read as the same size, so the
// scale keeps only one of them.
const MIN_STEP_RATIO = 1.2;
// Smallest legible size for the uppercase mono labels, the smallest text in
// any CCK project.
const MIN_FONT_SIZE = 13;
// Gray tiers carry most small text, so they get more than the WCAG AA minimum.
const MIN_TIER_CONTRAST = 6;
// WCAG AA for normal text, for colored labels.
const MIN_COLOR_CONTRAST = 4.5;

const BACKGROUNDS = {
  base: BACKGROUND_BASE,
  surface: BACKGROUND_SURFACE,
  tint: BACKGROUND_TINT,
};

const TEXT_COLORS = {
  accent: ACCENT,
  teal: BRAND_TEAL,
  rustLight: RUST_LIGHT,
  gold: GOLD,
  success: SUCCESS,
};

describe("text", () => {
  it("composes the text color at an opacity", () => {
    expect(text(BODY_ALPHA)).toBe(`rgb(${TEXT_RGB} / ${BODY_ALPHA})`);
  });
});

describe("withAlpha", () => {
  it("fades any CSS color to a step of the opacity scale", () => {
    expect(withAlpha("#1e6b78", OPACITY)).toBe(
      "color-mix(in srgb, #1e6b78 70%, transparent)",
    );
    expect(withAlpha("rgb(224 85 85)", LIGHT_OPACITY)).toBe(
      "color-mix(in srgb, rgb(224 85 85) 30%, transparent)",
    );
  });
});

describe("palette", () => {
  it("derives the RGB channels from the hex color", () => {
    expect(ACCENT_RGB).toBe("243 107 33");
  });

  it("inks accent fills with the base background", () => {
    expect(INK_ON_ACCENT).toBe(BACKGROUND_BASE);
  });

  it("draws disabled borders like dividers", () => {
    expect(BORDER_DISABLED).toBe(BORDER.divider);
  });
});

describe("size scales", () => {
  const sizeScales = {
    "font size": FONT_SIZE,
    space: SPACE,
    measure: MEASURE,
  };

  for (const [name, scale] of Object.entries(sizeScales)) {
    it(`keeps each ${name} step at least ${MIN_STEP_RATIO}x the one before`, () => {
      const steps = Object.values(scale);
      const tooClose = steps.filter((step, index) => {
        const previous = steps[index - 1];

        if (previous === undefined) {
          return false;
        }

        return step < previous * MIN_STEP_RATIO;
      });

      expect(tooClose).toEqual([]);
    });
  }
});

describe("type scale", () => {
  it(`never goes below ${MIN_FONT_SIZE}px`, () => {
    const smallest = Math.min(...Object.values(FONT_SIZE));

    expect(smallest).toBeGreaterThanOrEqual(MIN_FONT_SIZE);
  });
});

describe("text contrast", () => {
  const textChannels = parseRgbChannels(TEXT_RGB);

  for (const [tier, alpha] of Object.entries(TEXT_TIER_ALPHA)) {
    for (const [backgroundName, background] of Object.entries(BACKGROUNDS)) {
      it(`keeps the ${tier} tier at ${MIN_TIER_CONTRAST}:1 on the ${backgroundName} background`, () => {
        const backgroundChannels = parseHexColor(background);
        const shown = blendOver(textChannels, backgroundChannels, alpha);

        expect(contrastRatio(shown, backgroundChannels)).toBeGreaterThanOrEqual(
          MIN_TIER_CONTRAST,
        );
      });
    }
  }

  for (const [colorName, color] of Object.entries(TEXT_COLORS)) {
    for (const [backgroundName, background] of Object.entries(BACKGROUNDS)) {
      it(`keeps ${colorName} at ${MIN_COLOR_CONTRAST}:1 on the ${backgroundName} background`, () => {
        const ratio = contrastRatio(
          parseHexColor(color),
          parseHexColor(background),
        );

        expect(ratio).toBeGreaterThanOrEqual(MIN_COLOR_CONTRAST);
      });
    }
  }
});
