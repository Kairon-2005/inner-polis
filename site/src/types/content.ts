export type FigureSlug =
  | "aeris"
  | "iron-regent"
  | "avalokita"
  | "metis"
  | "socrates"
  | "little-prince";

export interface FigureDefinition {
  readonly slug: FigureSlug;
  readonly characterPath: string;
  readonly memoryPath: string;
  readonly portraitPath: string;
  readonly webPortraitPath: string;
}

export interface CharacterContent {
  readonly slug: FigureSlug;
  readonly canonicalName: string;
  readonly html: string;
  readonly sourcePath: string;
}

export interface AcceptedMemory {
  readonly memory_id: string;
  readonly source_candidate_id: string;
  readonly owner: "shared" | FigureSlug;
  readonly visibility: "private" | "council" | "sovereign";
  readonly type: "belief" | "emotion" | "event" | "decision" | "observation";
  readonly statement: string;
  readonly epistemic_status: "observation" | "hypothesis";
  readonly confidence: "low" | "medium" | "high";
  readonly evidence: readonly string[];
  readonly created_at: string;
  readonly updated_at: string;
  readonly approved_by_aeris: true;
  readonly supersedes: string | null;
  readonly state: "current";
}
