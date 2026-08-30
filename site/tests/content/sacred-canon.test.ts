import { describe, expect, it } from "vitest";
import { stringify } from "yaml";
import { loadSacredCanon, parseSacredCanon } from "../../src/lib/sacred-canon-content";

const valid = (overrides: Record<string, unknown> = {}) => ({
  entry_id: "canon-2026-08-30-001",
  source_candidate_id: "canon-candidate-2026-08-30-001",
  category: "principle",
  statement: "Exact statement",
  source: ["sessions/2026-08-30/session-file.md"],
  approved_by_aeris: true,
  approved_at: "2026-08-30",
  supersedes: null,
  state: "current",
  ...overrides,
});

const yamlBlock = (record: Record<string, unknown>) =>
  `\`\`\`yaml\n${stringify(record)}\`\`\``;

const without = (field: string): Record<string, unknown> => {
  const record: Record<string, unknown> = valid();
  delete record[field];
  return record;
};

describe("Sacred Canon content", () => {
  it("accepts an empty canon", () => {
    expect(parseSacredCanon("# 圣典\n\n当前尚无条目。")).toEqual([]);
  });

  it("returns only approved current entries after validating all states", () => {
    const markdown = [
      yamlBlock(valid()),
      yamlBlock(valid({
        entry_id: "canon-2026-08-30-002",
        source_candidate_id: "canon-candidate-2026-08-30-002",
        state: "superseded",
      })),
      yamlBlock(valid({
        entry_id: "canon-2026-08-30-003",
        source_candidate_id: "canon-candidate-2026-08-30-003",
        state: "archived",
      })),
    ].join("\n\n");
    expect(parseSacredCanon(markdown)).toEqual([expect.objectContaining({
      entry_id: "canon-2026-08-30-001",
      state: "current",
    })]);
  });

  it("rejects malformed YAML with the source path", () => {
    expect(() => parseSacredCanon("\`\`\`yaml\nentry_id: [\n\`\`\`", "圣典.md"))
      .toThrow(/圣典\.md.+YAML/is);
  });

  it("rejects invalid non-current entries instead of silently skipping them", () => {
    expect(() => parseSacredCanon(yamlBlock(valid({ state: "archived", statement: "" }))))
      .toThrow(/statement/);
  });

  it.each(["entry_id", "source_candidate_id", "category", "statement", "approved_at", "state"])(
    "rejects a missing %s",
    (field) => {
      expect(() => parseSacredCanon(yamlBlock(without(field))))
        .toThrow(new RegExp(field));
    },
  );

  it.each(["entry_id", "source_candidate_id", "category", "statement", "approved_at", "state"])(
    "rejects an empty %s",
    (field) => {
      expect(() => parseSacredCanon(yamlBlock(valid({ [field]: "" }))))
        .toThrow(new RegExp(field));
    },
  );

  it.each([
    ["category", "unknown"],
    ["state", "pending"],
    ["approved_by_aeris", false],
  ])("rejects unsupported %s", (field, value) => {
    expect(() => parseSacredCanon(yamlBlock(valid({ [field]: value }))))
      .toThrow(new RegExp(field));
  });

  it("rejects a missing approval", () => {
    expect(() => parseSacredCanon(yamlBlock(without("approved_by_aeris"))))
      .toThrow(/approved_by_aeris/);
  });

  it.each([
    [[], "source"],
    [[""], "source"],
    [[17], "source"],
    ["sessions/file.md", "source"],
  ])("rejects invalid source value %j", (source, field) => {
    expect(() => parseSacredCanon(yamlBlock(valid({ source }))))
      .toThrow(new RegExp(field));
  });

  it.each(["", 17, false])("rejects invalid supersedes value %j", (supersedes) => {
    expect(() => parseSacredCanon(yamlBlock(valid({ supersedes }))))
      .toThrow(/supersedes/);
  });

  it.each(["entry_id", "source_candidate_id"])("rejects duplicate %s", (field) => {
    const first = valid();
    const second = valid({
      entry_id: field === "entry_id" ? first.entry_id : "canon-2026-08-30-002",
      source_candidate_id:
        field === "source_candidate_id"
          ? first.source_candidate_id
          : "canon-candidate-2026-08-30-002",
    });
    expect(() => parseSacredCanon(`${yamlBlock(first)}\n${yamlBlock(second)}`))
      .toThrow(new RegExp(`duplicate ${field}`, "i"));
  });

  it("loads the initially empty root source", async () => {
    await expect(loadSacredCanon()).resolves.toEqual([]);
  });
});
