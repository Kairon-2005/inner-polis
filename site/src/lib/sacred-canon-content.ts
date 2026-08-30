import { readFile } from "node:fs/promises";
import { parse } from "yaml";
import type {
  SacredCanonCategory,
  SacredCanonEntry,
  SacredCanonState,
} from "../types/sacred-canon";
import { repositoryPath } from "./repository-paths";

const SACRED_CANON_PATH = "圣典.md";
const YAML_BLOCK = /^```yaml\s*\r?\n([\s\S]*?)^```\s*$/gm;
const CATEGORIES = new Set(["principle", "lesson", "core-value", "essential-memory"]);
const STATES = new Set(["current", "superseded", "archived"]);

type UnknownRecord = Record<string, unknown>;

const malformed = (sourcePath: string, message: string): never => {
  throw new Error(`Malformed Sacred Canon in ${sourcePath}: ${message}`);
};

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const requireString = (record: UnknownRecord, field: string, sourcePath: string): string => {
  const value = record[field];
  if (typeof value !== "string" || value.length === 0) {
    return malformed(sourcePath, `${field} must be a non-empty string`);
  }
  return value;
};

const requireMember = (
  record: UnknownRecord,
  field: string,
  values: ReadonlySet<string>,
  sourcePath: string,
): string => {
  const value = requireString(record, field, sourcePath);
  if (!values.has(value)) {
    return malformed(sourcePath, `${field} has an unsupported value`);
  }
  return value;
};

const asEntry = (record: UnknownRecord, sourcePath: string): SacredCanonEntry => {
  const source = record.source;
  if (
    !Array.isArray(source)
    || source.length === 0
    || source.some((item) => typeof item !== "string" || item.length === 0)
  ) {
    return malformed(sourcePath, "source must be a non-empty array of non-empty strings");
  }

  if (record.approved_by_aeris !== true) {
    return malformed(sourcePath, "approved_by_aeris must be literal true");
  }

  const supersedes = record.supersedes;
  if (supersedes !== null && (typeof supersedes !== "string" || supersedes.length === 0)) {
    return malformed(sourcePath, "supersedes must be null or a non-empty string");
  }

  return {
    entry_id: requireString(record, "entry_id", sourcePath),
    source_candidate_id: requireString(record, "source_candidate_id", sourcePath),
    category: requireMember(record, "category", CATEGORIES, sourcePath) as SacredCanonCategory,
    statement: requireString(record, "statement", sourcePath),
    source,
    approved_by_aeris: true,
    approved_at: requireString(record, "approved_at", sourcePath),
    supersedes,
    state: requireMember(record, "state", STATES, sourcePath) as SacredCanonState,
  };
};

export function parseSacredCanon(
  markdown: string,
  sourcePath = SACRED_CANON_PATH,
): SacredCanonEntry[] {
  const allEntries: SacredCanonEntry[] = [];
  const entryIds = new Set<string>();
  const candidateIds = new Set<string>();

  for (const match of markdown.matchAll(YAML_BLOCK)) {
    let parsed: unknown;
    try {
      parsed = parse(match[1]);
    } catch (error) {
      throw new Error(`Malformed Sacred Canon YAML in ${sourcePath}: ${String(error)}`);
    }

    if (!isRecord(parsed)) {
      return malformed(sourcePath, "YAML block must be a mapping");
    }

    const entry = asEntry(parsed, sourcePath);
    if (entryIds.has(entry.entry_id)) {
      malformed(sourcePath, "duplicate entry_id");
    }
    if (candidateIds.has(entry.source_candidate_id)) {
      malformed(sourcePath, "duplicate source_candidate_id");
    }
    entryIds.add(entry.entry_id);
    candidateIds.add(entry.source_candidate_id);
    allEntries.push(entry);
  }

  return allEntries.filter((entry) => entry.state === "current");
}

export async function loadSacredCanon(): Promise<SacredCanonEntry[]> {
  const markdown = await readFile(repositoryPath(SACRED_CANON_PATH), "utf8");
  return parseSacredCanon(markdown, SACRED_CANON_PATH);
}
