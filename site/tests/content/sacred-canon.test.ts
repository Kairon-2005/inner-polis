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

const markdownYamlBlock = (
  record: Record<string, unknown>,
  {
    indent = 0,
    label = "yaml",
    marker = "```",
    terminated = true,
  }: {
    indent?: number;
    label?: string;
    marker?: "```" | "~~~";
    terminated?: boolean;
  } = {},
) => {
  const padding = " ".repeat(indent);
  const body = stringify(record)
    .trimEnd()
    .split("\n")
    .map((line) => `${padding}${line}`)
    .join("\n");
  return [
    `${padding}${marker}${label}`,
    body,
    ...(terminated ? [`${padding}${marker}`] : []),
  ].join("\n");
};

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

  it("rejects an unterminated YAML fence with the source path", () => {
    expect(() => parseSacredCanon("\`\`\`yaml\nentry_id: canon-2026-08-30-001", "圣典.md"))
      .toThrow(/圣典\.md.+(?:YAML|fence)/is);
  });

  it.each([
    [0, "yaml"],
    [1, "YAML"],
    [2, "Yaml"],
    [3, "yAmL"],
  ])("parses a YAML fence with %i leading spaces and a %s label", (indent, label) => {
    expect(parseSacredCanon(markdownYamlBlock(valid(), { indent, label })))
      .toEqual([expect.objectContaining({ entry_id: "canon-2026-08-30-001" })]);
  });

  it("parses a tilde-fenced YAML entry", () => {
    expect(parseSacredCanon(markdownYamlBlock(valid(), { marker: "~~~" })))
      .toEqual([expect.objectContaining({ entry_id: "canon-2026-08-30-001" })]);
  });

  it.each([
    [0, "YAML"],
    [1, "Yaml"],
    [2, "yAmL"],
    [3, "yaml"],
  ])("rejects an unterminated YAML fence with %i leading spaces and a %s label", (
    indent,
    label,
  ) => {
    const markdown = markdownYamlBlock(valid(), { indent, label, terminated: false });
    expect(() => parseSacredCanon(markdown, "圣典.md"))
      .toThrow(/圣典\.md.+(?:YAML|fence)/is);
  });

  it("does not treat YAML-looking content inside an ordinary code fence as an entry", () => {
    const markdown = ["~~~text", yamlBlock(valid()), "~~~"].join("\n");
    expect(parseSacredCanon(markdown)).toEqual([]);
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

  it.each(["entry_id", "source_candidate_id", "category", "statement", "approved_at", "state"])(
    "rejects a whitespace-only %s",
    (field) => {
      expect(() => parseSacredCanon(yamlBlock(valid({ [field]: " \t " }))))
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
    [["   "], "source"],
    [[17], "source"],
    ["sessions/file.md", "source"],
  ])("rejects invalid source value %j", (source, field) => {
    expect(() => parseSacredCanon(yamlBlock(valid({ source }))))
      .toThrow(new RegExp(field));
  });

  it.each([
    "/absolute/session.md",
    "C:\\absolute\\session.md",
    "https://example.com/session.md",
    "../outside.md",
    "sessions/../../outside.md",
  ])("rejects non-repository-relative source path %j", (source) => {
    expect(() => parseSacredCanon(yamlBlock(valid({ source: [source] }))))
      .toThrow(/source/);
  });

  it("rejects a source array when any item leaves the repository", () => {
    expect(() => parseSacredCanon(yamlBlock(valid({
      source: ["sessions/2026-08-30/session-file.md", "sessions/../../outside.md"],
    }))))
      .toThrow(/source/);
  });

  it.each(["", "   ", 17, false])("rejects invalid supersedes value %j", (supersedes) => {
    expect(() => parseSacredCanon(yamlBlock(valid({ supersedes }))))
      .toThrow(/supersedes/);
  });

  it("rejects unrecognized accepted-entry fields", () => {
    expect(() => parseSacredCanon(yamlBlock(valid({ notes: "not in the schema" }))))
      .toThrow(/notes|unrecognized|unexpected/i);
  });

  it("does not impose unstated ID or date formats", () => {
    expect(parseSacredCanon(yamlBlock(valid({
      entry_id: "entry",
      source_candidate_id: "candidate",
      approved_at: "when Aeris approved it",
    })))).toEqual([
      expect.objectContaining({
        entry_id: "entry",
        source_candidate_id: "candidate",
        approved_at: "when Aeris approved it",
      }),
    ]);
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
