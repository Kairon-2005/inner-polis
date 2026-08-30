import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { repositoryPath } from "../../src/lib/repository-paths";

const readRepositoryFile = (path: string) =>
  readFile(repositoryPath(path), "utf8");

const operationRule = (markdown: string, command: string) => {
  const heading = `### \`${command}\``;
  const start = markdown.indexOf(heading);
  if (start === -1) return "";
  const next = markdown.indexOf("\n### `", start + heading.length);
  return markdown.slice(start, next === -1 ? undefined : next);
};

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

  it("defines exact INSCRIBE and EDIT-CANON candidate state effects", async () => {
    const review = await readRepositoryFile("prompts/sacred-canon-review.md");
    const inscribe = operationRule(review, "INSCRIBE <candidate-id>");
    const edit = operationRule(review, "EDIT-CANON <candidate-id>: <replacement>");

    expect(inscribe).toMatch(/identified candidate/i);
    expect(inscribe).toContain("review_status: promoted");
    expect(inscribe).toMatch(/exactly one accepted entry/i);
    expect(inscribe).toMatch(/category.+exactly/is);
    expect(inscribe).toMatch(/statement.+exactly/is);

    expect(edit).toContain("review_status: pending");
    expect(edit).toMatch(/later `INSCRIBE`/i);
    expect(edit).toMatch(/does not change `圣典\.md`/i);
  });

  it("limits REJECT-CANON and DEFER-CANON to the closed-session candidate", async () => {
    const review = await readRepositoryFile("prompts/sacred-canon-review.md");
    const reject = operationRule(review, "REJECT-CANON <candidate-id>");
    const defer = operationRule(review, "DEFER-CANON <candidate-id>");

    expect(reject).toMatch(/closed session.+only/is);
    expect(reject).toContain("review_status: rejected");
    expect(reject).toMatch(/does not change `圣典\.md`/i);

    expect(defer).toMatch(/closed session.+only/is);
    expect(defer).toContain("review_status: deferred");
    expect(defer).toMatch(/does not change `圣典\.md`/i);
  });

  it("defines the two-step revision transition", async () => {
    const review = await readRepositoryFile("prompts/sacred-canon-review.md");
    const revise = operationRule(review, "REVISE-CANON <entry-id>: <replacement>");

    expect(revise).toMatch(/new pending candidate/i);
    expect(revise).toContain("revision_of");
    expect(revise).toMatch(/later `INSCRIBE`/i);
    expect(revise).toContain("supersedes");
    expect(revise).toContain("state: superseded");
  });

  it("defines confirmation-gated ARCHIVE-CANON and no-op KEEP-CANON", async () => {
    const review = await readRepositoryFile("prompts/sacred-canon-review.md");
    const archive = operationRule(review, "ARCHIVE-CANON <entry-id>");
    const keep = operationRule(review, "KEEP-CANON <entry-id>");

    expect(archive).toMatch(/only after Aeris confirms/i);
    expect(archive).toContain("state: archived");
    expect(archive).toMatch(/preserv.+source/is);

    expect(keep).toMatch(/changes nothing|makes no change/i);
    expect(keep).toMatch(/closed-session candidate.+`圣典\.md`/is);
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
