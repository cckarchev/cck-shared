// Writes tokens.css from src/tokens.ts. Run with `npm run generate` after
// changing a token.

import { writeFileSync } from "node:fs";
import { tokensCss } from "../src/tokensCss.ts";

const OUTPUT_FILE = new URL("../tokens.css", import.meta.url);

writeFileSync(OUTPUT_FILE, tokensCss());
