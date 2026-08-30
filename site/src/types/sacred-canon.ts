export type SacredCanonCategory =
  | "principle"
  | "lesson"
  | "core-value"
  | "essential-memory";

export type SacredCanonState = "current" | "superseded" | "archived";

export interface SacredCanonEntry {
  readonly entry_id: string;
  readonly source_candidate_id: string;
  readonly category: SacredCanonCategory;
  readonly statement: string;
  readonly source: readonly string[];
  readonly approved_by_aeris: true;
  readonly approved_at: string;
  readonly supersedes: string | null;
  readonly state: SacredCanonState;
}
