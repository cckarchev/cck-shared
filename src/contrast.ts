// WCAG 2 contrast math, used to keep the palette's text tiers legible.

export type RgbChannels = [number, number, number];

const CHANNEL_MAX = 255;
const LINEAR_THRESHOLD = 0.03928;
const LINEAR_DIVISOR = 12.92;
const GAMMA_OFFSET = 0.055;
const GAMMA_DIVISOR = 1.055;
const GAMMA_EXPONENT = 2.4;
const RED_WEIGHT = 0.2126;
const GREEN_WEIGHT = 0.7152;
const BLUE_WEIGHT = 0.0722;
// Flare term from the WCAG formula, added to both luminances.
const FLARE = 0.05;

// Parses an RGB channel string such as '245 241 232'.
export const parseRgbChannels = (channels: string): RgbChannels => {
  const [red = 0, green = 0, blue = 0] = channels
    .trim()
    .split(/\s+/)
    .map((channel) => Number(channel));

  return [red, green, blue];
};

const HEX_RADIX = 16;
const RED_HEX_START = 1;
const GREEN_HEX_START = 3;
const BLUE_HEX_START = 5;
const HEX_PAIR_LENGTH = 2;

// Parses a six digit hex color such as '#1c2124'.
export const parseHexColor = (color: string): RgbChannels => {
  const readPair = (start: number): number => {
    const pair = color.slice(start, start + HEX_PAIR_LENGTH);

    return parseInt(pair, HEX_RADIX);
  };

  return [
    readPair(RED_HEX_START),
    readPair(GREEN_HEX_START),
    readPair(BLUE_HEX_START),
  ];
};

// The opaque color a translucent foreground shows over an opaque background.
export const blendOver = (
  foreground: RgbChannels,
  background: RgbChannels,
  alpha: number,
): RgbChannels => {
  const blendChannel = (
    foregroundChannel: number,
    backgroundChannel: number,
  ): number => {
    const foregroundPart = foregroundChannel * alpha;
    const backgroundPart = backgroundChannel * (1 - alpha);

    return foregroundPart + backgroundPart;
  };

  const [foregroundRed, foregroundGreen, foregroundBlue] = foreground;
  const [backgroundRed, backgroundGreen, backgroundBlue] = background;

  return [
    blendChannel(foregroundRed, backgroundRed),
    blendChannel(foregroundGreen, backgroundGreen),
    blendChannel(foregroundBlue, backgroundBlue),
  ];
};

const linearize = (channel: number): number => {
  const normalized = channel / CHANNEL_MAX;

  if (normalized <= LINEAR_THRESHOLD) {
    return normalized / LINEAR_DIVISOR;
  }

  return ((normalized + GAMMA_OFFSET) / GAMMA_DIVISOR) ** GAMMA_EXPONENT;
};

const relativeLuminance = ([red, green, blue]: RgbChannels): number => {
  const redPart = RED_WEIGHT * linearize(red);
  const greenPart = GREEN_WEIGHT * linearize(green);
  const bluePart = BLUE_WEIGHT * linearize(blue);

  return redPart + greenPart + bluePart;
};

// WCAG contrast ratio between two opaque colors, from 1 to 21.
export const contrastRatio = (
  first: RgbChannels,
  second: RgbChannels,
): number => {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + FLARE) / (darker + FLARE);
};
