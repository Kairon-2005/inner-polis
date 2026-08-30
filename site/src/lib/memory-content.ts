import { readFile } from "node:fs/promises";
import { parse } from "yaml";
import type { AcceptedMemory, FigureDefinition } from "../types/content";
import { repositoryPath } from "./repository-paths";

const YAML_BLOCK = /^```yaml\s*\r?\n([\s\S]*?)^```\s*$/gm;
const SHARED_MEMORY_PATH = "memory/shared/current.md";
const OWNERS = new Set(["shared", "aeris", "iron-regent", "avalokita", "metis", "socrates", "little-prince"]);
const VISIBILITIES = new Set(["private", "council", "sovereign"]);
const TYPES = new Set(["belief", "emotion", "event", "decision", "observation"]);
const EPISTEMIC_STATUSES = new Set(["observation", "hypothesis"]);
const CONFIDENCES = new Set(["low", "medium", "high"]);

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function malformed(sourcePath: string, message: string): never {
  throw new Error(`Malformed accepted memory in ${sourcePath}: ${message}`);
}

function requireString(record: UnknownRecord, field: string, sourcePath: string): string {
  const value = record[field];
  if (typeof value !== "string" || value.length === 0) {
    return malformed(sourcePath, `${field} must be a non-empty string`);
  }
  return value;
}

function requireMember(
  record: UnknownRecord,
  field: string,
  members: Set<string>,
  sourcePath: string,
): string {
  const value = requireString(record, field, sourcePath);
  if (!members.has(value)) {
    return malformed(sourcePath, `${field} has an unsupported value`);
  }
  return value;
}

function asAcceptedMemory(record: UnknownRecord, sourcePath: string): AcceptedMemory {
  const evidence = record.evidence;
  if (!Array.isArray(evidence) || evidence.some((item) => typeof item !== "string")) {
    return malformed(sourcePath, "evidence must be an array of strings");
  }

  const supersedes = record.supersedes;
  if (supersedes !== null && typeof supersedes !== "string") {
    return malformed(sourcePath, "supersedes must be a string or null");
  }

  return {
    memory_id: requireString(record, "memory_id", sourcePath),
    source_candidate_id: requireString(record, "source_candidate_id", sourcePath),
    owner: requireMember(record, "owner", OWNERS, sourcePath) as AcceptedMemory["owner"],
    visibility: requireMember(record, "visibility", VISIBILITIES, sourcePath) as AcceptedMemory["visibility"],
    type: requireMember(record, "type", TYPES, sourcePath) as AcceptedMemory["type"],
    statement: requireString(record, "statement", sourcePath),
    epistemic_status: requireMember(record, "epistemic_status", EPISTEMIC_STATUSES, sourcePath) as AcceptedMemory["epistemic_status"],
    confidence: requireMember(record, "confidence", CONFIDENCES, sourcePath) as AcceptedMemory["confidence"],
    evidence,
    created_at: requireString(record, "created_at", sourcePath),
    updated_at: requireString(record, "updated_at", sourcePath),
    approved_by_aeris: true,
    supersedes,
    state: "current",
  };
}

export function loadAcceptedBlocks(
  markdown: string,
  sourcePath = "memory fixture",
  expectedOwner?: AcceptedMemory["owner"],
): AcceptedMemory[] {
  const accepted: AcceptedMemory[] = [];

  for (const match of markdown.matchAll(YAML_BLOCK)) {
    let parsed: unknown;
    try {
      parsed = parse(match[1]);
    } catch (error) {
      throw new Error(`Malformed memory YAML in ${sourcePath}: ${String(error)}`);
    }

    if (!isRecord(parsed) || parsed.approved_by_aeris !== true || parsed.state !== "current") {
      continue;
    }

    const memory = asAcceptedMemory(parsed, sourcePath);
    if (expectedOwner && memory.owner !== expectedOwner) {
      malformed(sourcePath, `owner ${memory.owner} does not match store owner ${expectedOwner}`);
    }

    accepted.push(memory);
  }

  return accepted;
}

export async function loadCurrentMemory(figure: FigureDefinition): Promise<AcceptedMemory[]> {
  const [sharedMarkdown, ownedMarkdown] = await Promise.all([
    readFile(repositoryPath(SHARED_MEMORY_PATH), "utf8"),
    readFile(repositoryPath(figure.memoryPath), "utf8"),
  ]);

  return [
    ...loadAcceptedBlocks(sharedMarkdown, SHARED_MEMORY_PATH, "shared"),
    ...loadAcceptedBlocks(ownedMarkdown, figure.memoryPath, figure.slug),
  ];
}
