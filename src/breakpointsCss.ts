import { toKebabCase } from "./kebabCase.ts";
import { MEDIA_QUERY } from "./tokens.ts";

const HEADER = [
  "/* Generated from src/tokens.ts by `npm run generate`. Do not edit by hand.",
  " * Import it at the top of any stylesheet that uses these media queries; it",
  " * emits no CSS of its own. Needs Lightning CSS with drafts.customMedia. */",
].join("\n");

// The whole breakpoints.css file: one @custom-media per MEDIA_QUERY entry.
export const breakpointsCss = (): string => {
  const lines = Object.entries(MEDIA_QUERY).map(
    ([name, query]) => `@custom-media --${toKebabCase(name)} ${query};`,
  );

  return `${HEADER}\n${lines.join("\n")}\n`;
};
