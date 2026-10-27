import { describe, expect, it } from "vitest";
import {
  blendOver,
  contrastRatio,
  parseHexColor,
  parseRgbChannels,
  type RgbChannels,
} from "./contrast.ts";

const CHANNEL_MAX = 255;
const BLACK: RgbChannels = [0, 0, 0];
const WHITE: RgbChannels = [CHANNEL_MAX, CHANNEL_MAX, CHANNEL_MAX];
const MAX_CONTRAST = 21;
const HALF = 0.5;
const PRECISION = 2;

// The theme's text color, as its RGB string and as channels.
const TEXT_RED = 245;
const TEXT_GREEN = 241;
const TEXT_BLUE = 232;
const TEXT_RGB_STRING = `${TEXT_RED} ${TEXT_GREEN} ${TEXT_BLUE}`;

// The panel color, as a hex string and as channels.
const PANEL_HEX = "#1c2124";
const PANEL_RED = 28;
const PANEL_GREEN = 33;
const PANEL_BLUE = 36;

const MID_GRAY_CHANNEL = CHANNEL_MAX * HALF;

describe("parseRgbChannels", () => {
  it("reads a space separated channel list", () => {
    expect(parseRgbChannels(TEXT_RGB_STRING)).toEqual([
      TEXT_RED,
      TEXT_GREEN,
      TEXT_BLUE,
    ]);
  });
});

describe("parseHexColor", () => {
  it("reads a six digit hex color", () => {
    expect(parseHexColor(PANEL_HEX)).toEqual([
      PANEL_RED,
      PANEL_GREEN,
      PANEL_BLUE,
    ]);
  });
});

describe("blendOver", () => {
  it("mixes a translucent color over an opaque background", () => {
    expect(blendOver(WHITE, BLACK, HALF)).toEqual([
      MID_GRAY_CHANNEL,
      MID_GRAY_CHANNEL,
      MID_GRAY_CHANNEL,
    ]);
  });

  it("keeps the foreground when fully opaque", () => {
    expect(blendOver(WHITE, BLACK, 1)).toEqual(WHITE);
  });
});

describe("contrastRatio", () => {
  it("is 21:1 between black and white, in either order", () => {
    expect(contrastRatio(WHITE, BLACK)).toBeCloseTo(MAX_CONTRAST, PRECISION);
    expect(contrastRatio(BLACK, WHITE)).toBeCloseTo(MAX_CONTRAST, PRECISION);
  });

  it("is 1:1 for the same color", () => {
    expect(contrastRatio(WHITE, WHITE)).toBe(1);
  });
});
