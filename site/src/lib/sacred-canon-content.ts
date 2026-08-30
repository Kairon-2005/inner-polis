import { readFile } from "node:fs/promises";
import { posix, win32 } from "node:path";
import { parse } from "yaml";
import type {
  SacredCanonCategory,
  SacredCanonEntry,
  SacredCanonState,
} from "../types/sacred-canon";
import { repositoryPath } from "./repository-paths";

const SACRED_CANON_PATH = "圣典.md";
const OPENING_FENCE = /^( {0,3})(`{3,}|~{3,})(.*)$/;
const CLOSING_FENCE = /^( {0,3})(`{3,}|~{3,})[\t ]*$/;
const CATEGORIES = new Set(["principle", "lesson", "core-value", "essential-memory"]);
const STATES = new Set(["current", "superseded", "archived"]);
const ENTRY_FIELDS = new Set([
  "entry_id",
  "source_candidate_id",
  "category",
  "statement",
  "source",
  "approved_by_aeris",
  "approved_at",
  "supersedes",
  "state",
]);
const URI_SCHEME = /^[a-z][a-z\d+.-]*:/i;

type UnknownRecord = Record<string, unknown>;

const malformed = (sourcePath: string, message: string): never => {
  throw new Error(`Malformed Sacred Canon in ${sourcePath}: ${message}`);
};

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const stripFenceIndent = (line: string, indent: number): string => {
  let removed = 0;
  while (removed < indent && line[removed] === " ") {
    removed += 1;
  }
  return line.slice(removed);
};

const extractYamlBlocks = (markdown: string, sourcePath: string): string[] => {
  const blocks: string[] = [];
  let activeFence: {
    readonly character: "`" | "~";
    readonly indent: number;
    readonly length: number;
    readonly yaml: boolean;
    readonly lines: string[];
  } | null = null;

  for (const line of markdown.split(/\r?\n/)) {
    if (activeFence) {
      const closing = line.match(CLOSING_FENCE);
      if (
        closing
        && closing[2][0] === activeFence.character
        && closing[2].length >= activeFence.length
      ) {
        if (activeFence.yaml) {
          blocks.push(activeFence.lines.join("\n"));
        }
        activeFence = null;
        continue;
      }

      if (activeFence.yaml) {
        activeFence.lines.push(stripFenceIndent(line, activeFence.indent));
      }
      continue;
    }

    const opening = line.match(OPENING_FENCE);
    if (!opening) {
      continue;
    }

    const marker = opening[2];
    const info = opening[3].trim();
    if (marker[0] === "`" && info.includes("`")) {
      continue;
    }

    activeFence = {
      character: marker[0] as "`" | "~",
      indent: opening[1].length,
      length: marker.length,
      yaml: info.toLowerCase() === "yaml",
      lines: [],
    };
  }

  if (activeFence?.yaml) {
    return malformed(sourcePath, "YAML fence must be terminated");
  }

  return blocks;
};

const requireString = (record: UnknownRecord, field: string, sourcePath: string): string => {
  const value = record[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    return malformed(sourcePath, `${field} must be a non-empty string`);
  }
  return value;
};

const isRepositoryRelativePath = (value: unknown): value is string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return false;
  }

  const path = value.trim();
  const slashPath = path.replaceAll("\\", "/");
  if (posix.isAbsolute(slashPath) || win32.isAbsolute(path) || URI_SCHEME.test(path)) {
    return false;
  }

  const normalized = posix.normalize(slashPath);
  return normalized !== ".." && !normalized.startsWith("../");
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
  for (const field of Object.keys(record)) {
    if (!ENTRY_FIELDS.has(field)) {
      return malformed(sourcePath, `unrecognized field ${field}`);
    }
  }

  const source = record.source;
  if (
    !Array.isArray(source)
    || source.length === 0
    || source.some((item) => !isRepositoryRelativePath(item))
  ) {
    return malformed(
      sourcePath,
      "source must be a non-empty array of repository-relative paths",
    );
  }

  if (record.approved_by_aeris !== true) {
    return malformed(sourcePath, "approved_by_aeris must be literal true");
  }

  const supersedes = record.supersedes;
  if (
    supersedes !== null
    && (typeof supersedes !== "string" || supersedes.trim().length === 0)
  ) {
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
  const yamlBlocks = extractYamlBlocks(markdown, sourcePath);

  for (const yaml of yamlBlocks) {
    let parsed: unknown;
    try {
      parsed = parse(yaml);
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
