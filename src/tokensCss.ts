import { toKebabCase } from "./kebabCase.ts";
import {
  ACCENT,
  ACCENT_RGB,
  ALPHA,
  BACKGROUND_BASE,
  BACKGROUND_DEEP,
  BACKGROUND_RGB,
  BACKGROUND_SURFACE,
  BACKGROUND_TINT,
  BLACK_RGB,
  BORDER,
  BORDER_WIDTH,
  BRAND_TEAL,
  DARK_RGB,
  DISABLED,
  DURATION,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  GOLD,
  GOLD_RGB,
  HIGHLIGHT,
  LAYER,
  LEADING,
  MEASURE,
  PANEL_RGB,
  PAPER,
  RUST,
  RUST_LIGHT,
  RUST_LIGHT_RGB,
  RUST_RGB,
  SECONDARY,
  SECONDARY_ROLE,
  SPACE,
  SUCCESS,
  SURFACE,
  TEAL_RGB,
  TEXT_BODY,
  TEXT_DIM,
  TEXT_FAINT,
  TEXT_MUTED,
  TEXT_RGB,
  TEXT_STRONG,
  TOUCH_TARGET,
  TRACKING,
  WHITE,
  WHITE_RGB,
} from "./tokens.ts";

type Declaration = [property: string, value: string];

type Group = {
  title: string;
  declarations: Declaration[];
};

const HEADER =
  "/* Generated from src/tokens.ts by `npm run generate`. Do not edit by hand. */";
const INDENT = "  ";
const LINE_WIDTH = 80;

// One `--prefix-step` declaration per step of a token scale or role map.
const scaleDeclarations = (
  prefix: string,
  scale: Record<string, number | string>,
  unit: string = "",
): Declaration[] =>
  Object.entries(scale).map(([step, value]) => [
    `--${prefix}-${toKebabCase(step)}`,
    `${value}${unit}`,
  ]);

const GROUPS: Group[] = [
  {
    title: "Palette",
    declarations: [
      ["--color-bg-base", BACKGROUND_BASE],
      ["--color-bg-surface", BACKGROUND_SURFACE],
      ["--color-bg-tint", BACKGROUND_TINT],
      ["--color-bg-deep", BACKGROUND_DEEP],
      ["--color-accent", ACCENT],
      ["--color-accent-ink", "var(--color-bg-base)"],
      ["--color-secondary", SECONDARY],
      ["--color-teal", BRAND_TEAL],
      ["--color-rust", RUST],
      ["--color-rust-light", RUST_LIGHT],
      ["--color-gold", GOLD],
      ["--color-success", SUCCESS],
      ["--color-paper", PAPER],
      ["--color-white", WHITE],
    ],
  },
  {
    title: "RGB channels: rgb(var(--rgb-accent) / var(--alpha-50))",
    declarations: [
      ["--rgb-text", TEXT_RGB],
      ["--rgb-white", WHITE_RGB],
      ["--rgb-black", BLACK_RGB],
      ["--rgb-dark", DARK_RGB],
      ["--rgb-bg", BACKGROUND_RGB],
      ["--rgb-panel", PANEL_RGB],
      ["--rgb-accent", ACCENT_RGB],
      ["--rgb-teal", TEAL_RGB],
      ["--rgb-rust", RUST_RGB],
      ["--rgb-rust-light", RUST_LIGHT_RGB],
      ["--rgb-gold", GOLD_RGB],
    ],
  },
  {
    title: "Opacity scale",
    declarations: scaleDeclarations("alpha", ALPHA),
  },
  {
    title: "Text tiers",
    declarations: [
      ["--color-text-strong", TEXT_STRONG],
      ["--color-text-body", TEXT_BODY],
      ["--color-text-muted", TEXT_MUTED],
      ["--color-text-dim", TEXT_DIM],
      ["--color-text-faint", TEXT_FAINT],
      ["--color-disabled", DISABLED],
    ],
  },
  {
    title: "Role colors",
    declarations: [
      ...scaleDeclarations("color-border", BORDER),
      ["--color-border-disabled", "var(--color-border-divider)"],
      ...scaleDeclarations("color-surface", SURFACE),
      ...scaleDeclarations("color-highlight", HIGHLIGHT),
      ...scaleDeclarations("color-secondary", SECONDARY_ROLE),
      ["--color-focus", "var(--color-teal)"],
      ["--color-error", "var(--color-rust-light)"],
      ["--color-warning", "var(--color-gold)"],
    ],
  },
  {
    title: "Shorthands",
    declarations: [
      [
        "--border-default",
        "var(--border-width-thin) solid var(--color-border-default)",
      ],
      [
        "--border-divider",
        "var(--border-width-thin) solid var(--color-border-divider)",
      ],
      ["--focus-ring", "var(--border-width-thick) solid var(--color-focus)"],
      ["--focus-ring-offset", "var(--border-width-thick)"],
      // A flat accent tint laid over the surface, for the option or row that
      // is picked. Written already broken across lines, as Biome formats it.
      [
        "--background-selected",
        [
          "linear-gradient(",
          "      0deg,",
          "      var(--color-surface-accent-tint),",
          "      var(--color-surface-accent-tint)",
          "    ),",
          "    var(--color-bg-surface)",
        ].join("\n"),
      ],
    ],
  },
  {
    title: "Typography",
    declarations: [
      ...scaleDeclarations("font", FONT_FAMILY),
      ...scaleDeclarations("font-size", FONT_SIZE, "px"),
      ...scaleDeclarations("font-weight", FONT_WEIGHT),
      ...scaleDeclarations("tracking", TRACKING, "em"),
      ...scaleDeclarations("leading", LEADING),
    ],
  },
  {
    title: "Layout",
    declarations: [
      ...scaleDeclarations("space", SPACE, "px"),
      ...scaleDeclarations("measure", MEASURE, "px"),
      ...scaleDeclarations("border-width", BORDER_WIDTH, "px"),
      ...scaleDeclarations("layer", LAYER),
      ["--touch-target", `${TOUCH_TARGET}px`],
    ],
  },
  {
    title: "Motion",
    declarations: scaleDeclarations("duration", DURATION, "ms"),
  },
];

// Matches Biome's CSS formatter, so the generated file passes `biome check`: a
// declaration past the line width moves its value to the next line.
const declarationCss = ([property, value]: Declaration): string => {
  const singleLine = `${INDENT}${property}: ${value};`;
  const isMultiline = value.includes("\n");
  const fitsOnOneLine = singleLine.length <= LINE_WIDTH;

  if (fitsOnOneLine && !isMultiline) {
    return singleLine;
  }

  return `${INDENT}${property}:\n${INDENT}${INDENT}${value};`;
};

const groupCss = ({ title, declarations }: Group): string => {
  const titleLine = `${INDENT}/* ${title} */`;
  const declarationLines = declarations.map(declarationCss);

  return [titleLine, ...declarationLines].join("\n");
};

// The whole tokens.css file: every token as a custom property on :root.
export const tokensCss = (): string => {
  const body = GROUPS.map(groupCss).join("\n\n");

  return `${HEADER}\n:root {\n${body}\n}\n`;
};
