# Stage 0 Dialogue and Memory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Markdown-only Inner Polis operational from character selection through dialogue, session closure, and Aeris-reviewed selective memory updates.

**Architecture:** `START_HERE.md` is the human entry point. Focused prompt files define routing, dialogue, and memory review; schemas and templates define stable records; role-owned `current.md` files contain only accepted memory. All transitions remain explicit and Git-backed, with no autonomous write path.

**Tech Stack:** Markdown, Git, shell-based content and link validation. No website framework, runtime dependency, database, or API.

**Spec:** `docs/superpowers/specs/2026-08-29-stage-0-dialogue-memory-design.md`

## Global Constraints

- Work directly in the existing `main` checkout, as requested by the user.
- Preserve every existing character and constitution file exactly unless Aeris explicitly approves a change.
- Preserve Aeris's original expressions and Aeris's own interpretations as written.
- No agent may paraphrase, soften, strengthen, translate, relabel, reinterpret, or otherwise modify those expressions unless Aeris explicitly requests it.
- Aeris leads review of canon and persistent memory changes; no such change is accepted without explicit approval.
- One selected figure means One-on-One; two through six selected figures mean Council.
- Recommendations require user/Aeris confirmation before dialogue begins.
- Memory candidates are never accepted automatically.
- This implementation is text-only. Do not add Astro, `package.json`, website code, visual assets, Pages configuration, or deployment workflows.
- Modify existing protocol files where their responsibility already exists; do not create conflicting duplicate rules.

---

## File map

### Entry and routing

- Create `START_HERE.md`: shortest complete user workflow and copyable start prompt.
- Create `prompts/role-selection.md`: selection set, routing output, confirmation, and mode derivation.
- Modify `README.md`: link to `START_HERE.md` and the operational flow.

### Session lifecycle

- Create `prompts/session-protocol.md`: open, dialogue, conversion, close, and save procedure.
- Modify `prompts/one-on-one.md`: require exactly one confirmed selection.
- Modify `prompts/council.md`: accept exactly the confirmed selected set and prevent unselected voices.
- Create `schemas/session-schema.md`: stable session metadata and closing fields.
- Create `templates/session.md`: copyable empty session record.
- Create `sessions/README.md`: naming and storage rules.

### Memory lifecycle

- Create `prompts/memory-review.md`: candidate and existing-memory review commands.
- Modify `prompts/memory-protocol.md`: align candidate, accepted, revision, and archive states.
- Create `schemas/memory-schema.md`: candidate and accepted-memory fields.
- Modify `memory/README.md`: loading, promotion, revision, archive, and visibility rules.
- Create `memory/aeris/current.md`.
- Create `memory/iron-regent/current.md`.
- Create `memory/avalokita/current.md`.
- Create `memory/metis/current.md`.
- Create `memory/socrates/current.md`.
- Create `memory/little-prince/current.md`.
- Create `memory/shared/current.md`.

### Integration

- Create `examples/stage-0-dry-run.md`: fictional end-to-end example with no personal claims about Aeris.
- Modify `PROJECT_CONTEXT.md`: link to the operating entry point without changing canon.
- Modify `decisions/design-decisions.md` only if an implementation detail requires a new explicitly accepted decision; otherwise leave it unchanged.

---

### Task 1: Entry point and confirmed character routing

**Files:**

- Create: `START_HERE.md`
- Create: `prompts/role-selection.md`
- Modify: `README.md`

**Interfaces:**

- Consumes: six canonical character filenames and D-009 from `decisions/design-decisions.md`.
- Produces: a confirmed `Selected Figures` list, derived `Mode`, and explicit `Load` list consumed by Task 2.

- [ ] **Step 1: Run the pre-implementation check and confirm it fails**

Run:

```bash
test -f START_HERE.md && \
test -f prompts/role-selection.md && \
rg -q '1 selected figure.*One-on-One' prompts/role-selection.md && \
rg -q '2–6 selected figures.*Council' prompts/role-selection.md
```

Expected: non-zero exit because the two files do not yet exist.

- [ ] **Step 2: Create `prompts/role-selection.md`**

The file must define the selectable slugs exactly:

```text
aeris
iron-regent
avalokita
metis
socrates
little-prince
```

It must contain this mode rule:

```text
1 selected figure     → One-on-One
2–6 selected figures  → Council
0 selected figures    → Ask for a selection or offer a recommendation
```

It must require the pre-dialogue response shape:

```text
Selection Proposal
- Recommended figures: <one or more canonical names>
- Reason per figure: <one sentence each>
- Resulting mode: One-on-One | Council
- Files to load: <exact repository paths>
- Awaiting confirmation: yes

Reply with one of:
- CONFIRM
- ADD <figure>
- REMOVE <figure>
- REPLACE WITH <comma-separated figures>
- COUNCIL <comma-separated figures>
```

State explicitly that no character voice begins before `CONFIRM`, unselected
figures do not speak, and any later membership change requires confirmation.

- [ ] **Step 3: Create `START_HERE.md`**

Use these sections in this order:

```markdown
# Start Here
## 1. Ask a question
## 2. Select figures
## 3. Confirm the mode and loaded files
## 4. Conduct the dialogue
## 5. Close and save the session
## 6. Review memory candidates
## Quick-start prompt
```

The quick-start prompt must instruct a future session to read
`PROJECT_CONTEXT.md`, `constitution/charter.md`,
`prompts/role-selection.md`, and the confirmed character files. It must say that
the system recommends but Aeris confirms, and that memory is not written until
reviewed.

- [ ] **Step 4: Link the entry point from `README.md`**

Add `START_HERE.md` as the first item under the reading order and add one sentence:

```text
To begin an operational session, start with START_HERE.md.
```

Do not rewrite the project goals or character table.

- [ ] **Step 5: Run routing validation**

Run:

```bash
test -f START_HERE.md && \
test -f prompts/role-selection.md && \
rg -q '1 selected figure.*One-on-One' prompts/role-selection.md && \
rg -q '2–6 selected figures.*Council' prompts/role-selection.md && \
rg -q 'Awaiting confirmation: yes' prompts/role-selection.md && \
rg -q 'START_HERE.md' README.md
```

Expected: exit 0.

- [ ] **Step 6: Verify canon files were not touched**

Run:

```bash
test -z "$(git diff --name-only -- characters constitution)"
```

Expected: exit 0.

- [ ] **Step 7: Commit Task 1**

```bash
git add START_HERE.md prompts/role-selection.md README.md
git commit -m "Add confirmed character routing entry point"
```

---

### Task 2: One-on-one and Council session lifecycle

**Files:**

- Create: `prompts/session-protocol.md`
- Modify: `prompts/one-on-one.md`
- Modify: `prompts/council.md`
- Create: `schemas/session-schema.md`
- Create: `templates/session.md`
- Create: `sessions/README.md`

**Interfaces:**

- Consumes: confirmed `Selected Figures`, `Mode`, and `Load` list from Task 1.
- Produces: a session record with `Session Summary`, `Memory Candidates`, and `Actions / Decisions`, consumed by Task 3.

- [ ] **Step 1: Run the pre-implementation check and confirm it fails**

Run:

```bash
test -f prompts/session-protocol.md && \
test -f schemas/session-schema.md && \
test -f templates/session.md && \
test -f sessions/README.md
```

Expected: non-zero exit because the files do not yet exist.

- [ ] **Step 2: Create `schemas/session-schema.md`**

Define this exact front matter contract:

```yaml
session_id: session-YYYY-MM-DD-NNN
date: YYYY-MM-DD
status: open | closed
mode: one-on-one | council
selected_figures:
  - canonical-figure-slug
question: "Exact user question"
loaded_files:
  - path/from/repository.md
loaded_memory:
  - memory-id
```

Define these required closing headings:

```text
Session Summary
Memory Candidates
Actions / Decisions
```

State that `selected_figures` has one item for one-on-one and two through six
items for Council.

- [ ] **Step 3: Create `templates/session.md`**

Include the complete front matter from the schema followed by:

```markdown
# Session

## Question

## Selection Confirmation

## Dialogue

## Session Summary

- What happened?
- What was discovered?
- What remains unresolved?

## Memory Candidates

No candidates unless explicitly listed with candidate IDs.

## Actions / Decisions

No decision unless Aeris explicitly made it.
```

Defaults must be `status: open`; the template must not contain an accepted
memory or invented claim.

- [ ] **Step 4: Create `prompts/session-protocol.md`**

Define five phases:

```text
OPEN → LOAD → DIALOGUE → CLOSE → MEMORY REVIEW
```

Require the session record to be saved before memory review changes any
`memory/*/current.md` file. Define conversion rules:

```text
ADD confirmed second figure → convert One-on-One to Council
REMOVE until one remains    → convert Council to One-on-One after confirmation
Unconfirmed membership edit → do not change mode
```

Require the load preview to include only relevant shared memory and memory owned
by selected figures. Private memory must not be exposed to another figure unless
Aeris explicitly changes the visibility or authorizes that access.

- [ ] **Step 5: Update `prompts/one-on-one.md`**

Require exactly one confirmed selected figure. Replace generic assumptions with
the confirmed selection and exact load list. Add:

```text
If another figure is needed, recommend ADD <figure> and stop for confirmation.
Do not speak as the proposed figure before confirmation.
```

Retain the existing canon-preservation and closing-output instructions.

- [ ] **Step 6: Update `prompts/council.md`**

Replace the fixed five-speaker output with a selected-member structure:

```text
Council Record

Selected Figures
- <confirmed canonical figures only>

Contributions
<one visibly attributed section per selected advisory figure>

Tensions
- Where do the selected figures disagree?

Aeris
- Final interpretation or decision
- Why?
- What remains unresolved?
```

If Aeris is selected, Aeris appears only in synthesis and is not duplicated as
an advisory contribution. Unselected figures do not receive headings.

- [ ] **Step 7: Create `sessions/README.md`**

Define the path and naming rule:

```text
sessions/YYYY-MM-DD/<session-id>-<short-slug>.md
```

State that raw or summarized session content is evidence, not accepted memory,
and that a closed record retains rejected and deferred candidates.

- [ ] **Step 8: Run session validation**

Run:

```bash
for f in prompts/session-protocol.md schemas/session-schema.md templates/session.md sessions/README.md; do test -f "$f" || exit 1; done
for h in 'Session Summary' 'Memory Candidates' 'Actions / Decisions'; do rg -q "$h" templates/session.md || exit 1; done
rg -q 'exactly one confirmed' prompts/one-on-one.md
rg -q 'Unselected figures do not' prompts/council.md
rg -q 'OPEN.*LOAD.*DIALOGUE.*CLOSE.*MEMORY REVIEW' prompts/session-protocol.md
```

Expected: exit 0.

- [ ] **Step 9: Verify character and constitution files remain untouched**

```bash
test -z "$(git diff --name-only -- characters constitution)"
```

Expected: exit 0.

- [ ] **Step 10: Commit Task 2**

```bash
git add prompts/session-protocol.md prompts/one-on-one.md prompts/council.md schemas/session-schema.md templates/session.md sessions/README.md
git commit -m "Define Stage 0 session lifecycle"
```

---

### Task 3: Selective memory review and role-owned stores

**Files:**

- Create: `prompts/memory-review.md`
- Modify: `prompts/memory-protocol.md`
- Create: `schemas/memory-schema.md`
- Modify: `memory/README.md`
- Create: `memory/aeris/current.md`
- Create: `memory/iron-regent/current.md`
- Create: `memory/avalokita/current.md`
- Create: `memory/metis/current.md`
- Create: `memory/socrates/current.md`
- Create: `memory/little-prince/current.md`
- Create: `memory/shared/current.md`

**Interfaces:**

- Consumes: closed session record and its candidate IDs from Task 2.
- Produces: explicitly approved stable memory entries in exactly one owner store, plus retained review outcomes in the source session.

- [ ] **Step 1: Run the pre-implementation check and confirm it fails**

Run:

```bash
test -f prompts/memory-review.md && \
test -f schemas/memory-schema.md && \
test -f memory/aeris/current.md && \
test -f memory/shared/current.md
```

Expected: non-zero exit because the files do not yet exist.

- [ ] **Step 2: Create `schemas/memory-schema.md`**

Define the candidate schema exactly:

```yaml
candidate_id: candidate-YYYY-MM-DD-NNN
revision_of: null | memory-YYYY-MM-DD-NNN
owner: shared | aeris | iron-regent | avalokita | metis | socrates | little-prince
visibility: private | council | sovereign
type: belief | emotion | event | decision | observation
statement: "Exact candidate statement"
epistemic_status: observation | hypothesis
confidence: low | medium | high
evidence:
  - sessions/YYYY-MM-DD/session-file.md
created_at: YYYY-MM-DD
review_status: pending | rejected | deferred | promoted
approved_by_aeris: false
```

Define the accepted-memory schema exactly:

```yaml
memory_id: memory-YYYY-MM-DD-NNN
source_candidate_id: candidate-YYYY-MM-DD-NNN
owner: shared | aeris | iron-regent | avalokita | metis | socrates | little-prince
visibility: private | council | sovereign
type: belief | emotion | event | decision | observation
statement: "Exact Aeris-approved statement"
epistemic_status: observation | hypothesis
confidence: low | medium | high
evidence:
  - sessions/YYYY-MM-DD/session-file.md
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
approved_by_aeris: true
supersedes: null | memory-YYYY-MM-DD-NNN
state: current | superseded | archived
```

Do not use `status` for both epistemic and lifecycle meaning; use the exact
field names `epistemic_status`, `review_status`, and `state`.

- [ ] **Step 3: Create `prompts/memory-review.md`**

Define the candidate commands and effects exactly:

```text
ACCEPT <candidate-id>
→ Promote exactly as shown.

EDIT <candidate-id>: <replacement>
→ Replace the pending text for review; do not promote until ACCEPT.

REJECT <candidate-id>
→ Mark rejected in the source session; do not write to memory.

DEFER <candidate-id>
→ Mark deferred in the source session; do not write to memory.
```

Define existing-memory commands:

```text
REVISE <memory-id>: <replacement>
→ Create a pending candidate with revision_of set to that memory ID; if accepted, supersedes copies revision_of.

ARCHIVE <memory-id>
→ Set state to archived after Aeris confirms; preserve evidence and Git history.

KEEP <memory-id>
→ Make no change.
```

Prohibit anonymous batch acceptance. Multiple operations are valid only when
every candidate or memory ID is listed.

- [ ] **Step 4: Align `prompts/memory-protocol.md`**

Replace the earlier overlapping `status` field with the exact schema field names
from Step 2. Add the complete review and revision lifecycle. Preserve the existing
example that distinguishes a hypothesis from a fact and preserve the existing
sovereign-consent rule without rewording it.

- [ ] **Step 5: Create the seven `current.md` stores**

Create:

```text
memory/aeris/current.md
memory/iron-regent/current.md
memory/avalokita/current.md
memory/metis/current.md
memory/socrates/current.md
memory/little-prince/current.md
memory/shared/current.md
```

Each role file contains only:

```markdown
# Current Memory — <Canonical Figure Name>

Only Aeris-approved current memory owned by <canonical owner slug> belongs here.

No accepted memory entries yet.
```

The shared file uses:

```markdown
# Current Shared Memory

Only Aeris-approved current memory with `owner: shared` belongs here.

No accepted memory entries yet.
```

Do not copy `memory/shared/foundations.md` into these files and do not invent any
personal memory.

- [ ] **Step 6: Update `memory/README.md`**

Document:

- owner-to-file mapping;
- visibility loading rules;
- pending, rejected, deferred, promoted, current, superseded, and archived states;
- accepted memory is loaded only when `state: current`;
- `EDIT` still needs `ACCEPT`;
- `REVISE` creates a candidate rather than overwriting;
- Aeris reviews canon and persistent-memory changes.

- [ ] **Step 7: Run memory validation**

Run:

```bash
for owner in aeris iron-regent avalokita metis socrates little-prince; do test -f "memory/$owner/current.md" || exit 1; done
test -f memory/shared/current.md
for cmd in ACCEPT EDIT REJECT DEFER REVISE ARCHIVE KEEP; do rg -q "$cmd" prompts/memory-review.md || exit 1; done
for field in epistemic_status review_status approved_by_aeris supersedes state; do rg -q "$field" schemas/memory-schema.md || exit 1; done
! rg -n 'approved_by_aeris: true' memory/*/current.md memory/shared/current.md
```

Expected: exit 0. The final negative search confirms empty stores contain no
invented accepted memory.

- [ ] **Step 8: Verify canon files remain untouched**

```bash
test -z "$(git diff --name-only -- characters constitution)"
```

Expected: exit 0.

- [ ] **Step 9: Commit Task 3**

```bash
git add prompts/memory-review.md prompts/memory-protocol.md schemas/memory-schema.md memory
git commit -m "Add selective memory review workflow"
```

---

### Task 4: End-to-end dry run and entry-point integration

**Files:**

- Create: `examples/stage-0-dry-run.md`
- Modify: `PROJECT_CONTEXT.md`
- Modify: `README.md`

**Interfaces:**

- Consumes: routing, session, and memory contracts from Tasks 1–3.
- Produces: one non-personal worked example and discoverable links from both repository entry points.

- [ ] **Step 1: Run the pre-implementation check and confirm it fails**

Run:

```bash
test -f examples/stage-0-dry-run.md && \
rg -q 'START_HERE.md' PROJECT_CONTEXT.md
```

Expected: non-zero exit because the example does not exist and the project
context does not yet link to the operational entry point.

- [ ] **Step 2: Create the fictional dry run**

Use this explicit non-canonical scenario:

```text
Question: Should the fictional subject begin a ninety-day research project now?
Initial recommendation: Metis
User action: ADD Socrates
Confirmed selection: Metis, Socrates
Derived mode: Council
```

Show:

1. recommendation awaiting confirmation;
2. the confirmed second figure converting the mode to Council;
3. only Metis and Socrates contributing;
4. Aeris synthesis labeled as fictional example output;
5. two fictional memory candidates;
6. `EDIT` leaving one candidate pending;
7. `ACCEPT` promoting only the explicitly accepted candidate;
8. `DEFER` leaving the other out of current memory;
9. the resulting accepted-memory record using every required schema field.

Begin the file with:

```text
This example is fictional, non-canonical, and contains no claim about Aeris.
```

- [ ] **Step 3: Update `PROJECT_CONTEXT.md` and `README.md`**

Add links to:

- `START_HERE.md`;
- the approved spec;
- the implementation plan;
- `examples/stage-0-dry-run.md`.

Only add operational navigation. Do not rewrite project purpose, character
definitions, theory, or symbols.

- [ ] **Step 4: Validate all Markdown links**

Run:

```bash
ruby -e 'broken=[]; Dir["**/*.md"].each{|f| File.read(f).scan(/\[[^\]]*\]\(([^)]+)\)/).flatten.each{|l| next if l =~ /\A(?:https?:|mailto:|#)/; p=l.split("#",2).first; t=File.expand_path(p,File.dirname(f)); broken << "#{f}: #{l}" unless File.exist?(t)}}; abort("Broken links:\n#{broken.join("\n")}") unless broken.empty?; puts "Markdown links: valid"'
```

Expected: `Markdown links: valid`.

- [ ] **Step 5: Run dry-run content checks**

```bash
rg -q 'fictional, non-canonical' examples/stage-0-dry-run.md
rg -q 'Metis, Socrates' examples/stage-0-dry-run.md
rg -q 'mode: council' examples/stage-0-dry-run.md
rg -q 'review_status: deferred' examples/stage-0-dry-run.md
rg -q 'approved_by_aeris: true' examples/stage-0-dry-run.md
```

Expected: exit 0.

- [ ] **Step 6: Commit Task 4**

```bash
git add examples/stage-0-dry-run.md PROJECT_CONTEXT.md README.md
git commit -m "Document the Stage 0 operating workflow"
```

---

### Task 5: Full verification and handoff

**Files:**

- Verify all files from Tasks 1–4.
- Do not create additional files unless a validation failure proves one is required by the approved spec.

**Interfaces:**

- Consumes: the completed Stage 0 text mechanism.
- Produces: verified commits on `main` and a concise implementation report.

- [ ] **Step 1: Verify required files**

Run:

```bash
required=(
  START_HERE.md
  prompts/role-selection.md
  prompts/session-protocol.md
  prompts/memory-review.md
  schemas/session-schema.md
  schemas/memory-schema.md
  templates/session.md
  sessions/README.md
  examples/stage-0-dry-run.md
  memory/aeris/current.md
  memory/iron-regent/current.md
  memory/avalokita/current.md
  memory/metis/current.md
  memory/socrates/current.md
  memory/little-prince/current.md
  memory/shared/current.md
)
for f in "${required[@]}"; do test -f "$f" || { echo "Missing: $f"; exit 1; }; done
echo "Required files: ${#required[@]}/${#required[@]}"
```

Expected: `Required files: 16/16`.

- [ ] **Step 2: Verify mode and confirmation rules**

```bash
rg -q '1 selected figure.*One-on-One' prompts/role-selection.md
rg -q '2–6 selected figures.*Council' prompts/role-selection.md
rg -q '0 selected figures.*Ask for a selection' prompts/role-selection.md
rg -q 'Awaiting confirmation: yes' prompts/role-selection.md
rg -q 'Unselected figures do not' prompts/council.md
rg -q 'exactly one confirmed' prompts/one-on-one.md
```

Expected: exit 0.

- [ ] **Step 3: Verify memory review rules**

```bash
for cmd in ACCEPT EDIT REJECT DEFER REVISE ARCHIVE KEEP; do rg -q "$cmd" prompts/memory-review.md || exit 1; done
rg -q 'do not promote until ACCEPT' prompts/memory-review.md
rg -q 'approved_by_aeris: false' schemas/memory-schema.md
rg -q 'approved_by_aeris: true' schemas/memory-schema.md
! rg -n 'approved_by_aeris: true' memory/*/current.md memory/shared/current.md
```

Expected: exit 0.

- [ ] **Step 4: Verify scope exclusions and canon protection**

Run from the repository root:

```bash
test ! -f package.json
test ! -f astro.config.mjs
test ! -e .github/workflows
test -z "$(git diff 65a056e --name-only -- characters constitution)"
```

Expected: exit 0. The last command proves implementation did not change
character or constitution files relative to the approved-plan base commit.

- [ ] **Step 5: Verify formatting, placeholders, and links**

```bash
git diff --check 65a056e..HEAD
if rg -n 'T''BD|T''ODO|PLACE''HOLDER|fill in det''ails|implement lat''er' --glob '*.md' .; then exit 1; fi
ruby -e 'broken=[]; Dir["**/*.md"].each{|f| File.read(f).scan(/\[[^\]]*\]\(([^)]+)\)/).flatten.each{|l| next if l =~ /\A(?:https?:|mailto:|#)/; p=l.split("#",2).first; t=File.expand_path(p,File.dirname(f)); broken << "#{f}: #{l}" unless File.exist?(t)}}; abort("Broken links:\n#{broken.join("\n")}") unless broken.empty?; puts "Markdown links: valid"'
```

Expected: exit 0 and `Markdown links: valid`.

- [ ] **Step 6: Confirm clean worktree and review commits**

```bash
git status --short --branch
git log --oneline 65a056e..HEAD
```

Expected: no uncommitted files; four task commits are listed.

- [ ] **Step 7: Push verified implementation**

```bash
git push origin main
```

Expected: `main` updates successfully without force push.

- [ ] **Step 8: Report evidence**

Report:

- files created and modified;
- the one-selection and multi-selection behavior;
- the candidate and existing-memory commands;
- the fictional dry-run result;
- exact validation commands and outcomes;
- commit hashes pushed to `main`;
- confirmation that no website files, character files, or constitution files changed.
