// Writes tokens.css and breakpoints.css from src/tokens.ts. Run with
// `npm run generate` after changing a token.

import { writeFileSync } from "node:fs";
import { breakpointsCss } from "../src/breakpointsCss.ts";
import { tokensCss } from "../src/tokensCss.ts";

const TOKENS_FILE = new URL("../tokens.css", import.meta.url);
const BREAKPOINTS_FILE = new URL("../breakpoints.css", import.meta.url);

writeFileSync(TOKENS_FILE, tokensCss());
writeFileSync(BREAKPOINTS_FILE, breakpointsCss());
