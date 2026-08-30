import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { repositoryPath } from "../../src/lib/repository-paths";

describe("ChatGPT Project Instructions", () => {
  it("pins every formal session to the live main-branch protocol", async () => {
    const instructions = await readFile(
      repositoryPath("prompts/chatgpt-project-instructions.md"),
      "utf8",
    );

    for (const requiredReference of [
      "Kairon-2005/inner-polis",
      "START_HERE.md",
      "role-selection.md",
      "session-protocol.md",
      "memory-review.md",
      "main",
    ]) {
      expect(instructions).toContain(requiredReference);
    }
  });

  it("keeps selection, loading, and accepted memory under explicit Aeris confirmation", async () => {
    const instructions = await readFile(
      repositoryPath("prompts/chatgpt-project-instructions.md"),
      "utf8",
    );

    expect(instructions).toMatch(/connected GitHub plugin/i);
    expect(instructions).toMatch(/ask.+question/i);
    expect(instructions).toMatch(/propose.+confirm.+1\.\.n figures/is);
    expect(instructions).toMatch(/only.+confirmed character.+prompt.+current-memory.+relevant accepted decisions/is);
    expect(instructions).toMatch(/Aeris.+review authority/is);
    expect(instructions).toMatch(/never invent accepted memory/i);
  });
});
