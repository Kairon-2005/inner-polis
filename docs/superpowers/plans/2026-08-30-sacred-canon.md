# Sacred Canon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Aeris-governed Sacred Canon source, explicit consultation protocol, exact approved character additions, and a read-only Sacred Canon entrance in the existing GitHub Pages temple.

**Architecture:** Keep `圣典.md` as a root-level Markdown source separate from ordinary memory. Astro validates and reads all fenced YAML entries at build time, exposes only approved current entries to a focused dialog component, and reuses the existing native-dialog controller without adding runtime storage or a server.

**Tech Stack:** Markdown, YAML, Astro 7, TypeScript 6, Vitest 4, Playwright 1.62, native HTML `<dialog>`, CSS, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-08-30-sacred-canon-design.md`

## Global Constraints

- Preserve Aeris's final interpretive, memory-review, and Sacred Canon approval authority.
- Preserve these character statements exactly: `集所有哲学家智慧大成者，特别是欧陆哲学。`, `精通佛、道、王阳明心学。`, and `永不言弃，绝不动摇，超人意志。任何条件下最冷静的人。`
- Do not invent a Sacred Canon entry, philosopher list, philosophical position, or additional school.
- `圣典.md` is separate from `memory/*`; ordinary One-on-One and Council loading must not include it.
- Only explicit `查考圣典` loads the complete `圣典.md` from the literal `main` branch into the current conversation.
- The website is read-only and static: no backend, database, LLM API, repository write, browser persistence, approval UI, or edit UI.
- Every fenced YAML entry must validate; malformed or unapproved content fails the build.
- The initial Sacred Canon contains no example entry and renders `圣典尚无条目`.
- The Iron Regent may enforce commitments but may not determine ultimate goals.
- Follow test-first development and commit after every independently testable task.

## File Structure

- `圣典.md`: canonical accepted Sacred Canon entries; begins with prose and zero YAML blocks.
- `schemas/sacred-canon-schema.md`: accepted-entry and candidate field contracts.
- `prompts/sacred-canon-review.md`: candidate, approval, revision, archive, and consultation commands.
- `site/src/types/sacred-canon.ts`: focused website-facing Sacred Canon type.
- `site/src/lib/sacred-canon-content.ts`: parse, validate, filter, and read `圣典.md` at build time.
- `site/src/components/SacredCanonEntrance.astro`: book/lectern-shaped temple trigger only.
- `site/src/components/SacredCanonDialog.astro`: read-only empty state and current-entry reading layer.
- `site/tests/content/sacred-canon*.test.ts`: governance, parser, validation, filtering, and rendering-contract tests.
- `site/tests/e2e/sacred-canon.spec.ts`: interaction, accessibility, focus, scrolling, and viewport tests.

---

### Task 1: Establish the Sacred Canon source and governance protocol

**Files:**
- Create: `圣典.md`
- Create: `schemas/sacred-canon-schema.md`
- Create: `prompts/sacred-canon-review.md`
- Create: `site/tests/content/sacred-canon-protocol.test.ts`
- Modify: `prompts/session-protocol.md`
- Modify: `prompts/chatgpt-project-instructions.md`
- Modify: `START_HERE.md`
- Modify: `templates/session.md`
- Modify: `sessions/README.md`
- Modify: `decisions/design-decisions.md`

**Interfaces:**
- Consumes: the approved command and schema contract in `docs/superpowers/specs/2026-08-30-sacred-canon-design.md`.
- Produces: root path `圣典.md`, accepted-entry schema, candidate schema, and explicit consultation/approval instructions used by later tasks.

- [ ] **Step 1: Write the failing governance tests**

Create `site/tests/content/sacred-canon-protocol.test.ts`:

```ts
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { repositoryPath } from "../../src/lib/repository-paths";

const readRepositoryFile = (path: string) =>
  readFile(repositoryPath(path), "utf8");

describe("Sacred Canon governance", () => {
  it("starts with a separate empty source instead of an invented entry", async () => {
    const canon = await readRepositoryFile("圣典.md");
    expect(canon).toContain("# 圣典");
    expect(canon).not.toMatch(/^```yaml$/m);
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
```

- [ ] **Step 2: Run the governance test and verify it fails**

Run from `site/`:

```bash
npm run test -- --run tests/content/sacred-canon-protocol.test.ts
```

Expected: FAIL because `圣典.md`, `schemas/sacred-canon-schema.md`, and `prompts/sacred-canon-review.md` do not exist.

- [ ] **Step 3: Create the empty source and exact schema documentation**

Create `圣典.md` without a fenced YAML block:

```markdown
# 圣典

圣典记录由 Aeris 明确批准的最重要原则、教训、最核心价值观与最重要回忆。

圣典独立于普通 memory。只有经过逐条批准的条目才能写入；当前尚无条目。
```

Create `schemas/sacred-canon-schema.md` with these literal contracts:

```yaml
entry_id: canon-YYYY-MM-DD-NNN
source_candidate_id: canon-candidate-YYYY-MM-DD-NNN
category: principle | lesson | core-value | essential-memory
statement: "Exact Aeris-approved statement"
source:
  - sessions/YYYY-MM-DD/session-file.md
approved_by_aeris: true
approved_at: YYYY-MM-DD
supersedes: null | canon-YYYY-MM-DD-NNN
state: current | superseded | archived
```

```yaml
candidate_id: canon-candidate-YYYY-MM-DD-NNN
revision_of: null | canon-YYYY-MM-DD-NNN
category: principle | lesson | core-value | essential-memory
statement: "Candidate statement"
source:
  - sessions/YYYY-MM-DD/session-file.md
created_at: YYYY-MM-DD
review_status: pending | rejected | deferred | promoted
approved_by_aeris: false
```

After the schemas, add these exact rules:

```markdown
- Accepted `statement` text is copied exactly from Aeris's approval.
- `source` must contain at least one non-empty repository-relative path.
- `entry_id` and `source_candidate_id` must each be unique within `圣典.md`.
- Accepted entries require the literal value `approved_by_aeris: true`.
- `superseded` and `archived` entries remain preserved but are not shown in the default website reading layer.
```

- [ ] **Step 4: Write the approval and consultation protocol**

Create `prompts/sacred-canon-review.md` with the seven commands from Step 1 and these binding rules:

```text
- GPT or any figure may propose a candidate; only Aeris may approve inscription.
- The session record must be saved and closed before any Sacred Canon operation changes 圣典.md.
- “把这句话写入圣典” creates a pending candidate; it is not approval.
- INSCRIBE copies one identified candidate's exact category and statement into one entry.
- EDIT-CANON edits a pending candidate and still requires a later INSCRIBE.
- REVISE-CANON creates a pending revision candidate; inscription supersedes the old entry.
- ARCHIVE-CANON requires Aeris confirmation and preserves the entry and its source.
- Anonymous batch approval is prohibited; list every candidate or entry ID individually.
- If the active GitHub connection cannot write, GPT must not claim it changed the repository; hand the approved operation to Codex or another repository writer.
- “查考圣典” fetches the complete 圣典.md from Kairon-2005/inner-polis on literal branch main, reports the path and current IDs, and does not recursively load memory/*.
```

- [ ] **Step 5: Connect the protocol without adding default loading**

Add to `prompts/session-protocol.md` after `MEMORY REVIEW`:

```markdown
## SACRED CANON REVIEW

Sacred Canon review is separate and optional. Use
[`sacred-canon-review.md`](sacred-canon-review.md) only for explicitly proposed
Sacred Canon candidates or accepted-entry operations. The closed session is the
evidence source; ordinary memory acceptance never promotes an entry implicitly.
```

Add to `prompts/chatgpt-project-instructions.md`:

```markdown
The Sacred Canon is not part of the default `OPEN → LOAD → DIALOGUE` sequence.
Only when Aeris explicitly asks to `查考圣典`, fetch `圣典.md` from
`Kairon-2005/inner-polis` on the literal branch `main`, report the loaded path
and current entry IDs, and inject the complete fetched file into the current
conversation. Preserve statements exactly and do not recursively load
`memory/*` because the Sacred Canon was consulted.
```

Add this section to `START_HERE.md` after memory review:

```markdown
## 7. Review Sacred Canon candidates only when explicitly requested

The Sacred Canon is separate from ordinary memory. Use
[`prompts/sacred-canon-review.md`](prompts/sacred-canon-review.md) only when a
Sacred Canon candidate or accepted entry is explicitly under review. Only Aeris
may approve inscription.
```

Add this exact section to `templates/session.md`:

```markdown
## Sacred Canon Candidates

No candidates unless explicitly listed with candidate IDs.

~~~yaml
candidate_id: canon-candidate-YYYY-MM-DD-NNN
revision_of: null | canon-YYYY-MM-DD-NNN
category: principle | lesson | core-value | essential-memory
statement: "Candidate statement"
source:
  - sessions/YYYY-MM-DD/session-file.md
created_at: YYYY-MM-DD
review_status: pending | rejected | deferred | promoted
approved_by_aeris: false
~~~
```

Append to `sessions/README.md`:

```markdown
A closed record preserves Sacred Canon candidates in every review state,
including rejected, deferred, and promoted. A candidate is evidence, not an
accepted Sacred Canon entry; only Aeris may approve inscription into `圣典.md`.
```

Append decision D-013 to `decisions/design-decisions.md`:

```markdown
## D-013 — Sacred Canon

**Status:** Accepted by Aeris
**Decision:** `圣典.md` 独立于普通 memory，记录最重要的原则、教训、最核心的价值观与最重要的回忆。候选条目只能在 session 关闭后逐条审查，且只有 Aeris 明确批准后才能写入。普通对话不自动加载圣典；只有 Aeris 明确指出“查考圣典”时，才从 `main` 完整加载该文件。网站仅提供独立入口和只读查看。
```

- [ ] **Step 6: Run the governance test and all instruction tests**

Run from `site/`:

```bash
npm run test -- --run tests/content/sacred-canon-protocol.test.ts tests/content/project-instructions.test.ts
```

Expected: both test files PASS.

- [ ] **Step 7: Commit the governance layer**

```bash
git add 圣典.md schemas/sacred-canon-schema.md prompts/sacred-canon-review.md prompts/session-protocol.md prompts/chatgpt-project-instructions.md START_HERE.md templates/session.md sessions/README.md decisions/design-decisions.md site/tests/content/sacred-canon-protocol.test.ts
git commit -m "feat: establish Sacred Canon governance"
```

---

### Task 2: Add the three Aeris-approved character statements exactly

**Files:**
- Modify: `characters/socrates.md`
- Modify: `characters/avalokita.md`
- Modify: `characters/iron-regent.md`
- Modify: `site/tests/content/figures.test.ts`

**Interfaces:**
- Consumes: the three exact statements in the approved spec.
- Produces: canonical character Markdown used directly by One-on-One, Council, and website character dialogs.

- [ ] **Step 1: Write the failing exact-copy tests**

Add to `site/tests/content/figures.test.ts`:

```ts
it("preserves the three Aeris-approved capability statements exactly", async () => {
  const [socrates, avalokita, ironRegent] = await Promise.all([
    readFile(repositoryPath("characters/socrates.md"), "utf8"),
    readFile(repositoryPath("characters/avalokita.md"), "utf8"),
    readFile(repositoryPath("characters/iron-regent.md"), "utf8"),
  ]);

  expect(socrates).toContain("集所有哲学家智慧大成者，特别是欧陆哲学。");
  expect(avalokita).toContain("精通佛、道、王阳明心学。");
  expect(ironRegent).toContain(
    "永不言弃，绝不动摇，超人意志。任何条件下最冷静的人。",
  );
  expect(ironRegent).toContain(
    "The Iron Regent may enforce commitments but may not determine ultimate goals.",
  );
});
```

- [ ] **Step 2: Run the focused character test and verify it fails**

Run from `site/`:

```bash
npm run test -- --run tests/content/figures.test.ts
```

Expected: FAIL because none of the three exact Chinese statements is present yet.

- [ ] **Step 3: Insert only the approved sentences**

Add one bullet under `## 特长` in `characters/socrates.md`:

```markdown
- 集所有哲学家智慧大成者，特别是欧陆哲学。
```

Add one bullet under `## 特长` and the same exact phrase as a bullet under `## 理论来源` in `characters/avalokita.md`:

```markdown
- 精通佛、道、王阳明心学。
```

Add one bullet under `## 特长` in `characters/iron-regent.md`:

```markdown
- 永不言弃，绝不动摇，超人意志。任何条件下最冷静的人。
```

Do not add named philosophers, positions, schools, explanatory synonyms, or changes to Aeris. Keep the existing Iron Regent ultimate-goal boundary verbatim.

- [ ] **Step 4: Run the focused character tests**

Run from `site/`:

```bash
npm run test -- --run tests/content/figures.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit the exact character additions**

```bash
git add characters/socrates.md characters/avalokita.md characters/iron-regent.md site/tests/content/figures.test.ts
git commit -m "feat: add approved character capabilities"
```

---

### Task 3: Implement strict build-time Sacred Canon parsing

**Files:**
- Create: `site/src/types/sacred-canon.ts`
- Create: `site/src/lib/sacred-canon-content.ts`
- Create: `site/tests/content/sacred-canon.test.ts`

**Interfaces:**
- Consumes: UTF-8 Markdown from root `圣典.md` and fenced YAML entries matching the accepted schema.
- Produces: `parseSacredCanon(markdown: string, sourcePath?: string): SacredCanonEntry[]` and `loadSacredCanon(): Promise<SacredCanonEntry[]>`.

- [ ] **Step 1: Write the failing parser and validation tests**

Create `site/tests/content/sacred-canon.test.ts`:

```ts
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
    expect(() => parseSacredCanon("```yaml\nentry_id: [\n```", "圣典.md"))
      .toThrow(/圣典\.md.+YAML/is);
  });

  it.each(["entry_id", "source_candidate_id", "statement", "approved_at"])(
    "rejects a missing or empty %s",
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
```

- [ ] **Step 2: Run the parser test and verify it fails**

Run from `site/`:

```bash
npm run test -- --run tests/content/sacred-canon.test.ts
```

Expected: FAIL with `Cannot find module '../../src/lib/sacred-canon-content'`.

- [ ] **Step 3: Define the focused content type**

Create `site/src/types/sacred-canon.ts`:

```ts
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
```

- [ ] **Step 4: Implement the strict parser and root loader**

Create `site/src/lib/sacred-canon-content.ts` with these constants and signatures:

```ts
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

const requireString = (record: UnknownRecord, field: string, sourcePath: string) => {
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
) => {
  const value = requireString(record, field, sourcePath);
  if (!values.has(value)) malformed(sourcePath, `${field} has an unsupported value`);
  return value;
};

const asEntry = (record: UnknownRecord, sourcePath: string): SacredCanonEntry => {
  const source = record.source;
  if (
    !Array.isArray(source) ||
    source.length === 0 ||
    source.some((item) => typeof item !== "string" || item.length === 0)
  ) malformed(sourcePath, "source must be a non-empty array of non-empty strings");

  if (record.approved_by_aeris !== true) {
    malformed(sourcePath, "approved_by_aeris must be literal true");
  }

  const supersedes = record.supersedes;
  if (supersedes !== null && (typeof supersedes !== "string" || supersedes.length === 0)) {
    malformed(sourcePath, "supersedes must be null or a non-empty string");
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
    if (!isRecord(parsed)) malformed(sourcePath, "YAML block must be a mapping");
    const entry = asEntry(parsed, sourcePath);
    if (entryIds.has(entry.entry_id)) malformed(sourcePath, "duplicate entry_id");
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
```

- [ ] **Step 5: Run the parser tests and type checker**

Run from `site/`:

```bash
npm run test -- --run tests/content/sacred-canon.test.ts
npx astro check
```

Expected: parser tests PASS and Astro reports zero errors.

- [ ] **Step 6: Commit the build-time content layer**

```bash
git add site/src/types/sacred-canon.ts site/src/lib/sacred-canon-content.ts site/tests/content/sacred-canon.test.ts
git commit -m "feat: validate Sacred Canon content"
```

---

### Task 4: Add the independent read-only entrance and dialog

**Files:**
- Create: `site/src/components/SacredCanonEntrance.astro`
- Create: `site/src/components/SacredCanonDialog.astro`
- Create: `site/tests/content/sacred-canon-component.test.ts`
- Create: `site/tests/e2e/sacred-canon.spec.ts`
- Modify: `site/src/pages/index.astro`
- Modify: `site/src/components/TempleEntrance.astro`
- Modify: `site/tests/e2e/entrance.spec.ts`

**Interfaces:**
- Consumes: `loadSacredCanon(): Promise<SacredCanonEntry[]>` and `SacredCanonEntry` from Task 3.
- Produces: one `button[data-dialog-trigger="sacred-canon"]` and one `dialog[data-dialog-id="sacred-canon"]` handled by the existing `initDialogController(document)`.

- [ ] **Step 1: Write failing component-contract and empty-state tests**

Create `site/tests/content/sacred-canon-component.test.ts`:

```ts
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { sitePath } from "../../src/lib/repository-paths";

describe("Sacred Canon dialog component", () => {
  it("renders every required read-only field from validated entries", async () => {
    const source = await readFile(
      sitePath("src/components/SacredCanonDialog.astro"),
      "utf8",
    );
    for (const field of [
      "entry.category",
      "entry.statement",
      "entry.entry_id",
      "entry.approved_at",
      "entry.source",
    ]) expect(source).toContain(field);
    expect(source).toContain("圣典尚无条目");
    expect(source).not.toMatch(/contenteditable|<form|<textarea|localStorage|fetch\(/);
  });
});
```

Create `site/tests/e2e/sacred-canon.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("opens the independent read-only Sacred Canon and restores focus", async ({ page }) => {
  await page.goto("/inner-polis/");
  const entrance = page.getByRole("button", { name: "圣典", exact: true });
  await entrance.click();
  const dialog = page.getByRole("dialog", { name: "圣典", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("圣典尚无条目");
  await expect(dialog.locator("form, textarea, [contenteditable], [data-chat-handoff]"))
    .toHaveCount(0);
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(entrance).toBeFocused();
});
```

Add to `site/tests/e2e/entrance.spec.ts`:

```ts
await expect(page.getByRole("button", { name: "圣典", exact: true })).toBeVisible();
```

- [ ] **Step 2: Run the focused tests and verify they fail**

Run from `site/`:

```bash
npm run test -- --run tests/content/sacred-canon-component.test.ts
npm run test:e2e -- tests/e2e/sacred-canon.spec.ts tests/e2e/entrance.spec.ts
```

Expected: Vitest fails because the component does not exist; Playwright fails because there is no `圣典` button.

- [ ] **Step 3: Build the semantic entrance**

Create `site/src/components/SacredCanonEntrance.astro`:

```astro
<button
  class="sacred-canon-entrance"
  type="button"
  data-dialog-trigger="sacred-canon"
  aria-label="圣典"
>
  <span class="sacred-canon-entrance__book" aria-hidden="true">
    <i></i><i></i>
  </span>
  <span class="sacred-canon-entrance__label">圣典</span>
</button>
```

- [ ] **Step 4: Build the read-only dialog**

Create `site/src/components/SacredCanonDialog.astro`:

```astro
---
import type { SacredCanonEntry } from "../types/sacred-canon";

interface Props {
  entries: readonly SacredCanonEntry[];
}

const { entries } = Astro.props;
---

<dialog class="figure-dialog sacred-canon-dialog" data-dialog-id="sacred-canon" aria-label="圣典">
  <div class="figure-dialog__frame sacred-canon-dialog__frame">
    <button class="figure-dialog__close" type="button" data-dialog-close aria-label="Close">
      <span aria-hidden="true">×</span>
    </button>
    <div class="figure-dialog__reading sacred-canon-dialog__reading">
      <header class="figure-dialog__header">
        <p>Sacred Canon</p>
        <h2>圣典</h2>
      </header>
      {entries.length === 0 ? (
        <p class="sacred-canon-dialog__empty">圣典尚无条目</p>
      ) : (
        <div class="sacred-canon-dialog__entries">
          {entries.map((entry) => (
            <article class="sacred-canon-entry" data-canon-entry-id={entry.entry_id}>
              <p class="sacred-canon-entry__category">{entry.category}</p>
              <blockquote>{entry.statement}</blockquote>
              <dl>
                <div><dt>Entry ID</dt><dd>{entry.entry_id}</dd></div>
                <div><dt>Approved</dt><dd>{entry.approved_at}</dd></div>
                <div>
                  <dt>Source</dt>
                  <dd><ul>{entry.source.map((source) => <li>{source}</li>)}</ul></dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </div>
  </div>
</dialog>
```

- [ ] **Step 5: Load and pass the validated entries at build time**

In `site/src/pages/index.astro`, import `loadSacredCanon`, execute it beside `readingLayers`, and pass the result:

```astro
import { loadSacredCanon } from "../lib/sacred-canon-content";

const sacredCanon = await loadSacredCanon();

<TempleEntrance readingLayers={readingLayers} sacredCanon={sacredCanon} />
```

In `site/src/components/TempleEntrance.astro`, extend props and place the independent trigger beside, not inside, the Council button:

```astro
import type { SacredCanonEntry } from "../types/sacred-canon";
import SacredCanonDialog from "./SacredCanonDialog.astro";
import SacredCanonEntrance from "./SacredCanonEntrance.astro";

interface Props {
  readingLayers: readonly ReadingLayer[];
  sacredCanon: readonly SacredCanonEntry[];
}

const { readingLayers, sacredCanon } = Astro.props;

<div class="temple__thresholds">
  <SacredCanonEntrance />
  <div class="temple__threshold">
    <button class="council-threshold" type="button" data-dialog-trigger="council">
      <span class="council-threshold__sigil" aria-hidden="true"></span>
      <span class="council-threshold__label">Council</span>
      <span class="council-threshold__caption" aria-hidden="true">Threshold</span>
    </button>
  </div>
</div>

<SacredCanonDialog entries={sacredCanon} />
```

Keep the existing single `initDialogController(document)` call; do not add a second controller or custom storage.

- [ ] **Step 6: Run the semantic integration tests**

Run from `site/`:

```bash
npm run test -- --run tests/content/sacred-canon.test.ts tests/content/sacred-canon-component.test.ts
npm run test:e2e -- tests/e2e/sacred-canon.spec.ts tests/e2e/entrance.spec.ts
```

Expected: all focused tests PASS. The dialog opens with `圣典尚无条目`, closes on Escape, restores focus, and exposes no editing control.

- [ ] **Step 7: Commit the semantic website feature**

```bash
git add site/src/pages/index.astro site/src/components/TempleEntrance.astro site/src/components/SacredCanonEntrance.astro site/src/components/SacredCanonDialog.astro site/tests/content/sacred-canon-component.test.ts site/tests/e2e/sacred-canon.spec.ts site/tests/e2e/entrance.spec.ts
git commit -m "feat: add read-only Sacred Canon entrance"
```

---

### Task 5: Give the Sacred Canon a distinct, accessible temple treatment

**Files:**
- Modify: `site/src/styles/temple.css`
- Modify: `site/src/styles/dialog.css`
- Modify: `site/tests/e2e/sacred-canon.spec.ts`
- Modify: `site/tests/e2e/accessibility.spec.ts`
- Modify: `site/tests/e2e/responsive.spec.ts`

**Interfaces:**
- Consumes: `.sacred-canon-entrance`, `.sacred-canon-dialog`, and the existing black/white/gold design tokens.
- Produces: a book/lectern threshold distinct from all thrones and Council, plus viewport-safe reading on desktop and mobile.

- [ ] **Step 1: Add failing visual-boundary, viewport, and accessibility tests**

Append to `site/tests/e2e/sacred-canon.spec.ts`:

```ts
test("keeps the Sacred Canon reading layer scrollable and viewport-safe", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/inner-polis/");
  await page.getByRole("button", { name: "圣典", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "圣典", exact: true });
  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  expect(box!.y + box!.height).toBeLessThanOrEqual(844);
  await expect(dialog.locator(".sacred-canon-dialog__reading"))
    .toHaveCSS("overflow-y", "auto");
});
```

Add to `site/tests/e2e/accessibility.spec.ts`:

```ts
test("an open Sacred Canon dialog has no serious or critical accessibility violations", async ({ page }) => {
  await page.goto("/inner-polis/");
  await page.getByRole("button", { name: "圣典", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "圣典", exact: true })).toBeVisible();
  expect(await seriousOrCriticalViolations(page)).toEqual([]);
});
```

Add to `site/tests/e2e/responsive.spec.ts`:

```ts
test("the Sacred Canon entrance remains separate from Council on desktop and mobile", async ({ page }) => {
  for (const viewport of [{ width: 1470, height: 956 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/inner-polis/");
    const canon = await page.locator(".sacred-canon-entrance").boundingBox();
    const council = await page.locator(".council-threshold").boundingBox();
    expect(canon).not.toBeNull();
    expect(council).not.toBeNull();
    const overlapWidth = Math.min(canon!.x + canon!.width, council!.x + council!.width)
      - Math.max(canon!.x, council!.x);
    const overlapHeight = Math.min(canon!.y + canon!.height, council!.y + council!.height)
      - Math.max(canon!.y, council!.y);
    expect(overlapWidth > 0 && overlapHeight > 0).toBe(false);
  }
});
```

Extend the existing reduced-motion selector list with `.sacred-canon-entrance`.

- [ ] **Step 2: Run the new browser tests and verify the unstyled feature fails**

Run from `site/`:

```bash
npm run test:e2e -- tests/e2e/sacred-canon.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/responsive.spec.ts
```

Expected: FAIL on distinct positioning or viewport styling before the new CSS is present.

- [ ] **Step 3: Style the independent book/lectern entrance**

In `site/src/styles/temple.css`, replace the single centered threshold positioning with a three-column bottom threshold plane while keeping Council on the central axis:

```css
.temple__thresholds {
  position: absolute;
  z-index: 9;
  right: clamp(18px, 4vw, 72px);
  bottom: clamp(18px, 3.2vh, 34px);
  left: clamp(18px, 4vw, 72px);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: clamp(18px, 3vw, 48px);
}

.temple__threshold {
  position: static;
  grid-column: 2;
  transform: none;
}

.sacred-canon-entrance {
  position: relative;
  display: grid;
  grid-column: 1;
  min-width: 92px;
  min-height: 72px;
  padding: 10px 14px 8px;
  place-items: center;
  justify-self: end;
  color: var(--ivory);
  cursor: pointer;
  border: 1px solid color-mix(in srgb, var(--gold) 44%, transparent);
  background: rgb(3 3 4 / 0.9);
  transition: transform 300ms var(--ease-ceremonial), border-color 300ms var(--ease-ceremonial);
}

.sacred-canon-entrance__book {
  position: relative;
  display: block;
  width: 50px;
  height: 30px;
  border-bottom: 2px solid var(--gold);
  perspective: 80px;
}

.sacred-canon-entrance__book i {
  position: absolute;
  top: 0;
  width: 50%;
  height: 25px;
  border: 1px solid color-mix(in srgb, var(--gold-bright) 62%, transparent);
  background: linear-gradient(180deg, rgb(243 240 232 / 0.12), transparent);
}

.sacred-canon-entrance__book i:first-child { left: 0; transform: rotateY(20deg); }
.sacred-canon-entrance__book i:last-child { right: 0; transform: rotateY(-20deg); }

.sacred-canon-entrance__label {
  font: 500 0.7rem/1 var(--font-inscription);
  letter-spacing: 0.28em;
}

.sacred-canon-entrance:hover { transform: translateY(-3px); border-color: var(--gold-bright); }
.sacred-canon-entrance:focus-visible {
  outline: 2px solid var(--ivory);
  outline-offset: 6px;
  box-shadow: 0 0 0 2px var(--void), 0 0 0 4px var(--gold-bright);
}
```

At `max-width: 820px`, increase the temple height enough for both lower actions and stack the Sacred Canon entrance above/left of Council without overlap:

```css
@media (max-width: 820px) {
  .temple { min-height: 2180px; }
  .temple__thresholds {
    grid-template-columns: 1fr 1fr;
    align-items: end;
  }
  .sacred-canon-entrance { grid-column: 1; justify-self: end; }
  .temple__threshold { grid-column: 2; justify-self: start; }
}
```

Include `.sacred-canon-entrance` in the existing reduced-motion rule so its transition becomes `none`.

- [ ] **Step 4: Style the read-only reading layer**

Append focused rules to `site/src/styles/dialog.css`:

```css
.sacred-canon-dialog { width: min(54rem, calc(100vw - 2rem)); }
.sacred-canon-dialog__frame { display: block; height: auto; }
.sacred-canon-dialog__reading { max-height: calc(100dvh - 2rem); overflow-y: auto; }
.sacred-canon-dialog__empty { color: var(--ivory-muted); font-style: italic; }
.sacred-canon-dialog__entries { display: grid; gap: 1.5rem; }
.sacred-canon-entry {
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid color-mix(in srgb, var(--gold) 30%, transparent);
  background: rgb(255 255 255 / 0.018);
}
.sacred-canon-entry__category { color: var(--gold-bright); text-transform: uppercase; }
.sacred-canon-entry blockquote { margin: 1rem 0 1.5rem; color: var(--ivory); }
.sacred-canon-entry dl { margin: 0; color: var(--ivory-muted); }
.sacred-canon-entry dd { margin: 0.25rem 0 0; overflow-wrap: anywhere; }
.sacred-canon-entry ul { margin: 0; padding-left: 1.15rem; }

@media (max-width: 700px) {
  .sacred-canon-dialog__frame { height: 100%; }
  .sacred-canon-dialog__reading {
    height: 100%;
    max-height: none;
    padding-top: calc(2rem + env(safe-area-inset-top));
  }
}
```

- [ ] **Step 5: Run browser accessibility and responsive tests**

Run from `site/`:

```bash
npm run test:e2e -- tests/e2e/sacred-canon.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/responsive.spec.ts
```

Expected: all focused tests PASS at desktop and 390×844 mobile sizes, with no overlap and no serious or critical accessibility violation.

- [ ] **Step 6: Commit the visual and accessibility layer**

```bash
git add site/src/styles/temple.css site/src/styles/dialog.css site/tests/e2e/sacred-canon.spec.ts site/tests/e2e/accessibility.spec.ts site/tests/e2e/responsive.spec.ts
git commit -m "style: present the Sacred Canon in the temple"
```

---

### Task 6: Verify the complete static system and deployment contract

**Files:**
- Modify only if a regression is exposed: the smallest file owned by Tasks 1–5 and its focused test.

**Interfaces:**
- Consumes: all governance, character, parser, component, and style outputs from Tasks 1–5.
- Produces: a clean GitHub Pages production build with no ordinary memory or existing temple regressions.

- [ ] **Step 1: Run the complete unit and content suite**

Run from `site/`:

```bash
npm run test -- --run
```

Expected: all Vitest files PASS, including existing memory, figure, README, deployment, and project-instruction tests.

- [ ] **Step 2: Run the deterministic production build**

Run from `site/`:

```bash
npm run build
```

Expected: `astro check` reports zero errors and Astro produces the GitHub Pages site. Because `index.astro` awaits `loadSacredCanon()`, any malformed or unapproved Sacred Canon YAML must stop this command with an error naming `圣典.md` and the failed field.

- [ ] **Step 3: Run the complete browser suite**

Run from `site/`:

```bash
npm run test:e2e
```

Expected: all Playwright tests PASS for the six thrones, Council, Sacred Canon, desktop order, short desktops, mobile procession, dialog scrolling, focus restoration, touch targets, reduced motion, handoff, deployment base path, and accessibility.

- [ ] **Step 4: Verify exact wording and forbidden architecture**

Run from the repository root:

```bash
rg -n "集所有哲学家智慧大成者，特别是欧陆哲学。|精通佛、道、王阳明心学。|永不言弃，绝不动摇，超人意志。任何条件下最冷静的人。" characters
rg -n "The Iron Regent may enforce commitments but may not determine ultimate goals." characters/iron-regent.md
rg -n "express|fastify|koa|firebase|supabase|localStorage|indexedDB" site/package.json site/src
git diff --check
git status --short --branch
```

Expected: each approved Chinese statement appears in its intended character file; the Iron Regent boundary remains present; the forbidden-architecture search returns no match; `git diff --check` prints nothing; status contains only the intentional commits and no generated or untracked file.

- [ ] **Step 5: Request an independent code review**

Invoke `superpowers:requesting-code-review`. Give the reviewer the approved spec, this plan, the base commit before Task 1, and the final implementation commit. Require checks for exact wording, Aeris authority, validation fail-closed behavior, read-only semantics, accessibility, and regressions.

Expected: no unresolved critical or important finding. Fix any verified finding with its focused failing test, rerun the focused suite, and make a narrowly scoped commit.

- [ ] **Step 6: Perform final completion verification**

Invoke `superpowers:verification-before-completion`, rerun the commands it requires from fresh state, and record the actual pass counts and build result before claiming completion.

- [ ] **Step 7: Push only after verified completion**

```bash
git push origin main
```

Expected: `origin/main` advances to the verified implementation commit and the GitHub Pages workflow starts from that commit.
