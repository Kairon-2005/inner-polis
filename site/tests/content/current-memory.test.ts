import { readFile } from "node:fs/promises";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FIGURES } from "../../src/data/figures";
import { loadCurrentMemory } from "../../src/lib/memory-content";

vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(),
}));

const sharedYaml = `\`\`\`yaml
memory_id: memory-2026-08-30-shared
source_candidate_id: candidate-2026-08-30-shared
owner: shared
visibility: council
type: observation
statement: "The shared accepted record."
epistemic_status: observation
confidence: high
evidence:
  - sessions/2026-08-30/shared.md
created_at: 2026-08-30
updated_at: 2026-08-30
approved_by_aeris: true
supersedes: null
state: current
\`\`\``;

const ownedYaml = `\`\`\`yaml
memory_id: memory-2026-08-30-aeris
source_candidate_id: candidate-2026-08-30-aeris
owner: aeris
visibility: sovereign
type: decision
statement: "The Aeris-owned accepted record."
epistemic_status: observation
confidence: high
evidence:
  - sessions/2026-08-30/aeris.md
created_at: 2026-08-30
updated_at: 2026-08-30
approved_by_aeris: true
supersedes: null
state: current
\`\`\``;

describe("current memory loading", () => {
  beforeEach(() => {
    vi.mocked(readFile).mockReset();
  });

  it("combines shared and figure-owned accepted current records", async () => {
    vi.mocked(readFile)
      .mockResolvedValueOnce(sharedYaml)
      .mockResolvedValueOnce(ownedYaml);

    const memories = await loadCurrentMemory(FIGURES[0]);

    expect(memories.map(({ memory_id, owner, statement }) => ({ memory_id, owner, statement }))).toEqual([
      {
        memory_id: "memory-2026-08-30-shared",
        owner: "shared",
        statement: "The shared accepted record.",
      },
      {
        memory_id: "memory-2026-08-30-aeris",
        owner: "aeris",
        statement: "The Aeris-owned accepted record.",
      },
    ]);
  });
});
