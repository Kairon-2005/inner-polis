import { describe, expect, it } from "vitest";
import config from "../astro.config.mjs";

describe("Astro GitHub Pages configuration", () => {
  it("builds the project site under /inner-polis", () => {
    expect(config.site).toBe("https://kairon-2005.github.io");
    expect(config.base).toBe("/inner-polis");
    expect(config.output).toBe("static");
  });
});
