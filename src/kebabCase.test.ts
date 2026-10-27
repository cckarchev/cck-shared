import { describe, expect, it } from "vitest";
import { toKebabCase } from "./kebabCase.ts";

describe("toKebabCase", () => {
  it("splits a camelCase name at each capital", () => {
    expect(toKebabCase("belowTablet")).toBe("below-tablet");
    expect(toKebabCase("panelHoverStrong")).toBe("panel-hover-strong");
  });

  it("leaves a lowercase name and a numeric step as they are", () => {
    expect(toKebabCase("phone")).toBe("phone");
    expect(toKebabCase("2xl")).toBe("2xl");
  });
});
