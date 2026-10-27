// CCK design tokens: the club palette and the scales every CCK project builds
// on. TS/TSX imports the constants and helpers from
// `@cckarchev/shared/tokens`; CSS imports `@cckarchev/shared/tokens.css` and
// `@cckarchev/shared/breakpoints.css`, which scripts/writeCss.ts generates from
// this file.
//
// This file must stay self-contained (no imports): projects compile it with
// their own TypeScript settings.

// ─── Base palette ────────────────────────────────────────────────────────────
// The club brand manual's colors. Dark only.

export const BACKGROUND_BASE = "#0b0d0e";
export const BACKGROUND_SURFACE = "#121517";
export const BACKGROUND_TINT = "#1c2124";
export const BACKGROUND_DEEP = "#060708";
// The text color, a warm off-white. Text always shows it at one of the tiers
// below, never bare.
export const PAPER = "#f5f1e8";
export const ACCENT = "#f36b21";
// Dark teal for fills and borders; too dark for text.
export const SECONDARY = "#1e6b78";
// Bright teal for the brand, focus rings and teal text.
export const BRAND_TEAL = "#2bb3c4";
// The brand manual's colors for warnings and prizes.
export const RUST = "#7a1f14";
// RUST lightened for legible text and borders on the near-black background;
// RUST itself is too dark for that (1.9:1 contrast, fails WCAG AA). Light
// enough to keep 4.5:1 on the tint background too.
export const RUST_LIGHT = "#de6456";
export const GOLD = "#d9a441";
// Not in the brand manual: the green for a completed or valid state, which the
// manual has no color for.
export const SUCCESS = "#46af73";
export const WHITE = "#ffffff";
export const BLACK = "#000000";
// Text on accent fills: the base background, so it reads as cut out.
export const INK_ON_ACCENT = BACKGROUND_BASE;

// ─── RGB channels ────────────────────────────────────────────────────────────
// Derived from the palette, space separated for the modern rgb() syntax.
// Exported as CSS custom properties (--rgb-accent and so on), so CSS writes
// rgb(var(--rgb-accent) / var(--alpha-50)) without repeating the numbers.

const HEX_RADIX = 16;
const HEX_PAIR_LENGTH = 2;
const RED_HEX_START = 1;
const GREEN_HEX_START = 3;
const BLUE_HEX_START = 5;

// '#f36b21' becomes '243 107 33'.
const channelsOf = (hex: string): string => {
  const readPair = (start: number): number => {
    const pair = hex.slice(start, start + HEX_PAIR_LENGTH);

    return parseInt(pair, HEX_RADIX);
  };

  const channels = [RED_HEX_START, GREEN_HEX_START, BLUE_HEX_START].map(
    readPair,
  );

  return channels.join(" ");
};

export const TEXT_RGB = channelsOf(PAPER);
export const WHITE_RGB = channelsOf(WHITE);
export const BLACK_RGB = channelsOf(BLACK);
export const DARK_RGB = channelsOf(BACKGROUND_DEEP);
export const BACKGROUND_RGB = channelsOf(BACKGROUND_BASE);
export const PANEL_RGB = channelsOf(BACKGROUND_SURFACE);
export const ACCENT_RGB = channelsOf(ACCENT);
export const TEAL_RGB = channelsOf(BRAND_TEAL);
export const RUST_RGB = channelsOf(RUST);
export const RUST_LIGHT_RGB = channelsOf(RUST_LIGHT);
export const GOLD_RGB = channelsOf(GOLD);

// ─── Opacity scale ───────────────────────────────────────────────────────────
// Every translucent color takes its alpha from this scale, keyed by percent.
// Exported as CSS custom properties (--alpha-5 to --alpha-80).

export const ALPHA = {
  5: 0.05,
  10: 0.1,
  20: 0.2,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  80: 0.8,
} as const;

export type AlphaStep = keyof typeof ALPHA;

// ─── Font families ───────────────────────────────────────────────────────────
// All three ship with this package, declared in fonts.css. Each family falls
// back to a metric-adjusted local font, so the layout doesn't shift when the
// web font swaps in.

export const FONT_FAMILY = {
  display:
    '"Big Noodle Titling", "Big Noodle Titling Fallback", system-ui, sans-serif',
  body: '"Barlow", "Barlow Fallback", system-ui, sans-serif',
  mono: '"JetBrains Mono", "JetBrains Mono Fallback", monospace',
} as const;

// ─── Type scale ──────────────────────────────────────────────────────────────
// Every font size takes a step from this scale, in px. Exported as CSS custom
// properties (--font-size-sm to --font-size-3xl). md is the body text size.
// Fluid clamp() headings are the only exception. sm is the floor: the
// uppercase mono labels get hard to read below 13px.

export const FONT_SIZE = {
  sm: 13,
  md: 16,
  lg: 20,
  xl: 28,
  "2xl": 40,
  "3xl": 72,
} as const;

// ─── Weight scale ────────────────────────────────────────────────────────────
// Every font-weight takes a step from this scale. Exported as CSS custom
// properties (--font-weight-regular and so on). Big Noodle ships a single
// weight, so display text always uses semibold.

export const FONT_WEIGHT = {
  regular: 400,
  semibold: 600,
} as const;

// ─── Spacing scale ───────────────────────────────────────────────────────────
// Every padding, margin and gap takes a step from this scale, in px. Exported
// as CSS custom properties (--space-3xs to --space-4xl). md is the most common
// gap. Hairline gaps, em-relative spacing and fluid clamp() values are the only
// exceptions.

export const SPACE = {
  "3xs": 2,
  "2xs": 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
  "4xl": 120,
} as const;

// ─── Tracking scale ──────────────────────────────────────────────────────────
// Every letter-spacing takes a step from this scale, in em. Exported as CSS
// custom properties (--tracking-tight to --tracking-xl). tight closes up
// display headings, the rest open up uppercase labels.

export const TRACKING = {
  tight: -0.04,
  sm: 0.08,
  md: 0.12,
  lg: 0.2,
  xl: 0.28,
} as const;

// ─── Leading scale ───────────────────────────────────────────────────────────
// Every line-height takes a step from this scale, named by use. Exported as CSS
// custom properties (--leading-solid to --leading-body). Unitless values, so
// they are named rather than keyed by number.

export const LEADING = {
  solid: 1,
  snug: 1.3,
  body: 1.6,
} as const;

// ─── Motion scale ────────────────────────────────────────────────────────────
// Every transition and one-shot animation takes a duration from this scale, in
// milliseconds. Exported as CSS custom properties (--duration-fast and so on).
// Looping animations keep their own period, since that is a rhythm, not a
// speed.

export const DURATION = {
  fast: 150,
  medium: 300,
  slow: 500,
} as const;

// ─── Measure scale ───────────────────────────────────────────────────────────
// Every max-width that caps a line length or a content column takes a step from
// this scale, in px. Exported as CSS custom properties (--measure-sm to
// --measure-xl). xl is the page column. Widths in ch stay local, since they
// follow the font rather than the layout.

export const MEASURE = {
  sm: 480,
  md: 640,
  lg: 800,
  xl: 1280,
} as const;

// ─── Layer scale ─────────────────────────────────────────────────────────────
// Every z-index names its layer from this scale, by what the element is.
// Exported as CSS custom properties (--layer-content and so on). A floating
// element only competes with the layers of its own stacking context, so a
// popover inside content still scrolls under a sticky bar.

export const LAYER = {
  // Lifted over its siblings, with no meaning across the page.
  raised: 1,
  // Page content over a decorative background.
  content: 2,
  // The page header and sticky bars.
  bar: 3,
  // Modal dialogs and their scrim.
  overlay: 50,
  // Floating UI anchored to a trigger: tooltips, popovers, menus. Above
  // overlays, so one opened from a dialog shows.
  popover: 60,
  // Full-screen panels, which cover any popover left open.
  sheet: 70,
  toast: 80,
} as const;

// ─── Border width scale ──────────────────────────────────────────────────────
// Every border and outline width takes a step from this scale, in px. Exported
// as CSS custom properties (--border-width-thin and so on). SVG stroke widths
// are in viewBox units, so they stay with their geometry.

export const BORDER_WIDTH = {
  thin: 1,
  thick: 2,
  heavy: 4,
} as const;

// ─── Touch target ────────────────────────────────────────────────────────────
// The smallest tap area for a control, in px (44, the usual mobile guideline).
// Exported as --touch-target.

export const TOUCH_TARGET = 44;

// ─── Breakpoints ─────────────────────────────────────────────────────────────
// Viewport widths where layouts change, in px. Media queries cannot read custom
// properties, so CSS gets them as @custom-media from breakpoints.css (needs
// Lightning CSS with drafts.customMedia) and JS gets the same query strings
// from MEDIA_QUERY, for matchMedia.

export const BREAKPOINT = {
  phone: 480,
  tablet: 768,
  desktop: 1024,
} as const;

// below-tablet stops a fraction of a pixel short of tablet-up, so a fractional
// viewport width never matches both or neither.
const JUST_BELOW = 0.02;

export const MEDIA_QUERY = {
  phone: `(max-width: ${BREAKPOINT.phone}px)`,
  belowTablet: `(max-width: ${BREAKPOINT.tablet - JUST_BELOW}px)`,
  tabletUp: `(min-width: ${BREAKPOINT.tablet}px)`,
  desktopUp: `(min-width: ${BREAKPOINT.desktop}px)`,
} as const;

// ─── Color helpers ───────────────────────────────────────────────────────────
// Use these in TSX/TS instead of raw rgb() strings.

const withChannels = (channels: string, alpha: number): string =>
  `rgb(${channels} / ${alpha})`;

export const text = (alpha: number): string => withChannels(TEXT_RGB, alpha);
export const white = (alpha: number): string => withChannels(WHITE_RGB, alpha);
export const black = (alpha: number): string => withChannels(BLACK_RGB, alpha);
export const dark = (alpha: number): string => withChannels(DARK_RGB, alpha);
export const panel = (alpha: number): string => withChannels(PANEL_RGB, alpha);
export const accent = (alpha: number): string =>
  withChannels(ACCENT_RGB, alpha);
export const teal = (alpha: number): string => withChannels(TEAL_RGB, alpha);

// Fades a color given in any CSS form (hex, rgb(), a custom property) to an
// opacity step, for colors that only arrive at runtime.
export const withAlpha = (color: string, step: AlphaStep): string =>
  `color-mix(in srgb, ${color} ${step}%, transparent)`;

// ─── Text tiers ──────────────────────────────────────────────────────────────
// From headings down to secondary labels. Text color always picks one of these
// instead of its own alpha. Even dim keeps 6:1 on every background, since the
// smallest labels use it. Faint is for decoration, never for reading.

export const TEXT_TIER_ALPHA = {
  strong: 1,
  body: ALPHA[80],
  muted: ALPHA[70],
  dim: ALPHA[60],
} as const;

export const TEXT_STRONG = text(TEXT_TIER_ALPHA.strong);
export const TEXT_BODY = text(TEXT_TIER_ALPHA.body);
export const TEXT_MUTED = text(TEXT_TIER_ALPHA.muted);
export const TEXT_DIM = text(TEXT_TIER_ALPHA.dim);
export const TEXT_FAINT = text(ALPHA[20]);

// ─── Role colors ─────────────────────────────────────────────────────────────
// Every surface, border and state color, built from the palette at a step of
// the opacity scale. Exported as CSS custom properties (--color-border-default
// and so on).

export const BORDER = {
  divider: white(ALPHA[10]),
  default: white(ALPHA[20]),
  hover: white(ALPHA[30]),
  focus: white(ALPHA[40]),
  active: white(ALPHA[50]),
  accentSoft: accent(ALPHA[40]),
  accent: accent(ALPHA[70]),
} as const;

// Disabled borders look like dividers for now. A token of its own, so the two
// can part ways later.
export const BORDER_DISABLED = BORDER.divider;

export const SURFACE = {
  // Cards and panels over a decorative background; hover thickens them.
  panel: panel(ALPHA[70]),
  panelHover: panel(ALPHA[80]),
  // Zebra stripes and the faintest lift off the background.
  faint: white(ALPHA[5]),
  dark: dark(ALPHA[80]),
  field: dark(ALPHA[70]),
  // Behind a modal or a drawer.
  scrim: black(ALPHA[60]),
  // A faint accent wash, for hovers and quiet accent surfaces.
  accentTint: accent(ALPHA[10]),
} as const;

// The one accent card that stands out in a group.
export const HIGHLIGHT = {
  background: accent(ALPHA[20]),
  border: accent(ALPHA[50]),
  borderHover: accent(ALPHA[80]),
} as const;

// Teal fills and borders for secondary information.
export const SECONDARY_ROLE = {
  tint: teal(ALPHA[10]),
  tintStrong: teal(ALPHA[20]),
  border: teal(ALPHA[50]),
  borderHover: teal(ALPHA[70]),
} as const;

export const DISABLED = text(ALPHA[30]);
