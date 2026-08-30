import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { sitePath } from "../../src/lib/repository-paths";

describe("Sacred Canon dialog component", () => {
  it("renders every required read-only field from validated entries", async () => {
    const source = await readFile(
      sitePath("src/components/SacredCanonDialog.astro"),
      "utf8",
    );
    for (const field of [
      "entry.category",
      "entry.statement",
      "entry.entry_id",
      "entry.approved_at",
      "entry.source",
    ]) expect(source).toContain(field);
    expect(source).toContain("圣典尚无条目");
    expect(source).not.toMatch(/contenteditable|<form|<textarea|localStorage|fetch\(/);
  });
});
