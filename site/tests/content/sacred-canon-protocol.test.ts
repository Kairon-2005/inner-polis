import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { repositoryPath } from "../../src/lib/repository-paths";

const readRepositoryFile = (path: string) =>
  readFile(repositoryPath(path), "utf8");

describe("Sacred Canon governance", () => {
  it("starts with a separate empty source instead of an invented entry", async () => {
    const canon = await readRepositoryFile("圣典.md");
    expect(canon).toContain("# 圣典");
    expect(canon).not.toMatch(/^```yaml$/m);
  });

  it("documents accepted-entry and candidate schema contracts", async () => {
    const schema = await readRepositoryFile("schemas/sacred-canon-schema.md");

    for (const field of [
      "entry_id: canon-YYYY-MM-DD-NNN",
      "source_candidate_id: canon-candidate-YYYY-MM-DD-NNN",
      "category: principle | lesson | core-value | essential-memory",
      'statement: "Exact Aeris-approved statement"',
      "- sessions/YYYY-MM-DD/session-file.md",
      "approved_by_aeris: true",
      "approved_at: YYYY-MM-DD",
      "supersedes: null | canon-YYYY-MM-DD-NNN",
      "state: current | superseded | archived",
      "candidate_id: canon-candidate-YYYY-MM-DD-NNN",
      "revision_of: null | canon-YYYY-MM-DD-NNN",
      'statement: "Candidate statement"',
      "created_at: YYYY-MM-DD",
      "review_status: pending | rejected | deferred | promoted",
      "approved_by_aeris: false",
    ]) {
      expect(schema).toContain(field);
    }
  });

  it("defines individual Aeris approval and revision commands", async () => {
    const review = await readRepositoryFile("prompts/sacred-canon-review.md");
    for (const command of [
      "INSCRIBE <candidate-id>",
      "EDIT-CANON <candidate-id>: <replacement>",
      "REJECT-CANON <candidate-id>",
      "DEFER-CANON <candidate-id>",
      "REVISE-CANON <entry-id>: <replacement>",
      "ARCHIVE-CANON <entry-id>",
      "KEEP-CANON <entry-id>",
    ]) expect(review).toContain(command);
    expect(review).toMatch(/only Aeris may approve/i);
    expect(review).toMatch(/saved and closed before/i);
    expect(review).toMatch(/must not claim.+changed the repository/is);
  });

  it("loads the complete canon only after an explicit consultation request", async () => {
    const instructions = await readRepositoryFile(
      "prompts/chatgpt-project-instructions.md",
    );
    expect(instructions).toContain("查考圣典");
    expect(instructions).toContain("Kairon-2005/inner-polis");
    expect(instructions).toContain("literal branch `main`");
    expect(instructions).toContain("`圣典.md`");
    expect(instructions).toMatch(/complete fetched file/i);
    expect(instructions).toMatch(/not part of the default.+OPEN.+LOAD.+DIALOGUE/is);
    expect(instructions).toMatch(/do not.+load `memory\/\*`/is);
  });

  it("keeps Sacred Canon candidates distinct in the session template", async () => {
    const template = await readRepositoryFile("templates/session.md");
    expect(template).toContain("## Sacred Canon Candidates");
    expect(template).toContain("No candidates unless explicitly listed");
    expect(template).toContain("approved_by_aeris: false");
  });
});
