import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { loadAcceptedBlocks } from "../../src/lib/memory-content";
import { repositoryPath } from "../../src/lib/repository-paths";

const pendingYaml = `\`\`\`yaml
memory_id: memory-2026-08-30-001
approved_by_aeris: false
state: current
\`\`\``;

const archivedYaml = `\`\`\`yaml
memory_id: memory-2026-08-30-001
approved_by_aeris: true
state: archived
\`\`\``;

const currentApprovedYaml = `\`\`\`yaml
memory_id: memory-2026-08-30-001
source_candidate_id: candidate-2026-08-30-001
owner: aeris
visibility: sovereign
type: decision
statement: "Aeris approved this memory."
epistemic_status: observation
confidence: high
evidence:
  - sessions/2026-08-30/example.md
created_at: 2026-08-30
updated_at: 2026-08-30
approved_by_aeris: true
supersedes: null
state: current
\`\`\``;

const malformedAcceptedYaml = `\`\`\`yaml
memory_id: memory-2026-08-30-001
approved_by_aeris: true
state: current
\`\`\``;

const realStores = [
  "memory/shared/current.md",
  "memory/aeris/current.md",
  "memory/iron-regent/current.md",
  "memory/avalokita/current.md",
  "memory/metis/current.md",
  "memory/socrates/current.md",
  "memory/little-prince/current.md",
];

describe("accepted memory", () => {
  it("includes only Aeris-approved current YAML blocks", () => {
    expect(loadAcceptedBlocks(pendingYaml)).toEqual([]);
    expect(loadAcceptedBlocks(archivedYaml)).toEqual([]);
    expect(loadAcceptedBlocks(currentApprovedYaml)).toEqual([
      expect.objectContaining({
        memory_id: "memory-2026-08-30-001",
        approved_by_aeris: true,
        state: "current",
      }),
    ]);
  });

  it("rejects malformed accepted-looking records with their source path", () => {
    expect(() => loadAcceptedBlocks(malformedAcceptedYaml, "memory/aeris/current.md")).toThrow(
      "memory/aeris/current.md",
    );
  });

  it("finds no accepted records in the seven real current-memory stores", async () => {
    for (const sourcePath of realStores) {
      const markdown = await readFile(repositoryPath(sourcePath), "utf8");
      expect(loadAcceptedBlocks(markdown, sourcePath)).toEqual([]);
    }
  });
});
